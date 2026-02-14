# AI Job Loss Tracker — Railway Edition

A self-hosted dashboard tracking AI-linked job losses, built for The Alliance for Secure AI. Runs as a single Node.js app on Railway with PostgreSQL.

## What You Get

- **Public dashboard** at `yourapp.railway.app/` — the tracker your audience sees
- **Admin panel** at `yourapp.railway.app/admin` — where your team adds and manages reports
- **API** at `yourapp.railway.app/api/reports` — if you ever want to embed the data elsewhere
- **PostgreSQL database** — your data lives in a real database, not a spreadsheet

## Architecture

```
┌──────────────────────────────────────────┐
│            Railway (one app)             │
│                                          │
│   Express.js server                      │
│   ├── GET /          → public dashboard  │
│   ├── GET /admin     → admin panel       │
│   ├── GET /api/reports → public data     │
│   └── /api/admin/*   → CRUD (auth req)   │
│                                          │
│   PostgreSQL database                    │
│   └── reports table                      │
└──────────────────────────────────────────┘
```

---

## Deploy to Railway (Step by Step)

### 1. Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `ai-job-tracker` (private is fine)
3. Upload all the files from this folder to the repo
   - You can drag-and-drop files on GitHub's web interface
   - Or use GitHub Desktop (no command line needed)

### 2. Create a Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Railway's Hobby plan is **$5/month** and includes everything you need

### 3. Create a New Project

1. In Railway, click **"New Project"**
2. Choose **"Deploy from GitHub Repo"**
3. Select your `ai-job-tracker` repository
4. Railway will detect it's a Node.js app automatically

### 4. Add PostgreSQL

1. In your project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway creates the database and automatically sets the `DATABASE_URL` variable
3. That's it — no configuration needed

### 5. Set Environment Variables

1. Click on your app service (not the database)
2. Go to the **"Variables"** tab
3. Add these variables:

| Variable | Value |
|----------|-------|
| `ADMIN_PASSWORD` | Choose a strong password your team will share |
| `SESSION_SECRET` | Any random string (mash your keyboard for 40+ characters) |
| `NODE_ENV` | `production` |

> **Important:** `DATABASE_URL` is already set automatically by Railway. Don't touch it.

### 6. Deploy

Railway auto-deploys when you push to GitHub. Your first deploy starts as soon as you add the variables. Wait 1-2 minutes.

### 7. Import Starter Data

1. In Railway, click on your app service
2. Go to the **"Settings"** tab
3. Find **"Custom Start Command"** and temporarily change it to:
   ```
   node seed.js && node server.js
   ```
4. Click **"Redeploy"**
5. After it deploys successfully, change the start command back to just:
   ```
   node server.js
   ```
6. Redeploy one more time

Your 12 starter reports are now in the database.

### 8. Visit Your Site

1. In Railway, go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"** to get a public URL
3. Your dashboard is live at `https://your-app.up.railway.app`
4. Admin panel is at `https://your-app.up.railway.app/admin`

---

## Day-to-Day: Adding Reports

1. Go to `https://your-app.up.railway.app/admin`
2. Enter the shared admin password
3. Click **"+ Add Report"**
4. Fill in the fields (date, company, jobs lost, AI attribution are required)
5. Check **"Publish to dashboard"** when ready
6. Click **"Save Report"**

The public dashboard updates instantly — no caching delay, no publishing step.

### Your Team's Workflow

- **Bookmark the admin URL** — it's the only thing they need
- **Anyone with the password can add reports** — share it with your team
- **Use the publish toggle** to draft reports before making them public
- **Edit or delete** any report from the admin panel

---

## Embedding on Your WordPress Site

Once deployed, embed the dashboard on any page:

```html
<iframe
  src="https://your-app.up.railway.app"
  style="width: 100%; min-height: 100vh; border: none;"
  title="AI Job Loss Tracker">
</iframe>
```

Or link directly — the dashboard at your Railway URL is a complete standalone page.

---

## Cost

- **Railway Hobby plan:** $5/month (includes 500 hours of compute + $5 of usage)
- **PostgreSQL:** Included in the $5 (for your data volume, effectively free)
- **Total:** ~$5-8/month depending on traffic

For context, this handles thousands of daily visitors easily. Railway only charges for actual compute time, and a Node.js server serving HTML is extremely lightweight.

---

## Maintenance

### Things that just work:
- Railway auto-restarts if the app crashes
- Railway auto-deploys when you push to GitHub
- PostgreSQL is managed — Railway handles backups
- SSL/HTTPS is automatic

### Things you might need to do:
- **Update the admin password:** Change the `ADMIN_PASSWORD` variable in Railway
- **Check logs:** Railway dashboard → your app → "Logs" tab
- **Database issues:** Railway dashboard → PostgreSQL service → "Data" tab lets you browse/query

### If something breaks:
1. Check the Logs tab in Railway — errors will be there
2. Most issues are environment variable problems — verify all 3 are set
3. If the database is empty, re-run the seed (see Step 7 above)

---

## Custom Domain (Optional)

To use your own domain (e.g., `tracker.theallianceforai.org`):

1. Railway → Settings → Networking → Custom Domain
2. Enter your domain
3. Add the CNAME record Railway gives you to your DNS
4. SSL is automatic

---

## File Structure

```
ai-job-tracker/
├── server.js           # Express app — all routes
├── db.js               # Database connection + queries
├── seed.js             # Starter data importer
├── package.json        # Dependencies
├── Procfile            # Railway start command
├── .env.example        # Config template
└── public/
    ├── index.html      # Public dashboard
    ├── admin.html      # Admin panel
    └── assets/         # Logo files
```

---

## For Your Future Developer

When you hire a dev, they'll find a clean codebase:
- Standard Express.js — the most common Node.js framework
- Raw SQL queries (no ORM) — easy to read and modify
- PostgreSQL — industry-standard database
- No build step, no webpack, no React — just HTML, CSS, and vanilla JS
- Session-based auth — simple to extend to individual user accounts

Next steps they might add: user accounts, automated scraping, email notifications for new reports, CSV export, API rate limiting, etc.
