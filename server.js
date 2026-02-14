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

const app = express();
const PORT = process.env.PORT || 3000;

// ── Config validation ────────────────────────────────────────────────

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error("[FATAL] ADMIN_PASSWORD environment variable is required.");
  process.exit(1);
}

const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production-" + Math.random();

// Hash password at startup (so we never compare plaintext)
let passwordHash;
(async () => {
  passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
})();

// ── Middleware ────────────────────────────────────────────────────────

app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
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

// ── Page routes ──────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin.html"));
});

// ── Boot ─────────────────────────────────────────────────────────────

async function start() {
  try {
    await db.migrate();

    // Auto-seed on first boot if database is empty
    const { rows } = await db.pool.query("SELECT COUNT(*) AS cnt FROM reports");
    if (parseInt(rows[0].cnt) === 0) {
      console.log("[server] Empty database detected — importing starter data...");
      try {
        const seed = require("./seed-data");
        for (const row of seed) {
          await db.createReport(row);
        }
        console.log(`[server] Seeded ${seed.length} reports`);
      } catch (e) {
        console.log("[server] No seed-data.js found or seed failed, starting empty:", e.message);
      }
    }

    app.listen(PORT, () => {
      console.log(`[server] Running on port ${PORT}`);
      console.log(`[server] Dashboard: http://localhost:${PORT}`);
      console.log(`[server] Admin: http://localhost:${PORT}/admin`);
    });
  } catch (err) {
    console.error("[FATAL] Startup failed:", err);
    process.exit(1);
  }
}

start();
