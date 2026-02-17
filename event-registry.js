// event-registry.js — Event Registry (newsapi.ai) integration for candidate discovery
//
// Queries Event Registry for articles mentioning layoffs + AI, deduplicates against
// existing candidates, and stores new matches for human review.
//
// Requires: EVENT_REGISTRY_API_KEY environment variable
// Free tier: 2,000 tokens/month. Each search = 1 token. Plan accordingly.
// Docs: https://newsapi.ai/documentation

const db = require("./db");

const ER_BASE = "https://eventregistry.org/api/v1";
const API_KEY = () => process.env.EVENT_REGISTRY_API_KEY;

// ── Search keywords ──────────────────────────────────────────────────
// Compound phrases that naturally combine layoff + AI signals.
// Using OR logic — each phrase is specific enough on its own.
// This produces high-recall candidates; your team filters for precision.

const SEARCH_PHRASES = [
  "AI layoffs",           // 2 words
  "AI job cuts",          // 3 words
  "AI job losses",        // 3 words
  "replaced by AI",       // 3 words
  "AI eliminated jobs",   // 3 words
];                        // Total: 14 words (limit: 15)

// High-quality sources to prioritize (Event Registry source URIs)
// These get searched separately to ensure coverage from tier-1 outlets
const TIER1_DOMAINS = [
  "apnews.com", "reuters.com", "cnbc.com", "bloomberg.com",
  "nytimes.com", "washingtonpost.com", "wsj.com", "bbc.com",
  "theguardian.com", "ft.com", "techcrunch.com", "theverge.com",
  "arstechnica.com", "wired.com",
];

// ── API helpers ──────────────────────────────────────────────────────

async function erFetch(endpoint, body) {
  const key = API_KEY();
  if (!key) throw new Error("EVENT_REGISTRY_API_KEY not set");

  const res = await fetch(`${ER_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, apiKey: key }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Event Registry API error ${res.status}: ${text}`);
  }

  return res.json();
}

// ── Main fetch function ──────────────────────────────────────────────

/**
 * Fetch recent articles matching layoff + AI keywords from Event Registry.
 * Deduplicates against existing candidates by external_id (article URI).
 * Returns { added, skipped, errors } counts.
 *
 * @param {number} daysBack - How many days back to search (default: 3)
 */
async function fetchCandidates(daysBack = 3) {
  const key = API_KEY();
  if (!key) return { added: 0, skipped: 0, errors: 0, message: "EVENT_REGISTRY_API_KEY not configured" };

  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - daysBack);

  const dateStart = from.toISOString().slice(0, 10);
  const dateEnd = now.toISOString().slice(0, 10);

  let added = 0, skipped = 0, errors = 0;

  try {
    // Build keyword query: any compound phrase matches
    const body = {
      action: "getArticles",
      keyword: SEARCH_PHRASES,
      keywordOper: "or",
      keywordSearchMode: "simple",
      lang: "eng",
      dateStart,
      dateEnd,
      isDuplicateFilter: "skipDuplicates",
      dataType: ["news"],
      articlesPage: 1,
      articlesCount: 50,
      articlesSortBy: "date",
      articlesSortByAsc: false,
      resultType: "articles",
      articleBodyLen: 300,
    };

    console.log("[event-registry] Query:", dateStart, "to", dateEnd, "| keywords:", SEARCH_PHRASES.length, "phrases");

    const data = await erFetch("/article/getArticles", body);
    
    // Debug: log response structure
    console.log("[event-registry] Response keys:", Object.keys(data || {}));
    if (data?.articles) {
      console.log("[event-registry] Articles keys:", Object.keys(data.articles));
      console.log("[event-registry] Results count:", data.articles?.results?.length ?? "no results array");
      console.log("[event-registry] Total results:", data.articles?.totalResults ?? "unknown");
    } else if (data?.error) {
      console.log("[event-registry] API error:", data.error);
    } else {
      console.log("[event-registry] Raw response (first 500 chars):", JSON.stringify(data).slice(0, 500));
    }

    const articles = data?.articles?.results || [];

    console.log(`[event-registry] Fetched ${articles.length} articles for ${dateStart} to ${dateEnd}`);

    for (const article of articles) {
      try {
        const result = await db.createCandidate({
          external_id: String(article.uri),
          title: article.title || "Untitled",
          summary: (article.body || "").slice(0, 500),
          source_name: article.source?.title || "",
          source_url: article.url || "",
          published_at: article.date || dateEnd,
        });

        if (result === "exists") {
          skipped++;
        } else {
          added++;
        }
      } catch (e) {
        console.error("[event-registry] Error storing candidate:", e.message);
        errors++;
      }
    }
  } catch (e) {
    console.error("[event-registry] Fetch error:", e.message);
    return { added, skipped, errors: errors + 1, message: e.message };
  }

  console.log(`[event-registry] Done: ${added} added, ${skipped} duplicates, ${errors} errors`);
  return { added, skipped, errors };
}

module.exports = { fetchCandidates };
