// server.js — AI Job Loss Tracker API + static serving
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const bcrypt = require("bcryptjs");
const db = require("./db");
const er = require("./event-registry");

// Optional: daily auto-fetch (only if cron is installed)
let cron;
try { cron = require("node-cron"); } catch { cron = null; }

const app = express();

// ── Config validation ────────────────────────────────────────────────

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error("[WARN] ADMIN_PASSWORD is not set — admin login will be disabled.");
}

const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production-" + Math.random();

// Hash password at startup (so we never compare plaintext)
let passwordHash;
if (ADMIN_PASSWORD) {
  (async () => {
    passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  })();
}

// ── Middleware ────────────────────────────────────────────────────────

app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js-na2.hsforms.net", "https://forms.hsforms.com", "https://static.hsappstatic.net", "https://241839045.fs1.hubspotusercontent-na2.net", "https://static.cloudflareinsights.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://forms.hsforms.com", "https://forms-na2.hsforms.com", "https://js-na2.hsforms.net"],
      connectSrc: ["'self'", "https://api.hsforms.com", "https://forms.hubspot.com", "https://js-na2.hsforms.net", "https://forms-na2.hsforms.com", "https://*.hubspot.com", "https://*.hsforms.com"],
      formAction: ["'self'", "https://forms-na2.hsforms.com"],
      frameSrc: ["https://forms-na2.hsforms.com", "https://js-na2.hsforms.net"],
    },
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Railway (and most hosts) terminate SSL at the proxy layer.
// Without this, Express thinks all connections are HTTP and refuses to set secure cookies.
app.set("trust proxy", 1);

app.use(session({
  store: new PgSession({ pool: db.pool, tableName: "session" }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
}));

// ── Lazy database init — runs once per cold start ────────────────────
let _initPromise = null;

function ensureInit() {
  if (!_initPromise) {
    _initPromise = (async () => {
      await db.migrate();
      const { rows } = await db.pool.query("SELECT COUNT(*) AS cnt FROM reports");
      if (parseInt(rows[0].cnt) === 0) {
        console.log("[server] Empty database — importing starter data...");
        try {
          const seed = require("./seed-data");
          for (const row of seed) {
            await db.createReport(row);
          }
          console.log(`[server] Seeded ${seed.length} reports`);
        } catch (e) {
          console.log("[server] No seed-data.js found, starting empty:", e.message);
        }
      }
    })().catch(err => {
      _initPromise = null; // allow retry on next request
      throw err;
    });
  }
  return _initPromise;
}

app.use(async (req, res, next) => {
  try {
    await ensureInit();
    next();
  } catch (err) {
    console.error("[init] Database initialization failed:", err);
    res.status(503).json({ error: "Service temporarily unavailable" });
  }
});

// ── Static files ─────────────────────────────────────────────────────

app.use("/assets", express.static(path.join(__dirname, "public/assets"), {
  maxAge: "7d",
  immutable: true,
}));

app.use(express.static(path.join(__dirname, "public"), {
  maxAge: "1h",
  index: false,            // let explicit routes handle / and /admin
}));

// ── Public API (no auth required) ────────────────────────────────────

// GET /api/reports — public-facing data (only include=true)
app.get("/api/reports", async (req, res) => {
  try {
    const reports = await db.getPublicReports();
    res.set("Cache-Control", "public, max-age=300"); // 5 min cache
    res.json({ ok: true, reports, count: reports.length });
  } catch (err) {
    console.error("[api] GET /api/reports error:", err);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

// ── Auth middleware ───────────────────────────────────────────────────

function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ ok: false, error: "Not authenticated" });
}

// ── Auth routes ──────────────────────────────────────────────────────

app.post("/api/login", async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ ok: false, error: "Password required" });

  const valid = await bcrypt.compare(password, passwordHash);
  if (!valid) return res.status(401).json({ ok: false, error: "Wrong password" });

  req.session.authenticated = true;
  res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get("/api/auth/check", (req, res) => {
  res.json({ ok: true, authenticated: !!(req.session && req.session.authenticated) });
});

// ── Admin API (auth required) ────────────────────────────────────────

