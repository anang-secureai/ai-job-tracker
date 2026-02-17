// db.js — PostgreSQL connection, migrations, and query helpers
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("railway")
    ? { rejectUnauthorized: false }
    : false,
});

// ── Migrations ───────────────────────────────────────────────────────

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id            SERIAL PRIMARY KEY,
        date          DATE NOT NULL,
        company       VARCHAR(255) NOT NULL,
        industry      VARCHAR(255) DEFAULT 'Unknown',
        region        VARCHAR(10) DEFAULT 'GLOBAL',
        country       VARCHAR(255) DEFAULT 'Global',
        workforce     INTEGER DEFAULT 0,
        jobs_lost     INTEGER NOT NULL,
        loss_type     VARCHAR(20) DEFAULT 'NEW',
        ai_attribution VARCHAR(20) DEFAULT 'BLAMED',
        source_label  VARCHAR(255),
        source_url    TEXT,
        stock_delta_pct DECIMAL(8,2),
        estimate      BOOLEAN DEFAULT false,
        include       BOOLEAN DEFAULT false,
        created_at    TIMESTAMPTZ DEFAULT NOW(),
        updated_at    TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Session table for connect-pg-simple
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" VARCHAR NOT NULL COLLATE "default",
        "sess" JSON NOT NULL,
        "expire" TIMESTAMP(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);

    // Candidates table — articles flagged by Event Registry for human review
    await client.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id            SERIAL PRIMARY KEY,
        external_id   VARCHAR(255) UNIQUE NOT NULL,
        title         TEXT NOT NULL,
        summary       TEXT,
        source_name   VARCHAR(255),
        source_url    TEXT,
        published_at  DATE,
        status        VARCHAR(20) DEFAULT 'PENDING',
        report_id     INTEGER REFERENCES reports(id) ON DELETE SET NULL,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS "IDX_candidates_status" ON candidates (status);
    `);

    console.log("[db] Migrations complete");
  } finally {
    client.release();
  }
}

// ── Query helpers ────────────────────────────────────────────────────

async function getPublicReports() {
  const { rows } = await pool.query(
    `SELECT id, date, company, industry, region, country, workforce,
            jobs_lost, loss_type, ai_attribution, source_label, source_url,
            stock_delta_pct, estimate
     FROM reports
     WHERE include = true
     ORDER BY date DESC, id DESC`
  );
  return rows.map(formatRow);
}

async function getAllReports() {
  const { rows } = await pool.query(
    `SELECT * FROM reports ORDER BY date DESC, id DESC`
  );
  return rows.map(formatRow);
}

async function getReport(id) {
  const { rows } = await pool.query(`SELECT * FROM reports WHERE id = $1`, [id]);
  return rows[0] ? formatRow(rows[0]) : null;
}

async function createReport(data) {
  const { rows } = await pool.query(
    `INSERT INTO reports (date, company, industry, region, country, workforce,
       jobs_lost, loss_type, ai_attribution, source_label, source_url,
       stock_delta_pct, estimate, include)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING *`,
    [
      data.date, data.company, data.industry || "Unknown",
      (data.region || "GLOBAL").toUpperCase(),
      data.country || "Global",
      parseInt(data.workforce) || 0,
      parseInt(data.jobs_lost) || 0,
      (data.loss_type || "NEW").toUpperCase(),
      (data.ai_attribution || "BLAMED").toUpperCase(),
      data.source_label || "",
      data.source_url || "",
      data.stock_delta_pct != null && data.stock_delta_pct !== "" ? parseFloat(data.stock_delta_pct) : null,
      !!data.estimate,
      !!data.include,
    ]
  );
  return formatRow(rows[0]);
}

async function updateReport(id, data) {
  const { rows } = await pool.query(
    `UPDATE reports SET
       date=$1, company=$2, industry=$3, region=$4, country=$5,
       workforce=$6, jobs_lost=$7, loss_type=$8, ai_attribution=$9,
       source_label=$10, source_url=$11, stock_delta_pct=$12,
       estimate=$13, include=$14, updated_at=NOW()
     WHERE id=$15
     RETURNING *`,
    [
      data.date, data.company, data.industry || "Unknown",
      (data.region || "GLOBAL").toUpperCase(),
      data.country || "Global",
      parseInt(data.workforce) || 0,
      parseInt(data.jobs_lost) || 0,
      (data.loss_type || "NEW").toUpperCase(),
      (data.ai_attribution || "BLAMED").toUpperCase(),
      data.source_label || "",
      data.source_url || "",
      data.stock_delta_pct != null && data.stock_delta_pct !== "" ? parseFloat(data.stock_delta_pct) : null,
      !!data.estimate,
      !!data.include,
      id,
    ]
  );
  return rows[0] ? formatRow(rows[0]) : null;
}

async function deleteReport(id) {
  const { rowCount } = await pool.query(`DELETE FROM reports WHERE id = $1`, [id]);
  return rowCount > 0;
}

async function toggleInclude(id) {
  const { rows } = await pool.query(
    `UPDATE reports SET include = NOT include, updated_at = NOW()
     WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ? formatRow(rows[0]) : null;
}

