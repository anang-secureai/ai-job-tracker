# AI Job Loss Tracker

A public-interest dashboard tracking AI-linked job losses worldwide, maintained by [The Alliance for Secure AI](https://secureainow.org).

**Live dashboard:** [ai-job-tracker.up.railway.app](https://ai-job-tracker.up.railway.app)

---

## About

This project tracks newly reported layoffs where artificial intelligence is either explicitly cited by the company or credibly identified by reporting as a material factor in the workforce reduction. The reporting window begins January 1, 2025.

The tracker is designed for policymakers, journalists, and researchers who need a regularly updated, methodologically transparent source for AI-driven labor displacement data. Each entry includes the company, headcount, AI attribution classification, source citation, and contextual metrics including workforce percentage and post-announcement stock movement.

### Counting methodology

**Included:** First-time layoff announcements where AI was a material factor — either explicitly cited by the company (`EXPLICIT`), identified by credible reporting as a primary driver (`BLAMED`), or listed alongside other factors (`MIXED`).

**Excluded:** Restated totals, duplicate announcements of previously counted layoffs, and workforce reductions attributed solely to non-AI factors.

Stock figures show the change from announcement-day close to most recent close and do not imply the layoffs caused the stock movement.

## Architecture

| Component | Technology |
|-----------|-----------|
| Server | Node.js, Express |
| Database | PostgreSQL |
| Frontend | HTML, CSS, vanilla JS |
| Hosting | Railway |

```
├── server.js            # Express routes, auth, API
├── db.js                # PostgreSQL queries
├── seed.js              # Initial dataset
├── package.json
├── public/
│   ├── index.html       # Public dashboard
│   ├── admin.html       # Admin panel (session-authenticated)
│   ├── styles.css       # Shared styles
│   └── assets/          # Logos, favicons
```

No build step, no framework, no client-side dependencies. The dashboard is a single HTML page consuming a JSON API. The admin panel is a separate page with cookie-based session authentication.

## API

The public endpoint requires no authentication:

```
GET /api/reports
```

Returns all published reports as JSON. Responses are cached for 5 minutes.

## Data sources

Reports are sourced from major wire services and business publications including AP, Reuters, CNBC, Bloomberg, and sector-specific outlets. Each report links to its primary source.

## Deployment

Runs as a single service on Railway with a managed PostgreSQL instance. Requires three environment variables:

| Variable | Purpose |
|----------|---------|
| `ADMIN_PASSWORD` | Shared credential for the admin panel |
| `SESSION_SECRET` | Session signing key |
| `DATABASE_URL` | PostgreSQL connection string (set automatically by Railway) |

## Contributing data

If you've identified an AI-linked layoff that isn't reflected in the tracker, please open an issue with the company name, approximate headcount, date, and a link to a credible source.

## License

© 2025 The Alliance for Secure AI. All rights reserved.

Data may be cited with attribution. For media inquiries, contact [The Alliance for Secure AI](https://secureainow.org).
