/**
 * og-image.js — JobLoss.ai OG image generator
 *
 * Install: npm install @napi-rs/canvas
 *
 * Fonts: bundle /fonts/LibreFranklin-*.ttf in the repo
 *   Download from: https://fonts.google.com/specimen/Libre+Franklin
 *   Weights needed: Regular (400), SemiBold (600), Bold (700), ExtraBold (800)
 *
 * Usage in server.js:
 *   const { generateOgImage } = require('./og-image');
 *   app.get('/og-image', async (req, res) => {
 *     const { totalJobs, reportCount } = await getOgStats();
 *     const png = await generateOgImage({ totalJobs, reportCount });
 *     res.set({ 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' });
 *     res.send(png);
 *   });
 */
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
const fs   = require('fs');
// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:      '#192D17',
  textBig: '#F3F7F1',
  textMid: 'rgba(243,247,241,0.60)',
  rule:    'rgba(243,247,241,0.15)',
  amber:   '#E4991B',
};
const W = 1200;
const H = 630;
// ─── Font registration ────────────────────────────────────────────────────────
// Uses @fontsource/libre-franklin (npm install @fontsource/libre-franklin)
// No TTF bundling needed — works out of the box on Railway.
let fontsLoaded = false;
function loadFonts() {
  if (fontsLoaded) return;
  // Resolve relative to this file so it works regardless of cwd
  const base = path.join(__dirname, 'node_modules/@fontsource/libre-franklin/files');
  for (const weight of [400, 600, 700, 800]) {
    const file = path.join(base, `libre-franklin-latin-${weight}-normal.woff2`);
    if (fs.existsSync(file)) GlobalFonts.registerFromPath(file, 'Libre Franklin');
  }
  fontsLoaded = true;
}
// ─── Main generator ───────────────────────────────────────────────────────────
async function generateOgImage({ totalJobs = 0, reportCount = 0 } = {}) {
  loadFonts();
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');
  // Background
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  // Subtle dot grid texture
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  for (let x = 48; x < W; x += 40) {
    for (let y = 48; y < H; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Amber left-edge accent bar
  ctx.fillStyle = C.amber;
  ctx.fillRect(0, 0, 5, H);
  // ── Source line ─────────────────────────────────────────────────────────────
  ctx.font      = '600 18px "Libre Franklin", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = C.textMid;
  ctx.fillText('THE ALLIANCE FOR SECURE AI  ·  JOBLOSS.AI', 60, 58);
  // Rule
  ctx.fillStyle = C.rule;
  ctx.fillRect(60, 72, W - 120, 1);
  // ── Headline ────────────────────────────────────────────────────────────────
  ctx.fillStyle = C.textBig;
  ctx.font      = '800 58px "Libre Franklin", sans-serif';
  ctx.fillText('Will AI cost you your job?', 60, 160);
  // ── Sub-headline ─────────────────────────────────────────────────────────────
  ctx.fillStyle = C.textMid;
  ctx.font      = '400 30px "Libre Franklin", sans-serif';
  ctx.fillText('Tracking workforce reductions linked to AI adoption.', 60, 212);
  // ── Big number ───────────────────────────────────────────────────────────────
  const formatted = totalJobs.toLocaleString('en-US');
  ctx.fillStyle = C.textBig;
  ctx.font      = '800 152px "Libre Franklin", sans-serif';
  ctx.fillText(formatted, 56, 432);
  // ── Number label ─────────────────────────────────────────────────────────────
  ctx.fillStyle = C.textMid;
  ctx.font      = '600 24px "Libre Franklin", sans-serif';
  ctx.fillText('TOTAL AI-LINKED JOB LOSSES', 62, 482);
  // ── Divider ───────────────────────────────────────────────────────────────────
  ctx.fillStyle = C.rule;
  ctx.fillRect(60, 520, W - 120, 1);
  // ── Stats + CTA row ──────────────────────────────────────────────────────────
  const rowY = 560;
  // CTA button (amber filled, dark text)
  const btnW = 238;
  const btnH = 52;
  const btnX = W - 60 - btnW;
  const btnY = rowY - 38;
  ctx.fillStyle = C.amber;
  roundRect(ctx, btnX, btnY, btnW, btnH, 5);
  ctx.fill();
  ctx.fillStyle  = C.bg;
  ctx.font       = '700 21px "Libre Franklin", sans-serif';
  ctx.textAlign  = 'center';
  ctx.fillText('View the tracker \u203a', btnX + btnW / 2, btnY + 33);
  ctx.textAlign  = 'left';
  // Bottom amber bar
  ctx.fillStyle = C.amber;
  ctx.fillRect(0, H - 5, W, 5);
  return canvas.encode('png');
}
// ─── Helpers ─────────────────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
module.exports = { generateOgImage };