async function getStats() {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE include) AS published,
      COUNT(*) FILTER (WHERE NOT include) AS draft,
      COUNT(*) AS total
    FROM reports
  `);
  return rows[0];
}

// ── Candidate query helpers ───────────────────────────────────────────

async function getCandidates(status = null) {
  const where = status ? "WHERE status = $1" : "";
  const params = status ? [status.toUpperCase()] : [];
  const { rows } = await pool.query(
    `SELECT * FROM candidates ${where} ORDER BY published_at DESC, id DESC`,
    params
  );
  return rows.map(formatCandidate);
}

async function getCandidateStats() {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'PENDING') AS pending,
      COUNT(*) FILTER (WHERE status = 'APPROVED') AS approved,
      COUNT(*) FILTER (WHERE status = 'REJECTED') AS rejected,
      COUNT(*) AS total
    FROM candidates
  `);
  return rows[0];
}

async function createCandidate(data) {
  try {
    await pool.query(
      `INSERT INTO candidates (external_id, title, summary, source_name, source_url, published_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [data.external_id, data.title, data.summary || "",
       data.source_name || "", data.source_url || "", data.published_at]
    );
    return "created";
  } catch (e) {
    if (e.code === "23505") return "exists"; // unique constraint = duplicate
    throw e;
  }
}

async function updateCandidateStatus(id, status, reportId = null) {
  const { rows } = await pool.query(
    `UPDATE candidates SET status = $1, report_id = $2 WHERE id = $3 RETURNING *`,
    [status.toUpperCase(), reportId, id]
  );
  return rows[0] ? formatCandidate(rows[0]) : null;
}

async function deleteOldCandidates(daysOld = 60) {
  const { rowCount } = await pool.query(
    `DELETE FROM candidates WHERE status IN ('REJECTED') AND created_at < NOW() - INTERVAL '${daysOld} days'`
  );
  return rowCount;
}

function formatCandidate(r) {
  return {
    id: r.id,
    externalId: r.external_id,
    title: r.title,
    summary: r.summary,
    sourceName: r.source_name,
    sourceUrl: r.source_url,
    publishedAt: r.published_at instanceof Date ? r.published_at.toISOString().slice(0, 10) : String(r.published_at || "").slice(0, 10),
    status: r.status,
    reportId: r.report_id,
    createdAt: r.created_at,
  };
}

// Format DB row → clean JSON
function formatRow(r) {
  return {
    id: r.id,
    date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date || "").slice(0, 10),
    company: r.company,
    industry: r.industry,
    region: r.region,
    country: r.country,
    workforce: r.workforce,
    jobsLost: r.jobs_lost,
    lossType: r.loss_type,
    aiAttribution: r.ai_attribution,
    sourceLabel: r.source_label,
    sourceUrl: r.source_url,
    stockDeltaPct: r.stock_delta_pct != null ? parseFloat(r.stock_delta_pct) : null,
    estimate: r.estimate,
    include: r.include,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

module.exports = {
  pool, migrate,
  getPublicReports, getAllReports, getReport,
  createReport, updateReport, deleteReport,
  toggleInclude, getStats,
  getCandidates, getCandidateStats, createCandidate,
  updateCandidateStatus, deleteOldCandidates,
};
