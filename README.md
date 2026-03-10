# AI Job Loss Tracker

A public-interest dashboard tracking AI-linked job losses, maintained by [The Alliance for Secure AI](https://secureainow.org).

**Live dashboard:** [ai-job-tracker.up.railway.app](https://ai-job-tracker.up.railway.app)

## About

The AI Job Loss Tracker is a curated dataset of workforce reductions where artificial intelligence is either explicitly cited or credibly identified as a material factor. It serves as a resource for policymakers, journalists, and researchers tracking the labor market impact of AI adoption.

The tracker includes only first-time announcements meeting strict editorial criteria. Restated totals, duplicate announcements, and layoffs attributed solely to non-AI factors are excluded. Each entry is classified by attribution type:

| Classification | Meaning |
|---|---|
| **EXPLICIT** | Company publicly cited AI as a reason in an official statement, filing, or on-the-record comment |
| **BLAMED** | At least one credible outlet (AP, Reuters, major business press) identified AI as a primary driver |
| **MIXED** | AI cited alongside other material factors (restructuring, market conditions) |

## Architecture

```
┌──────────────────────────────────────────────────┐
│               Railway (Node.js)                  │
│                                                  │
│   Express.js server                              │
│   ├── GET /              → public dashboard      │
│   ├── GET /admin         → admin panel           │
│   ├── GET /api/reports   → public JSON API       │
│   └── /api/admin/*       → report CRUD (auth)    │
│                                                  │
│   PostgreSQL                                     │
│   ├── reports table      → curated dataset       │
│   └── session table      → auth sessions         │
└──────────────────────────────────────────────────┘
```

## Public API

```
GET /api/reports
```

Returns all published reports as JSON. No authentication required. Cached for 5 minutes.

```json
{
  "ok": true,
  "count": 14,
  "reports": [
    {
      "id": 1,
      "date": "2025-01-22",
      "company": "Microsoft",
      "industry": "Technology",
      "jobsLost": 3222,
      "lossType": "NEW",
      "aiAttribution": "MIXED",
      "sourceLabel": "CNBC",
      "sourceUrl": "https://...",
      "workforce": 228000,
      "estimate": false
    }
  ]
}
```

## File Structure

```
ai-job-tracker/
├── server.js              # Express app, routes
├── db.js                  # PostgreSQL connection, migrations, query helpers
├── seed.js                # Starter data importer
├── seed-data.js           # Initial dataset
├── package.json
├── Procfile
└── public/
    ├── index.html         # Public dashboard (WCAG 2.1 AA compliant)
    ├── admin.html         # Admin panel for managing reports
    ├── styles.css         # Light theme matching secureainow.org
    ├── favicon.ico
    ├── favicon-32.png
    ├── apple-touch-icon.png
    ├── icon-192.png
    ├── icon-512.png
    └── assets/
        ├── the-alliance-logo-white-1600.png
        └── the-alliance-shield-white-256.png
```

## Deployment

Hosted on [Railway](https://railway.app) with auto-deploy from this repository.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (auto-set by Railway) |
| `ADMIN_PASSWORD` | Yes | Shared password for admin panel access |
| `SESSION_SECRET` | Yes | Random string for session signing |
| `NODE_ENV` | Yes | Set to `production` |

### Custom Domain

To serve from a subdomain (e.g., `tracker.secureainow.org`):

1. Add a CNAME record pointing the subdomain to the Railway deployment
2. Configure the custom domain in Railway → Settings → Networking
3. SSL is automatic

## Data Sources

Reports are sourced from AP, Reuters, CNBC, Bloomberg, the Wall Street Journal, the New York Times, the Washington Post, the Financial Times, TechCrunch, The Verge, Ars Technica, Wired, the BBC, and the Guardian, among others.

## Accessibility

The public dashboard meets WCAG 2.1 AA standards:

- All interactive elements have visible focus indicators
- Table headers use `scope` attributes
- Sections use ARIA landmarks and labels
- Counter uses `aria-live` for screen reader announcements
- Animations respect `prefers-reduced-motion`
- Print stylesheet included for physical distribution

## Citation

> The Alliance for Secure AI, *AI Job Loss Tracker*, [date accessed]. Available at [ai-job-tracker.up.railway.app](https://ai-job-tracker.up.railway.app).

## Contributing

To report an error or suggest a source, email [contact@secureainow.org](mailto:contact@secureainow.org).

## License

Data and analysis © The Alliance for Secure AI. Source code available for reference; contact the organization for licensing inquiries.
