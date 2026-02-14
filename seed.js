// seed.js — Import starter data into the database
// Run: node seed.js (or: npm run seed)
require("dotenv").config();
const db = require("./db");

const STARTER_DATA = [
  { date:"2025-02-05", company:"Workday", industry:"Enterprise Software", region:"US", country:"United States", workforce:20588, jobs_lost:1750, loss_type:"NEW", ai_attribution:"EXPLICIT", source_label:"AP", source_url:"https://apnews.com/article/437581ad79d6e1cef2de7b300015dfbb", stock_delta_pct:-44.8, estimate:false, include:true },
  { date:"2025-05-07", company:"CrowdStrike", industry:"Cybersecurity", region:"US", country:"United States", workforce:10118, jobs_lost:500, loss_type:"NEW", ai_attribution:"EXPLICIT", source_label:"CNBC", source_url:"https://www.cnbc.com/2025/05/07/crowdstrike-announces-5percent-job-cuts-says-ai-reshaping-every-industry.html", stock_delta_pct:-4, estimate:false, include:true },
  { date:"2025-05-13", company:"Microsoft", industry:"Technology", region:"GLOBAL", country:"Global", workforce:228000, jobs_lost:6000, loss_type:"NEW", ai_attribution:"MIXED", source_label:"CNBC", source_url:"https://www.cnbc.com/2025/05/13/microsoft-is-cutting-3percent-of-workers-across-the-software-company.html", stock_delta_pct:-8.1, estimate:false, include:true },
  { date:"2025-07-02", company:"Microsoft", industry:"Technology", region:"GLOBAL", country:"Global", workforce:228000, jobs_lost:9000, loss_type:"NEW", ai_attribution:"MIXED", source_label:"CNBC", source_url:"https://www.cnbc.com/2025/07/03/microsoft-layoffs-hit-830-workers-in-home-state-of-washington-.html", stock_delta_pct:-15.9, estimate:false, include:true },
  { date:"2025-07-16", company:"Scale AI", industry:"AI Infrastructure", region:"GLOBAL", country:"Global", workforce:1400, jobs_lost:200, loss_type:"NEW", ai_attribution:"MIXED", source_label:"CNBC", source_url:"https://www.cnbc.com/2025/07/16/scale-ai-cuts-14percent-of-workforce-after-meta-investment-hiring-of-wang.html", stock_delta_pct:null, estimate:false, include:true },
  { date:"2025-10-22", company:"Meta", industry:"Technology", region:"US", country:"United States", workforce:72000, jobs_lost:600, loss_type:"NEW", ai_attribution:"MIXED", source_label:"AP", source_url:"https://apnews.com/article/7f7b77ba002f7095984f17ebd034bf60", stock_delta_pct:-7.2, estimate:false, include:true },
  { date:"2025-10-28", company:"Amazon", industry:"Technology / E-commerce", region:"GLOBAL", country:"Global", workforce:350000, jobs_lost:14000, loss_type:"NEW", ai_attribution:"BLAMED", source_label:"AP", source_url:"https://apnews.com/article/cb64af47ebb794541fbdfa8fd264932c", stock_delta_pct:-8.2, estimate:false, include:true },
  { date:"2026-01-27", company:"Pinterest", industry:"Social Media", region:"US", country:"United States", workforce:5205, jobs_lost:700, loss_type:"NEW", ai_attribution:"BLAMED", source_label:"AP", source_url:"https://apnews.com/article/cf278cf06929db07d5b1310ab7f91861", stock_delta_pct:-14.7, estimate:true, include:true },
  { date:"2026-01-28", company:"ASML", industry:"Semiconductor Equipment", region:"INTL", country:"Netherlands", workforce:42500, jobs_lost:1700, loss_type:"NEW", ai_attribution:"MIXED", source_label:"AP", source_url:"https://apnews.com/article/446babea4e88330a7c493412644fa3f3", stock_delta_pct:0.8, estimate:false, include:true },
  { date:"2026-01-29", company:"Amazon", industry:"Technology / E-commerce", region:"GLOBAL", country:"Global", workforce:350000, jobs_lost:16000, loss_type:"NEW", ai_attribution:"MIXED", source_label:"AP", source_url:"https://apnews.com/article/7736d042172743301dd7e494813a885d", stock_delta_pct:-13, estimate:false, include:true },
  { date:"2026-01-29", company:"Dow", industry:"Chemicals", region:"US", country:"United States", workforce:34600, jobs_lost:4500, loss_type:"NEW", ai_attribution:"BLAMED", source_label:"AP", source_url:"https://apnews.com/article/7b220683a25cd32912523bfe2dfb8e5f", stock_delta_pct:19.1, estimate:false, include:true },
  { date:"2026-01-29", company:"Expedia", industry:"Online Travel", region:"US", country:"United States", workforce:16500, jobs_lost:162, loss_type:"NEW", ai_attribution:"BLAMED", source_label:"AP", source_url:"https://apnews.com/article/7736d042172743301dd7e494813a885d", stock_delta_pct:-12.8, estimate:false, include:true },
];

async function seed() {
  try {
    await db.migrate();

    // Check if data already exists
    const { rows } = await db.pool.query("SELECT COUNT(*) AS cnt FROM reports");
    if (parseInt(rows[0].cnt) > 0) {
      console.log(`[seed] Database already has ${rows[0].cnt} reports. Skipping seed.`);
      console.log("[seed] To re-seed, run: DELETE FROM reports; then re-run this script.");
      process.exit(0);
    }

    for (const row of STARTER_DATA) {
      await db.createReport(row);
      console.log(`[seed] Added: ${row.company} (${row.date})`);
    }

    console.log(`\n[seed] Done! ${STARTER_DATA.length} reports imported.`);
    process.exit(0);
  } catch (err) {
    console.error("[seed] Error:", err);
    process.exit(1);
  }
}

seed();
