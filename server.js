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
  frameguard: false, // we control this per-route
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js-na2.hsforms.net", "https://forms.hsforms.com", "https://static.hsappstatic.net", "https://241839045.fs1.hubspotusercontent-na2.net", "https://static.cloudflareinsights.com", "https://www.googletagmanager.com", "https://googletagmanager.com", "https://www.google-analytics.com", "https://connect.facebook.net", "https://static.ads-twitter.com", "https://analytics.twitter.com", "https://vercel.live"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://forms.hsforms.com", "https://forms-na2.hsforms.com", "https://js-na2.hsforms.net", "https://www.google-analytics.com", "https://www.googletagmanager.com", "https://www.facebook.com", "https://t.co", "https://analytics.twitter.com", "https://ad.doubleclick.net", "https://www.google.com", "https://pagead2.googlesyndication.com"],
      connectSrc: ["'self'", "https://api.hsforms.com", "https://forms.hubspot.com", "https://js-na2.hsforms.net", "https://forms-na2.hsforms.com", "https://*.hubspot.com", "https://*.hsforms.com", "https://www.google-analytics.com", "https://analytics.google.com", "https://stats.g.doubleclick.net", "https://www.facebook.com", "https://connect.facebook.net", "https://analytics.twitter.com", "https://www.google.com", "https://pagead2.googlesyndication.com"],
      formAction: ["'self'", "https://forms-na2.hsforms.com"],
      frameSrc: ["https://forms-na2.hsforms.com", "https://js-na2.hsforms.net", "https://www.googletagmanager.com", "https://www.facebook.com"],
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

// ── Page routes ──────────────────────────────────────────────────────

// ── OG image — dynamic SVG card with live stats ─────────────────────
app.get("/og-image", async (req, res) => {
  try {
    await ensureInit();
    const reports = await db.getPublicReports();
    const BASELINE = new Date(2025, 0, 1);
    const counted = reports.filter(r => {
      const d = parseReportDate(r.date);
      return d >= BASELINE
        && ["NEW"].includes(r.lossType)
        && ["EXPLICIT","BLAMED","MIXED"].includes(r.aiAttribution);
    });
    const total = counted.reduce((s, r) => s + (Number(r.jobsLost) || 0), 0);
    const totalStr = new Intl.NumberFormat("en-US").format(total);
    const dates = counted.map(r => parseReportDate(r.date)).sort((a, b) => a - b);
    const latest = dates.length
      ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(dates[dates.length - 1])
      : "N/A";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#192d17"/>
      <stop offset="100%" stop-color="#1e3a1a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Accent bar -->
  <rect y="0" width="1200" height="6" fill="#e4991b"/>
  <!-- Live dot -->
  <circle cx="80" cy="96" r="6" fill="#e4991b"/>
  <text x="98" y="101" fill="#b8c8b1" font-family="system-ui,sans-serif" font-size="18" font-weight="600" letter-spacing="2">UPDATED DAILY</text>
  <!-- Title -->
  <text x="80" y="175" fill="#f3f7f1" font-family="system-ui,sans-serif" font-size="52" font-weight="900" letter-spacing="-0.5">AI Job Loss Tracker</text>
  <!-- Divider -->
  <rect x="80" y="205" width="120" height="3" rx="1.5" fill="#e4991b" opacity="0.7"/>
  <!-- Counter -->
  <text x="80" y="330" fill="#f3f7f1" font-family="system-ui,sans-serif" font-size="120" font-weight="900" letter-spacing="-2">${totalStr}</text>
  <text x="80" y="375" fill="#b8c8b1" font-family="system-ui,sans-serif" font-size="24" font-weight="700" letter-spacing="3">TOTAL AI-LINKED JOB LOSSES</text>
  <!-- Stats boxes -->
  <rect x="80" y="420" width="240" height="80" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <text x="200" y="455" fill="#b8c8b1" font-family="system-ui,sans-serif" font-size="14" font-weight="700" letter-spacing="2" text-anchor="middle">REPORTS TRACKED</text>
  <text x="200" y="487" fill="#f3f7f1" font-family="system-ui,sans-serif" font-size="32" font-weight="900" text-anchor="middle">${counted.length}</text>
  <rect x="340" y="420" width="280" height="80" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <text x="480" y="455" fill="#b8c8b1" font-family="system-ui,sans-serif" font-size="14" font-weight="700" letter-spacing="2" text-anchor="middle">LATEST REPORT</text>
  <text x="480" y="487" fill="#f3f7f1" font-family="system-ui,sans-serif" font-size="26" font-weight="800" text-anchor="middle">${latest}</text>
  <!-- Branding -->
  <text x="80" y="580" fill="#b8c8b1" font-family="system-ui,sans-serif" font-size="20" font-weight="600">The Alliance for Secure AI</text>
  <text x="1120" y="580" fill="#4a6845" font-family="system-ui,sans-serif" font-size="18" font-weight="600" text-anchor="end">jobloss.ai</text>
</svg>`;

    res.set("Content-Type", "image/svg+xml");
    res.set("Cache-Control", "public, max-age=3600"); // 1 hr cache
    res.send(svg);
  } catch (err) {
    console.error("[og-image]", err);
    res.status(500).send("Error generating OG image");
  }
});

function parseReportDate(v) {
  if (typeof v === "string") {
    let m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(+m[1], +m[2]-1, +m[3]);
    m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return new Date(+m[3], +m[1]-1, +m[2]);
  }
  const d = new Date(v); return isNaN(d.getTime()) ? new Date(2025, 0, 1) : d;
}

// ── HTML routes ──────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin.html"));
});

// Widget — served as iframe on secureainow.org
app.get("/widget", (req, res) => {
  // Allow this route to be embedded as an iframe on any domain
  res.removeHeader("X-Frame-Options");
  res.setHeader("Content-Security-Policy", "frame-ancestors *");
  res.sendFile(path.join(__dirname, "public", "widget.html"));
});

// Mini widget — counter-only crop for embedding on the main site
app.get("/widget-mini", (req, res) => {
  // Allow this route to be embedded as an iframe on any domain
  res.removeHeader("X-Frame-Options");
  res.setHeader("Content-Security-Policy", "frame-ancestors * https: http:");
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
    });
  }).catch(err => {
    console.error("[FATAL] Startup failed:", err);
    process.exit(1);
  });
}