// GET /api/admin/reports — all reports including drafts
app.get("/api/admin/reports", requireAuth, async (req, res) => {
  try {
    const reports = await db.getAllReports();
    const stats = await db.getStats();
    res.json({ ok: true, reports, stats });
  } catch (err) {
    console.error("[api] admin reports error:", err);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

// POST /api/admin/reports — create a report
app.post("/api/admin/reports", requireAuth, async (req, res) => {
  try {
    const { date, company, jobs_lost } = req.body;
    if (!date || !company || !jobs_lost) {
      return res.status(400).json({ ok: false, error: "date, company, and jobs_lost are required" });
    }
    const report = await db.createReport(req.body);
    res.status(201).json({ ok: true, report });
  } catch (err) {
    console.error("[api] create report error:", err);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

// PUT /api/admin/reports/:id — update a report
app.put("/api/admin/reports/:id", requireAuth, async (req, res) => {
  try {
    const report = await db.updateReport(req.params.id, req.body);
    if (!report) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, report });
  } catch (err) {
    console.error("[api] update report error:", err);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

// DELETE /api/admin/reports/:id
app.delete("/api/admin/reports/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await db.deleteReport(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("[api] delete report error:", err);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

// PATCH /api/admin/reports/:id/toggle — toggle include
app.patch("/api/admin/reports/:id/toggle", requireAuth, async (req, res) => {
  try {
    const report = await db.toggleInclude(req.params.id);
    if (!report) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, report });
  } catch (err) {
    console.error("[api] toggle error:", err);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

// ── Candidate API (Event Registry pipeline) ─────────────────────────

// GET /api/admin/candidates — list candidates with optional status filter
app.get("/api/admin/candidates", requireAuth, async (req, res) => {
  try {
    const status = req.query.status || null;
    const candidates = await db.getCandidates(status);
    const stats = await db.getCandidateStats();
    res.json({ ok: true, candidates, stats });
  } catch (err) {
    console.error("[api] candidates error:", err);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

// POST /api/admin/candidates/fetch — trigger Event Registry scan
app.post("/api/admin/candidates/fetch", requireAuth, async (req, res) => {
  try {
    const daysBack = parseInt(req.body.days_back) || 3;
    const result = await er.fetchCandidates(daysBack);
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error("[api] candidates fetch error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/admin/candidates/:id/approve — approve candidate → create draft report
app.post("/api/admin/candidates/:id/approve", requireAuth, async (req, res) => {
  try {
    const { company, jobs_lost, date, industry, ai_attribution } = req.body;
    if (!company || !jobs_lost) {
      return res.status(400).json({ ok: false, error: "company and jobs_lost required" });
    }
    // Create a draft report from the candidate
    const report = await db.createReport({
      date: date || new Date().toISOString().slice(0, 10),
      company,
      jobs_lost: parseInt(jobs_lost),
      industry: industry || "Unknown",
      ai_attribution: ai_attribution || "BLAMED",
      source_label: req.body.source_label || "",
      source_url: req.body.source_url || "",
      region: req.body.region || "GLOBAL",
      country: req.body.country || "Global",
      include: false, // starts as draft — team publishes when ready
    });
    // Link candidate to the report
    await db.updateCandidateStatus(req.params.id, "APPROVED", report.id);
    res.json({ ok: true, report });
  } catch (err) {
    console.error("[api] candidate approve error:", err);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

// POST /api/admin/candidates/:id/reject — mark candidate as not relevant
app.post("/api/admin/candidates/:id/reject", requireAuth, async (req, res) => {
  try {
    const candidate = await db.updateCandidateStatus(req.params.id, "REJECTED");
    if (!candidate) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, candidate });
  } catch (err) {
    console.error("[api] candidate reject error:", err);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

// ── Page routes ──────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin.html"));
});

app.get("/admin/candidates", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin-candidates.html"));
});

// Widget — served as iframe on secureainow.org
app.get("/widget", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "widget.html"));
});

// Mini widget — counter-only crop for embedding on the main site
app.get("/widget-mini", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "widget-mini.html"));
});

// ── Export for Vercel serverless; boot normally for local dev ─────────
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  ensureInit().then(() => {
    app.listen(PORT, () => {
      console.log(`[server] Running on port ${PORT}`);
      console.log(`[server] Dashboard: http://localhost:${PORT}`);
      console.log(`[server] Admin: http://localhost:${PORT}/admin`);

      // Daily auto-fetch from Event Registry at 8:00 AM UTC
      if (cron && process.env.EVENT_REGISTRY_API_KEY) {
        cron.schedule("0 8 * * *", async () => {
          console.log("[cron] Running daily Event Registry scan...");
          try {
            const result = await er.fetchCandidates(2);
            console.log(`[cron] Done: ${result.added} new, ${result.skipped} dupes`);
            const cleaned = await db.deleteOldCandidates(60);
            if (cleaned) console.log(`[cron] Cleaned ${cleaned} old rejected candidates`);
          } catch (e) {
            console.error("[cron] Event Registry scan failed:", e.message);
          }
        });
        console.log("[server] Daily Event Registry scan scheduled (08:00 UTC)");
      } else if (!process.env.EVENT_REGISTRY_API_KEY) {
        console.log("[server] EVENT_REGISTRY_API_KEY not set — candidate scanning disabled");
      }
    });
  }).catch(err => {
    console.error("[FATAL] Startup failed:", err);
    process.exit(1);
  });
}
