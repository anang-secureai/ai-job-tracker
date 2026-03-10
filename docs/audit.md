# UI Design Audit — AI Job Loss Tracker

Comprehensive catalog of every UI component, color, font size, spacing value, and border radius across the application.

---

## Table of Contents

1. [Global Design Tokens (styles.css :root)](#1-global-design-tokens)
2. [Typography](#2-typography)
3. [Dashboard — index.html](#3-dashboard--indexhtml)
4. [Admin — admin.html](#4-admin--adminhtml)
5. [Privacy — privacy.html](#5-privacy--privacyhtml)
6. [Widget — widget.html](#6-widget--widgethtml)
7. [Widget Mini — widget-mini.html](#7-widget-mini--widget-minihtml)
8. [OG Image — og-image.js](#8-og-image--og-imagejs)
9. [Complete Color Index](#9-complete-color-index)
10. [Complete Border Radius Index](#10-complete-border-radius-index)
11. [Complete Font Size Index](#11-complete-font-size-index)
12. [Complete Spacing Index](#12-complete-spacing-index)

---

## 1. Global Design Tokens

Defined in `public/styles.css` `:root` and duplicated in `widget.html`:

### CSS Custom Properties

| Variable | Value | Usage |
|---|---|---|
| `--seaweed` | `#192d17` | Primary brand dark green |
| `--seaweed-mid` | `#2a4a26` | Hover state for primary buttons |
| `--gamboge` | `#c07f10` | Accent amber (AA on white, 4.6:1) |
| `--gamboge-light` | `#e4991b` | Decorative amber (not for text on white) |
| `--gamboge-bg` | `#fef8ed` | Amber-tinted surface |
| `--green` | `#3d6b35` | Secondary green (AA on white, 5.8:1) |
| `--green-light` | `#709663` | Large text / decorative only |
| `--green-bg` | `#f0f5ee` | Green-tinted surface |
| `--green-bg-alt` | `#e5ede2` | Alternate green surface |
| `--bg` | `#ffffff` | Primary background |
| `--bg-warm` | `#faf8f5` | Warm off-white |
| `--bg-cool` | `#f3f6f2` | Green-tinted off-white |
| `--text` | `#1a2118` | Primary text (14.8:1) |
| `--text-mid` | `#4a5648` | Secondary text (6.2:1) |
| `--text-dim` | `#6b7a64` | Tertiary text (4.5:1) |
| `--text-on-dark` | `#f3f7f1` | Text on dark backgrounds |
| `--text-on-dark-mid` | `#b8c8b1` | Secondary text on dark |
| `--border` | `#d4ddd0` | Primary border |
| `--border-light` | `#e8ede5` | Subtle border |
| `--border-focus` | `#3d6b35` | Focus ring color |
| `--red` | `#b03a2e` | Error/danger (AA 5.4:1) |
| `--red-bg` | `#fdf0ee` | Error surface |
| `--green-pos` | `#2d7a2d` | Positive green |
| `--shadow-sm` | `0 1px 3px rgba(25,45,23,0.08)` | Subtle elevation |
| `--shadow-md` | `0 4px 12px rgba(25,45,23,0.1)` | Medium elevation |
| `--shadow-lg` | `0 8px 24px rgba(25,45,23,0.12)` | High elevation |

---

## 2. Typography

### Font Family

- **Primary**: `"Libre Franklin", "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif`
- **Weights loaded (index/widget)**: 400, 600, 700, 800, 900
- **Weights loaded (admin)**: 400, 500, 600, 700, 800
- **Line height (body)**: `1.6` (styles.css), `1.5` (widget.html)
- **Font smoothing**: `-webkit-font-smoothing: antialiased`

---

## 3. Dashboard — index.html

Uses `public/styles.css`. Body class: `dash-body` (`background: var(--bg-warm)`).

### Components

#### Site Header (`.site-header`)
- **Background**: `linear-gradient(135deg, var(--seaweed) 0%, #1e3a1a 100%)`
- **Padding**: `1rem 0 1.1rem` (mobile: `0.85rem 0`)
- **Inner width**: `min(1100px, 92vw)`

| Element | Font Size | Font Weight | Color | Other |
|---|---|---|---|---|
| `.brand-logo` | — | — | — | `width: min(140px, 30vw)`, mobile `min(110px, 30vw)`, 420px `min(90px, 32vw)` |
| `.site-title` | `clamp(0.9rem, 2vw, 1.2rem)` mobile `clamp(0.82rem, 4vw, 1rem)` | 800 | `#f3f7f1` | `letter-spacing: -0.01em`, `line-height: 1.1` |

#### Counter Section (`.counter-section`)
- **Background**: `var(--seaweed)`
- **Padding**: `1.4rem 0 1.6rem` (mobile: `1.1rem 0 1.3rem`)
- **Border-top**: `1px solid rgba(255,255,255,0.08)`

| Element | Font Size | Font Weight | Color | Other |
|---|---|---|---|---|
| `.counter-label` | `0.72rem` | 600 | `#b8c8b1` | `text-transform: uppercase`, `letter-spacing: 0.06em` |
| `.counter-number` | `clamp(2.8rem, 9vw, 4.6rem)` mobile `clamp(2.4rem, 11vw, 3.4rem)` | 900 | `#f3f7f1` | `font-variant-numeric: tabular-nums`, `letter-spacing: -0.02em`, `line-height: 1` |
| `.counter-number.counting` | — | — | `#fff` | — |
| `.counter-asof` | `0.68rem` | — | `#b8c8b1` | — |

#### Pace Box (`.pace-box`)
- **Background**: `rgba(255,255,255,0.06)`
- **Border**: `1px solid rgba(255,255,255,0.15)`
- **Border-radius**: `0.6rem`
- **Padding**: `0.65rem 0.9rem`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.pace-label` | `0.62rem` | 700 | `var(--text-on-dark-mid)` |
| `.pace-number` | `1.5rem` | 800 | `var(--text-on-dark)` |
| `.pace-arrow.up` | `0.8rem` | — | `#ffa0a0` |
| `.pace-arrow.down` | `0.8rem` | — | `#a0e0a0` |
| `.pace-arrow.flat` | `0.8rem` | — | `var(--text-on-dark-mid)` |
| `.pace-delta` | `0.68rem` | — | `var(--text-on-dark-mid)` |

#### Hero Section (`.hero`)
- **Padding**: `2rem 0 0` (mobile: `1.4rem 0 0`)
- **Grid**: `minmax(0,1.2fr) minmax(280px,0.8fr)` (mobile: `1fr`)
- **Gap**: `1.8rem` (mobile: `1rem`)

| Element | Font Size | Font Weight | Color | Other |
|---|---|---|---|---|
| `.eyebrow` | `0.72rem` | 700 | `var(--green)` | `text-transform: uppercase`, `letter-spacing: 0.12em` |
| `.hero-h2` | `clamp(1.4rem, 3.5vw, 2.2rem)` mobile `clamp(1.3rem, 6vw, 1.8rem)` | 900 | `var(--seaweed)` | `line-height: 1.1`, `max-width: 20ch` |
| `.subtitle` | `0.9rem` (mobile: `0.84rem`) | — | `var(--text-mid)` | `line-height: 1.55`, `max-width: 60ch` |
| `.last-updated` | `0.72rem` | 700 | `var(--gamboge)` | — |

#### Trend Panel (`.trend-panel`)
- **Background**: `var(--bg)`
- **Border**: `1px solid var(--border)`
- **Border-radius**: `0.75rem`
- **Padding**: `0.85rem 1rem 0.75rem`
- **Box-shadow**: `var(--shadow-sm)`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.trend-kicker` | `0.62rem` | 700 | `var(--text-dim)` |
| `.trend-panel h3` | `0.88rem` | — | `var(--seaweed)` |
| `.trend-summary` | `0.72rem` | — | `var(--text-mid)` |

#### Chart Tooltip (`.chart-tooltip`)
- **Background**: `var(--bg)`
- **Border**: `1px solid var(--border)`
- **Border-radius**: `0.45rem`
- **Padding**: `0.35rem 0.55rem`
- **Font size**: `0.72rem`, weight 700, color `var(--text)`
- **Box-shadow**: `var(--shadow-md)`

#### Chart Point Highlight (`.chart-point-highlight`)
- **Size**: `0.65rem x 0.65rem`
- **Border-radius**: `50%`
- **Background**: `var(--gamboge-light)`
- **Border**: `2px solid var(--bg)`
- **Box-shadow**: `0 0 0 0.15rem rgba(228,153,27,0.3)`

#### Signup Section (`.signup-section`)
- **Background**: `var(--seaweed)`
- **Border-top**: `1px solid rgba(255,255,255,0.07)`
- **Padding**: `0.6rem 0 0.4rem`
- **Grid**: `1fr 1.4fr` (mobile: `1fr`)

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.signup-copy h2` | `0.95rem` | 800 | `var(--text-on-dark)` |
| `.signup-copy p` | `0.8rem` | — | `var(--text-on-dark-mid)` |
| HubSpot `.hs-input` | `0.82rem` | inherit | `var(--text)` |
| HubSpot `label` | `0.78rem` | 600 | `var(--text-on-dark)` |
| HubSpot `.hs-button` | `0.82rem` | 700 | `#fff` on `var(--gamboge)` |
| HubSpot legal/error | `0.7rem` | — | `var(--text-on-dark-mid)` |
| `.submitted-message` | `0.85rem` | 600 | `#a0e0a0` |

HubSpot inputs:
- **Border-radius**: `0.4rem`
- **Border**: `1px solid var(--border)`
- **Padding**: `0.45rem 0.75rem`
- **Focus outline**: `2px solid var(--gamboge-light)`

HubSpot button:
- **Border-radius**: `0.4rem`
- **Padding**: `0.45rem 1.1rem`

#### Stats Section (`.stats-section`)
- **Padding**: `1.5rem 0 0`
- **Grid**: `repeat(3, minmax(0,1fr))`, gap `0.85rem` (mobile: `0.45rem`, 420px: `0.3rem`)

#### Stat Card (`.stat-card`)
- **Border-radius**: `0.65rem`
- **Padding**: `0.85rem 1rem` (mobile: `0.6rem 0.65rem`, 420px: `0.45rem 0.5rem`)
- **Border**: `1px solid var(--border)`
- **Background**: `var(--bg)`
- **Box-shadow**: `var(--shadow-sm)`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.stat-card h3` | `0.68rem` (mobile: `0.62rem`) | 700 | `var(--text-dim)` |
| `.stat-card p` | `clamp(1.3rem, 3vw, 2rem)` (mobile: `1.15rem`) | 800 | `var(--seaweed)` |

#### Reports Section (`.reports-section`)
- **Padding**: `1.5rem 0` (mobile: `1rem 0`)

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.section-head h2` | `1.1rem` | — | `var(--seaweed)` |
| `.count-badge` | `0.72rem` | 600 | `var(--text-dim)` |

#### Table Card (`.table-card`)
- **Border**: `1px solid var(--border)`
- **Border-radius**: `0.75rem`
- **Background**: `var(--bg)`
- **Box-shadow**: `var(--shadow-sm)`

| Element | Font Size | Font Weight | Color | Padding |
|---|---|---|---|---|
| `thead th` | `0.66rem` | 700 | `var(--text-dim)` on `var(--bg-cool)` | `0.6rem 0.7rem` |
| `tbody td` | `0.86rem` | — | `var(--text)` | `0.65rem 0.7rem` |
| `.cell-company` | — | 700 | `var(--seaweed)` | — |
| `.cell-meta` | `0.74rem` | — | `var(--text-dim)` | — |
| `.cell-jobs` | — | 700 | — | — |
| `tr.major` bg | — | — | `var(--gamboge-bg)` | — |
| `tr.major .cell-company` | `0.95rem` | — | — | — |
| `tr.major .cell-jobs` | `0.98rem` | 800 | `var(--gamboge)` | — |
| `tr.major td:first-child` | — | — | — | `border-left: 3px solid var(--gamboge-light)` |

Table borders:
- `thead th` bottom: `1px solid var(--border)`
- `tbody td` top: `1px solid var(--border-light)`
- Even rows bg: `var(--bg-warm)`

#### Table Disclaimer (`.table-disclaimer`)
- **Font size**: `0.66rem`
- **Color**: `var(--text-dim)`
- **Padding**: `0.55rem 0.7rem`
- **Background**: `var(--bg-cool)`
- **Border-top**: `1px solid var(--border-light)`
- **Font-style**: italic

#### Stock Pill (`.stock-pill`)
- **Border-radius**: `999px`
- **Padding**: `0.15rem 0.5rem`
- **Font size**: `0.82rem`, weight 700

| Variant | Color | Background | Border |
|---|---|---|---|
| `.pos` | `#1a5c1a` | `#e6f4e6` | `1px solid #b8dbb8` |
| `.neg` | `#7a2920` | `#fce8e5` | `1px solid #ecc5bf` |
| `.na` | `var(--text-dim)` | `var(--bg-cool)` | `1px solid var(--border)` |

#### Pct Pill (`.pct-pill`)
- **Border-radius**: `999px`
- **Padding**: `0.15rem 0.5rem`
- **Background**: `var(--gamboge-bg)`
- **Border**: `1px solid #e8d5aa`
- **Font size**: `0.82rem`, weight 700
- **Color**: `#7a5a0a`

#### Attribution Tag (`.attr-tag`) — styles.css
- **Border-radius**: `999px`
- **Padding**: `0.12rem 0.4rem`
- **Font size**: `0.62rem`, weight 700
- **Letter-spacing**: `0.04em`
- **Text-transform**: uppercase

| Variant | Color | Background | Border |
|---|---|---|---|
| `.explicit` | `#1a5c1a` | `#e6f4e6` | `1px solid #b8dbb8` |
| `.blamed` | `#7a5a0a` | `var(--gamboge-bg)` | `1px solid #e8d5aa` |
| `.mixed` | `var(--text-mid)` | `var(--bg-cool)` | `1px solid var(--border)` |

#### Source Link (`.source-link`) — styles.css
- **Color**: `var(--green)`
- **Font size**: `0.8rem`, weight 600
- **Border-bottom**: `1px solid rgba(61,107,53,0.3)`
- **Hover**: color `var(--seaweed)`, border-bottom-color `var(--seaweed)`

#### Mobile Report Cards (`.report-card`)
- **Border**: `1px solid var(--border)`
- **Border-radius**: `0.65rem`
- **Padding**: `0.85rem`
- **Background**: `var(--bg)`
- **Margin-bottom**: `0.6rem`
- **Box-shadow**: `var(--shadow-sm)`
- **`.major`**: `border-left: 3px solid var(--gamboge-light)`, background `var(--gamboge-bg)`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.rc-company` | `0.95rem` (major: `1.05rem`) | 800 | `var(--seaweed)` |
| `.rc-jobs` | `1rem` (major: `1.1rem`) | 800 | `var(--text)` (major: `var(--gamboge)`) |
| `.rc-meta` | `0.72rem` | — | `var(--text-dim)` |
| `.rc-label` | `0.6rem` | 700 | `var(--text-dim)` |
| `.rc-value` | `0.82rem` | 600 | — |

Card grid: `1fr 1fr`, gap `0.35rem 0.75rem`, margin-top `0.55rem`, padding-top `0.55rem`, border-top `1px solid var(--border-light)`

#### Methodology (`.method`)
- **Border-radius**: `0.65rem`
- **Padding**: `0.75rem 1rem`
- **Background**: `var(--green-bg)`
- **Border**: `1px solid var(--green-bg-alt)`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `summary` | `0.85rem` | 700 | `var(--seaweed)` |
| Arrow `::before` | `0.7rem` | — | — |
| `p` | `0.84rem` | — | `var(--text-mid)` |

#### Citation Block (`.cite-block`)
- **Border-radius**: `0.65rem`
- **Padding**: `0.85rem 1rem`
- **Background**: `var(--bg)`
- **Border**: `1px solid var(--border)`
- **Box-shadow**: `var(--shadow-sm)`
- **Grid**: `1fr 1fr`, gap `0.85rem` (mobile: `1fr`)

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `h3` | `0.78rem` | — | `var(--seaweed)` |
| `p` | `0.84rem` | — | `var(--text-mid)` |
| `a` | — | 600 | `var(--green)` |

#### Footer (`.site-footer`)
- **Background**: `var(--seaweed)`
- **Padding**: `1.4rem 0`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.footer-logo` | — | — | width `120px` |
| `p` | `0.72rem` | — | `var(--text-on-dark-mid)` |
| `a` | — | — | `var(--gamboge-light)`, hover: `#fff` |

#### Loading / Error States
- `.loading-state`: padding `2.5rem 1rem`, color `var(--text-dim)`, centered
- `.spinner`: `1.4rem x 1.4rem`, border `2px solid var(--border)`, border-top `var(--gamboge-light)`, border-radius `50%`
- `.error-state`: padding `2rem 1rem`, color `var(--red)`

#### Cookie Consent Banner (inline styles)
- **Background**: `#192D17`
- **Color**: `#F4F7F1`
- **Padding**: `14px 20px`
- **Font size**: `14px`
- **z-index**: `9999`
- **Box-shadow**: `0 -2px 8px rgba(0,0,0,0.3)`
- **Max-width inner**: `1100px`
- **Decline button**: bg `#666`, color `#fff`, border-radius `4px`, padding `8px 18px`, font-size `13px`, weight 600
- **Accept button**: bg `#8DC63F`, color `#192D17`, border-radius `4px`, padding `8px 18px`, font-size `13px`, weight 700

#### Animations
- `spin`: `rotate(360deg)`, `0.8s linear infinite`
- `fadeUp`: `opacity 0→1`, `translateY(8px→0)`

---

## 4. Admin — admin.html

Self-contained styles (inline `<style>` block). Does NOT use `styles.css`.

### Admin Design Tokens (`:root` override)

| Variable | Value | Notes |
|---|---|---|
| `--seaweed` | `#2c4a2a` | **Different** from dashboard `#192d17` |
| `--green` | `#3d6b35` | Same |
| `--green-bg` | `#f4f7f2` | **Different** from dashboard `#f0f5ee` |
| `--border` | `#d6d6c8` | **Different** from dashboard `#d4ddd0` |
| `--text` | `#1a1a1a` | **Different** from dashboard `#1a2118` |
| `--text-mid` | `#4a4a40` | **Different** from dashboard `#4a5648` |
| `--text-dim` | `#8a8a7a` | **Different** from dashboard `#6b7a64` |
| `--bg` | `#fff` | Same |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,.06)` | **Different** alpha base |

Body background: `#f5f4ef` (no CSS variable)

### Components

#### Login Screen (`.login-screen`)
- **Background**: `var(--seaweed)` (solid, no gradient — different from dashboard)
- **Min-height**: `100vh`

#### Login Box (`.login-box`)
- **Background**: `var(--bg)` (white — different from dashboard's glassmorphic style)
- **Padding**: `2rem`
- **Border-radius**: `0.75rem`
- **Width**: `min(380px, 90vw)`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `h1` | `1.1rem` | — | `var(--seaweed)` |
| `input` | `0.9rem` | — | — |
| `.login-error` | `0.82rem` | — | `#b33` |

Input: padding `0.6rem 0.8rem`, border `1px solid var(--border)`, border-radius `0.4rem`, margin-bottom `0.75rem`

#### Topbar (`.topbar`)
- **Background**: `var(--seaweed)` (solid dark green)
- **Color**: `#fff`
- **Padding**: `0.6rem 1.5rem`
- **Sticky**: `top: 0`, `z-index: 100`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `h1` | `0.95rem` | 700 | `#fff` (inherited) |
| `.topbar-nav a` | `0.82rem` | 600 | `rgba(255,255,255,.6)` |
| `.topbar-nav a:hover` | — | — | `#fff` on `rgba(255,255,255,.1)` |
| `.topbar-nav a.active` | — | — | `#fff` on `rgba(255,255,255,.18)` |

Nav link border-radius: `0.35rem`

#### Container (`.container`)
- **Width**: `min(1200px, 96vw)`
- **Margin**: `1.5rem auto`
- **Padding**: `0 0.5rem`

#### Buttons (`.btn`)
- **Padding**: `0.45rem 0.9rem`
- **Border-radius**: `0.4rem`
- **Border**: `1px solid var(--border)`
- **Font size**: `0.82rem`, weight 600

| Variant | Color | Background | Border | Hover |
|---|---|---|---|---|
| default | `var(--text-mid)` | `var(--bg)` | `var(--border)` | border `var(--green)`, color `var(--green)` |
| `.btn-primary` | `#fff` | `var(--seaweed)` | `var(--seaweed)` | bg `var(--green)` |
| `.btn-danger` | `#b33` | — | `#daa` | bg `#fef0f0`, color `#900` |
| `.topbar-btn` | `#fff` | transparent | `rgba(255,255,255,.35)` | bg `rgba(255,255,255,.12)` |
| `.btn-sm` | — | — | — | padding `0.25rem 0.55rem`, font-size `0.75rem` |
| `.btn-icon` | — | — | — | `1.6rem x 1.6rem`, border-radius `0.3rem` |

#### Stats Bar (`.stats-bar`)
- **Gap**: `0.6rem`
- **Margin-bottom**: `1.2rem`

#### Stat Chip (`.stat-chip`) — admin
- **Padding**: `0.45rem 0.85rem`
- **Border-radius**: `999px`
- **Border**: `1px solid var(--border)`
- **Font size**: `0.82rem`
- **`strong`**: weight 800

#### Table Header (`.table-header`)
- **Margin-bottom**: `0.75rem`
- **`h2`**: font-size `1.05rem`, weight 800, color `var(--seaweed)`

#### Admin Table
| Element | Font Size | Font Weight | Color | Padding |
|---|---|---|---|---|
| `thead th` | `0.68rem` | 700 | `var(--text-dim)` | `0.6rem 0.75rem` |
| `tbody td` | `0.88rem` | — | — | `0.7rem 0.75rem` |
| `tbody tr:hover` bg | — | — | `var(--green-bg)` | — |

Borders:
- `thead th` bottom: `2px solid var(--border)`
- `tbody td` bottom: `1px solid #eee`

#### Attribution Tags — admin (different from styles.css)
- **Font size**: `0.66rem`
- **Border-radius**: `999px`
- **Padding**: `0.15rem 0.45rem`

| Variant | Color | Background |
|---|---|---|
| `.explicit` | `#1a5c1a` | `#e6f4e6` |
| `.blamed` | `#8a6000` | `#fef0d0` |
| `.mixed` | `#555` | `#f0f0f0` |

Note: `.blamed` and `.mixed` colors differ from styles.css.

#### Toggle Track (`.toggle-track`) — admin
- **Width**: `2.2rem`, **Height**: `1.25rem`
- **Border-radius**: `999px`
- **Off background**: `#ccc`
- **On background**: `var(--green)`
- **Knob**: `calc(1.25rem - 4px)` diameter, bg `#fff`, shadow `0 1px 2px rgba(0,0,0,.15)`

#### Source Link — admin
- **Color**: `var(--green)`, weight 600, font-size `0.82rem`

#### Modal Backdrop (`.modal-backdrop`)
- **Background**: `rgba(0,0,0,.45)`
- **z-index**: `200`

#### Modal (`.modal`) — admin
- **Background**: `var(--bg)`
- **Border-radius**: `0.75rem`
- **Padding**: `1.5rem`
- **Width**: `min(600px, 92vw)`
- **Box-shadow**: `0 8px 30px rgba(0,0,0,.2)`
- **`h2`**: font-size `1.05rem`, weight 800, color `var(--seaweed)`

#### Form Grid
- **Columns**: `1fr 1fr` (mobile: `1fr`)
- **Gap**: `0.6rem 0.85rem`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `label` | `0.72rem` | 700 | `var(--text-dim)` |
| `input/select` | `0.85rem` | — | — |
| `.form-row-check label` | `0.85rem` | — | `var(--text)` |

Input/select: padding `0.45rem 0.6rem`, border `1px solid var(--border)`, border-radius `0.4rem`
Checkbox: `1rem x 1rem`

Form actions: gap `0.5rem`, margin-top `1rem`, padding-top `0.75rem`, border-top `1px solid var(--border)`

#### Toast (`.toast`) — admin
- **Padding**: `0.6rem 1rem`
- **Border-radius**: `0.5rem`
- **Background**: `var(--seaweed)`, color `#fff`
- **Font size**: `0.84rem`, weight 600
- **Box-shadow**: `0 4px 12px rgba(0,0,0,.15)`
- **`.error`**: background `#b33`

#### Empty State
- **Padding**: `2rem`
- **Color**: `var(--text-dim)`
- **Font size**: `0.88rem`

---

## 5. Privacy — privacy.html

Uses `styles.css` plus a scoped `<style>` block for `.privacy-page`.

### Components

#### Privacy Page Container (`.privacy-page`)
- **Width**: `min(780px, 92vw)`
- **Margin**: `2.5rem auto 3rem`
- **Color**: `#333`
- **Line-height**: `1.7`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `h1` | `1.6rem` | — | `var(--seaweed)` |
| `.updated` | `0.8rem` | — | `#888` |
| `h2` | `1.1rem` | — | `var(--seaweed)` |
| `p`, `ul` | `0.92rem` | — | — |
| `a` | — | — | `var(--gamboge)` |
| `a:hover` | — | — | `var(--seaweed)` |
| `.back-link` | `0.85rem` | — | — |

Spacing:
- `h2` margin-top: `1.8rem`, margin-bottom: `0.4rem`
- `p/ul` margin-bottom: `0.8rem`
- `ul` padding-left: `1.4rem`
- `li` margin-bottom: `0.35rem`
- `.back-link` margin-bottom: `1.5rem`

Reuses dashboard footer (`.site-footer`).

---

## 6. Widget — widget.html

Self-contained styles. Duplicates all CSS variables from `styles.css`.

### Components

#### Widget Header (`.w-header`)
- **Background**: `linear-gradient(135deg, var(--seaweed) 0%, #1e3a1a 100%)`
- **Padding**: `1rem 1.25rem 0.9rem` (380px: `0.75rem 0.85rem 0.7rem`)

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.w-logo` | — | — | — (width `clamp(110px, 28vw, 160px)`) |
| `.w-title` | `clamp(1rem, 3.5vw, 1.3rem)` | 900 | `var(--text-on-dark)` |
| `.w-live` | `0.6rem` | 600 | `var(--text-on-dark-mid)` |
| `.w-live .dot` | — | — | `5px` circle, bg `var(--gamboge-light)` |

#### Widget Counter (`.w-counter`)
- **Background**: `var(--seaweed)`
- **Padding**: `0.85rem 1rem` (380px: `0.7rem 0.85rem`)

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.counter-label` | `0.62rem` | 600 | `var(--text-on-dark-mid)` |
| `.counter-number` | `clamp(1.9rem, 6vw, 2.8rem)` (380px: `1.7rem`) | 900 | `var(--text-on-dark)` |
| `.counter-asof` | `0.6rem` | — | `var(--text-on-dark-mid)` |

Widget pace box: border-radius `0.55rem`, padding `0.5rem 0.75rem`, min-width `130px`
- `.pace-label`: `0.58rem`
- `.pace-number`: `1.2rem`
- `.pace-delta`: `0.6rem`

#### Widget Stats (`.w-stats`)
- **Grid**: `repeat(3, 1fr)`, gap `0.5rem` (600px: `0.35rem`, 380px: `0.25rem`)
- **Padding**: `0.75rem 1rem 0`

#### Stat Chip — widget
- **Border-radius**: `0.55rem`
- **Padding**: `0.55rem 0.65rem` (600px: `0.45rem 0.5rem`)
- **Border**: `1px solid var(--border)`

| Element | Font Size | Color |
|---|---|---|
| `.stat-chip-label` | `0.58rem` (600px: `0.54rem`) | `var(--text-dim)` |
| `.stat-chip-value` | `1.25rem` (600px: `1rem`, 380px: `0.9rem`) | `var(--seaweed)` |
| `.stat-chip-value.gamboge` | — | `var(--gamboge)` |
| `.stat-chip-value.green` | — | `var(--green)` |
| `.stat-chip-sub` | `0.58rem` | `var(--text-dim)` |

#### Sparkline Card (`.spark-card`)
- **Border-radius**: `0.65rem`
- **Padding**: `0.65rem 0.75rem 0.55rem`
- **Border**: `1px solid var(--border)`
- **Canvas height**: `56px`
- **`.spark-label`**: `0.6rem`
- **`.spark-summary`**: `0.62rem`

#### Report Row (`.report-row`)
- **Border-radius**: `0.55rem`
- **Padding**: `0.6rem 0.75rem` (380px: `0.5rem 0.6rem`)
- **Border**: `1px solid var(--border)`
- **`.major`**: border-color `#e8d5aa`, border-left `3px solid var(--gamboge-light)`, bg `var(--gamboge-bg)`

| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.rr-company` | `0.88rem` (600px: `0.82rem`) | 800 | `var(--seaweed)` |
| `.rr-jobs` | `0.92rem` | 800 | `var(--text)` (major: `var(--gamboge)`) |
| `.rr-meta` | `0.65rem` | — | `var(--text-dim)` |

#### Attr Tag — widget
- **Font size**: `0.58rem`
- **Padding**: `0.1rem 0.38rem`
- **Border-radius**: `999px`
- Colors match styles.css variants exactly.

#### Source Link — widget
- **Font size**: `0.65rem`

#### Widget Footer (`.w-footer`)
- **Padding**: `0.65rem 1rem`
- **Background**: `var(--green-bg)`
- **Border-top**: `1px solid var(--green-bg-alt)`

| Element | Font Size | Color |
|---|---|---|
| `.w-footer-note` | `0.65rem` | `var(--text-dim)` |
| `.w-footer-note strong` | — | `var(--text-mid)` |

#### CTA Button (`.cta-btn`)
- **Padding**: `0.5rem 0.95rem`
- **Border-radius**: `0.45rem`
- **Border**: `1px solid var(--gamboge)`
- **Background**: `var(--gamboge-bg)`
- **Color**: `var(--gamboge)`
- **Font size**: `0.75rem`, weight 700
- **Hover**: bg `var(--gamboge)`, color `#fff`
- SVG icon: `11px x 11px`

#### Loading State — widget
- **Padding**: `1.5rem 1rem`
- **`.error`**: color `#b03a2e`
- **Spinner**: `1.1rem x 1.1rem`

---

## 7. Widget Mini — widget-mini.html

Self-contained styles. Minimal token subset.

### Tokens

| Variable | Value |
|---|---|
| `--seaweed` | `#192d17` |
| `--gamboge` | `#c07f10` |
| `--gamboge-light` | `#e4991b` |
| `--gamboge-bg` | `#fef8ed` |
| `--text-on-dark` | `#f3f7f1` |
| `--text-on-dark-mid` | `#b8c8b1` |
| `--green` | `#3d6b35` |
| `--green-light` | `#709663` |

### Components

#### Mini Widget (`.mini-widget`)
- **Background**: `var(--seaweed)`
- **Height**: `110px`
- **Padding**: `0 1.5rem` (600px: `0 0.75rem`)
- **Gap**: `1.5rem` (600px: `0.75rem`)

#### Brand Cell (`.brand-cell`)
- **Font size**: `0.65rem`
- **Color**: `var(--text-on-dark-mid)`, weight 600
- **Dot**: `6px x 6px`, bg `var(--gamboge-light)`
- Hidden at 420px

#### Counter Cell
| Element | Font Size | Font Weight | Color |
|---|---|---|---|
| `.counter-number` | `clamp(1.8rem, 5vw, 2.6rem)` (600px: `1.6rem`) | 900 | `var(--text-on-dark)` |
| `.counter-label` | `0.78rem` | 700 | `var(--text-on-dark)` |
| `.counter-asof` | `0.68rem` | 600 | `var(--text-on-dark-mid)` |

Counter-asof hidden at 600px.

#### Dashboard Link (`.dash-link`)
- **Font size**: `0.7rem`, weight 700
- **Color**: `var(--gamboge-light)`
- **Opacity**: `0.85`, hover `1`

#### Loading State
- **Spinner**: `1rem x 1rem`, border `2px solid rgba(255,255,255,0.15)`, border-top `var(--gamboge-light)`
- **`.error`**: color `#ffa0a0`

---

## 8. OG Image — og-image.js

Server-side canvas rendering, 1200x630px.

### Tokens

| Name | Value |
|---|---|
| `bg` | `#192D17` |
| `textBig` | `#F3F7F1` |
| `textMid` | `rgba(243,247,241,0.60)` |
| `rule` | `rgba(243,247,241,0.15)` |
| `amber` | `#E4991B` |

### Font Sizes Used

| Context | Font | Size |
|---|---|---|
| Source line | `600 18px` | 18px |
| Headline | `800 58px` | 58px |
| Sub-headline | `400 30px` | 30px |
| Big number | `800 152px` | 152px |
| Number label | `600 24px` | 24px |
| CTA button | `700 21px` | 21px |

### Layout Elements
- Dot grid texture: `rgba(255,255,255,0.025)`, 40px spacing
- Left accent bar: `5px wide`, amber
- Bottom accent bar: `5px tall`, amber
- Rule lines: `1px tall`, `rgba(243,247,241,0.15)`
- CTA button: `238x52px`, border-radius `5px`, amber fill, dark text

---

## 9. Complete Color Index

### Hex Colors (all sources)

| Hex | Where Used |
|---|---|
| `#192d17` / `#192D17` | --seaweed (dashboard, widget, widget-mini, OG bg, cookie banner bg) |
| `#1e3a1a` | Header/widget gradient end |
| `#2a4a26` | --seaweed-mid |
| `#2c4a2a` | Admin --seaweed (different) |
| `#2d7a2d` | --green-pos |
| `#3d6b35` | --green, chart line stroke, chart dots |
| `#709663` | --green-light |
| `#c07f10` | --gamboge |
| `#e4991b` / `#E4991B` | --gamboge-light, OG amber |
| `#fef8ed` | --gamboge-bg |
| `#f0f5ee` | --green-bg (dashboard) |
| `#f4f7f2` | --green-bg (admin, different) |
| `#e5ede2` | --green-bg-alt |
| `#ffffff` / `#fff` | --bg, button text, knob, chart dot stroke |
| `#faf8f5` | --bg-warm |
| `#f3f6f2` | --bg-cool |
| `#f5f4ef` | Admin body bg |
| `#1a2118` | --text (dashboard) |
| `#1a1a1a` | --text (admin, different) |
| `#4a5648` | --text-mid (dashboard) |
| `#4a4a40` | --text-mid (admin, different) |
| `#6b7a64` | --text-dim (dashboard) |
| `#8a8a7a` | --text-dim (admin, different) |
| `#f3f7f1` / `#F3F7F1` / `#F4F7F1` | --text-on-dark, OG textBig, cookie text |
| `#b8c8b1` | --text-on-dark-mid |
| `#d4ddd0` | --border (dashboard) |
| `#d6d6c8` | --border (admin, different) |
| `#e8ede5` | --border-light |
| `#b03a2e` | --red, widget error |
| `#fdf0ee` | --red-bg |
| `#e6f4e6` | .explicit bg, .stock-pill.pos bg |
| `#1a5c1a` | .explicit text, .stock-pill.pos text |
| `#b8dbb8` | .explicit border, .stock-pill.pos border |
| `#fce8e5` | .stock-pill.neg bg |
| `#7a2920` | .stock-pill.neg text |
| `#ecc5bf` | .stock-pill.neg border |
| `#7a5a0a` | .pct-pill text, .blamed text |
| `#e8d5aa` | .pct-pill border, .blamed border, widget major border |
| `#fef0d0` | Admin .blamed bg (different from dashboard) |
| `#8a6000` | Admin .blamed text (different) |
| `#f0f0f0` | Admin .mixed bg (different), print counter bg |
| `#555` | Admin .mixed text (different) |
| `#ffa0a0` | .pace-arrow.up, login error, mini-widget error |
| `#a0e0a0` | .pace-arrow.down, submitted-message |
| `#b33` | Admin login error, btn-danger, toast error |
| `#daa` | Admin btn-danger border |
| `#900` | Admin btn-danger hover text |
| `#fef0f0` | Admin btn-danger hover bg |
| `#eee` | Admin table tbody td border |
| `#ccc` | Admin toggle off |
| `#666` | Cookie decline button bg |
| `#8DC63F` | Cookie accept button bg |
| `#888` | Privacy .updated text |
| `#333` | Privacy page body text |
| `#111` | Print counter/title |

### RGBA Values

| Value | Where Used |
|---|---|
| `rgba(25,45,23,0.08)` | --shadow-sm, chart grid lines |
| `rgba(25,45,23,0.1)` | --shadow-md |
| `rgba(25,45,23,0.12)` | --shadow-lg |
| `rgba(255,255,255,0.08)` | Counter section border-top |
| `rgba(255,255,255,0.07)` | Signup section border-top |
| `rgba(255,255,255,0.06)` | Pace box bg, login box bg |
| `rgba(255,255,255,0.15)` | Pace box border, login box border, OG rule |
| `rgba(255,255,255,0.08)` | Admin login input bg |
| `rgba(255,255,255,0.2)` | Admin login input border |
| `rgba(255,255,255,0.4)` | Login placeholder |
| `rgba(255,255,255,0.35)` | Admin topbar btn border |
| `rgba(255,255,255,0.12)` | Admin topbar btn hover bg |
| `rgba(255,255,255,0.18)` | Admin topbar nav active |
| `rgba(255,255,255,0.1)` | Admin topbar nav hover |
| `rgba(255,255,255,0.6)` | Admin topbar nav text |
| `rgba(61,107,53,0.3)` | Source link border-bottom |
| `rgba(61,107,53,0.18)` | Chart area gradient top |
| `rgba(61,107,53,0.02)` | Chart area gradient bottom |
| `rgba(61,107,53,0.16)` | Widget sparkline gradient top |
| `rgba(228,153,27,0.3)` | Chart point highlight shadow |
| `rgba(228,153,27,0.5)` | Pulse animation shadow start |
| `rgba(228,153,27,0)` | Pulse animation shadow end |
| `rgba(0,0,0,0.2)` | styles.css toggle knob shadow |
| `rgba(0,0,0,0.15)` | Admin toggle knob shadow, admin toast shadow |
| `rgba(0,0,0,0.3)` | Cookie banner shadow |
| `rgba(0,0,0,0.4)` | styles.css modal backdrop |
| `rgba(0,0,0,0.45)` | Admin modal backdrop |
| `rgba(0,0,0,.06)` | Admin shadow-sm |
| `rgba(0,0,0,.2)` | Admin modal shadow |
| `rgba(25,45,23,0.4)` | Chart Y-axis text |
| `rgba(25,45,23,0.35)` | Chart X-axis text, widget sparkline Y-axis |
| `rgba(25,45,23,0.32)` | Widget sparkline X-axis |
| `rgba(25,45,23,0.07)` | Widget sparkline grid |
| `rgba(255,255,255,0.025)` | OG dot grid texture |

---

## 10. Complete Border Radius Index

| Value | Where Used |
|---|---|
| `999px` | stock-pill, pct-pill, attr-tag (all variants), toggle-track, admin stat-chip, chart-point-highlight (50%) |
| `50%` | spinner, toggle-knob, chart-point-highlight, pulse dot |
| `1rem` | login-box (styles.css), modal (styles.css) |
| `0.75rem` | trend-panel, table-card, table-section, modal (admin), admin table-section |
| `0.65rem` | stat-card, report-card, method, cite-block, spark-card |
| `0.6rem` | pace-box (dashboard) |
| `0.55rem` | toast (styles.css), pace-box (widget), stat-chip (widget), report-row |
| `0.5rem` | login-box input (styles.css), btn (styles.css), toast (admin) |
| `0.45rem` | chart-tooltip, form-group input/select (styles.css), cta-btn |
| `0.4rem` | HubSpot input/button, btn (admin), form input/select (admin), login input (admin) |
| `0.35rem` | topbar-nav a (admin) |
| `0.3rem` | btn-icon (admin) |
| `5px` | OG CTA button |
| `4px` | Cookie consent buttons |

---

## 11. Complete Font Size Index

| Size | Where Used |
|---|---|
| `clamp(2.8rem, 9vw, 4.6rem)` | Dashboard counter-number |
| `clamp(2.4rem, 11vw, 3.4rem)` | Dashboard counter-number (mobile) |
| `clamp(1.9rem, 6vw, 2.8rem)` | Widget counter-number |
| `clamp(1.8rem, 5vw, 2.6rem)` | Widget-mini counter-number |
| `clamp(1.4rem, 3.5vw, 2.2rem)` | hero-h2 |
| `clamp(1.3rem, 6vw, 1.8rem)` | hero-h2 (mobile) |
| `clamp(1.3rem, 3vw, 2rem)` | stat-card p |
| `clamp(1rem, 3.5vw, 1.3rem)` | Widget title |
| `clamp(0.9rem, 2vw, 1.2rem)` | site-title |
| `clamp(0.82rem, 4vw, 1rem)` | site-title (mobile) |
| `1.7rem` | Widget-mini counter (380px) |
| `1.6rem` | Privacy h1, Widget-mini counter (600px) |
| `1.5rem` | Dashboard pace-number |
| `1.25rem` | Widget stat-chip-value |
| `1.2rem` | Widget pace-number |
| `1.15rem` | Dashboard stat-card p (mobile) |
| `1.1rem` | Section h2, login h1, modal h2, privacy h2 |
| `1.05rem` | Admin stat-chip strong, admin table h2, admin modal h2, mobile card major company |
| `1rem` | Admin btn-icon font, rc-jobs, widget stat-chip-value (600px), checkbox |
| `0.98rem` | Major cell-jobs |
| `0.95rem` | Admin topbar h1, signup h2, major cell-company, rc-company |
| `0.92rem` | Privacy p/ul, styles.css topbar h1, widget rr-jobs |
| `0.9rem` | Dashboard subtitle, admin login input |
| `0.88rem` | Trend-panel h3, admin tbody td, widget rr-company, form-group input (styles.css) |
| `0.86rem` | Dashboard tbody td, admin-table tbody td |
| `0.85rem` | Btn (styles.css), method summary, toast (styles.css), privacy back-link, form inputs (admin), form-row-check label, submitted message |
| `0.84rem` | Method p, cite-block p, dashboard subtitle (mobile), admin toast |
| `0.82rem` | Stock-pill, pct-pill, HubSpot input/button, admin btn, admin stat-chip, admin topbar-nav, source-link (admin), loading state (widget), rr-company (600px) |
| `0.8rem` | Source-link (styles.css), privacy .updated, signup-copy p, pace-arrow, mini-widget state-msg |
| `0.78rem` | Cite-block h3, form-group label (styles.css), HubSpot label, admin btn-sm, counter-label (mini) |
| `0.75rem` | Admin btn-sm, cta-btn |
| `0.74rem` | cell-meta |
| `0.72rem` | Counter-label, eyebrow, counter-asof, trend-kicker, chart-tooltip, trend-summary, count-badge, site-footer p, last-updated, rc-meta, form label (admin) |
| `0.7rem` | HubSpot legal/error, method arrow, dash-link (mini) |
| `0.68rem` | Stat-card h3, admin thead th, pace-delta, counter-asof (mini) |
| `0.66rem` | Dashboard thead th, table-disclaimer, admin attr-tag |
| `0.65rem` | Widget source-link, rr-meta, w-footer-note, count-badge (widget), brand-cell (mini) |
| `0.62rem` | Attr-tag (styles.css), trend-kicker, counter-label (widget), pace-label (dashboard), stat-card h3 (mobile), spark-summary |
| `0.6rem` | Rc-label, w-live, spark-label, header-updated (mobile), widget counter-asof, widget pace-delta |
| `0.58rem` | Widget stat-chip-label, widget pace-label, widget attr-tag, widget stat-chip-sub, widget stat-chip-label (600px: 0.54rem) |
| `14px` | Cookie banner text |
| `13px` | Cookie banner buttons |
| `152px` | OG big number |
| `58px` | OG headline |
| `30px` | OG sub-headline |
| `24px` | OG number label |
| `21px` | OG CTA button |
| `18px` | OG source line |
| `10px` | Chart Y-axis labels |
| `9px` | Widget sparkline Y-axis |
| `8.5px` | Widget sparkline X-axis |

---

## 12. Complete Spacing Index

### Page-level widths
| Value | Where Used |
|---|---|
| `min(1100px, 92vw)` | Dashboard all sections |
| `min(1200px, 96vw)` | Admin container (widest) |
| `min(780px, 92vw)` | Privacy page |
| `min(600px, 92vw)` | Admin modal |
| `min(560px, 92vw)` | Dashboard modal |
| `min(380px, 90vw)` | Login box (both) |

### Section padding (vertical)
| Value | Where Used |
|---|---|
| `1rem 0 1.1rem` | site-header |
| `1.4rem 0 1.6rem` | counter-section |
| `2rem 0 0` | hero |
| `0.6rem 0 0.4rem` | signup-section |
| `1.5rem 0 0` | stats-section |
| `1.5rem 0` | reports-section |
| `0 0 1rem` | method-section |
| `0 0 1.5rem` | cite-section |
| `1.4rem 0` | site-footer |
| `1.5rem` | admin container |
| `6vh` | modal padding-top |

### Gaps
| Value | Where Used |
|---|---|
| `1.8rem` | Hero grid |
| `1.5rem` | Counter grid, mini-widget |
| `1.2rem` | Footer inner, admin stats-bar margin-bottom, modal h2 margin-bottom |
| `1rem` | Header wrap, hero grid (mobile), admin topbar, admin stats-bar |
| `0.85rem` | Stats row, cite-wrap, form-grid |
| `0.75rem` | Topbar-left, section-head, admin table-header margin-bottom |
| `0.65rem` | Topbar-right, form-actions, widget body |
| `0.6rem` | Report-card margin-bottom, admin stats-bar |
| `0.5rem` | Widget stats, rc-top, spinner margin-bottom, form-actions (admin), widget footer, rr-meta |
| `0.4rem` | Btn gap, method summary |
| `0.35rem` | Widget stats (600px), rc-grid row gap |
| `0.3rem` | Form-group, stats-row (420px) |

### Common padding patterns
| Value | Where Used |
|---|---|
| `0.85rem 1rem` | Stat-card, cite-block, table-header, report-card |
| `0.65rem 0.7rem` | Table cells (dashboard) |
| `0.7rem 0.75rem` | Table cells (admin) |
| `0.55rem 1rem` | Stat-chip (styles.css), toast (dashboard/admin) |
| `0.55rem 0.7rem` | Form inputs (styles.css) |
| `0.45rem 0.9rem` | Admin btn |
| `0.35rem 0.65rem` | btn-sm (styles.css) |
| `0.25rem 0.55rem` | btn-sm (admin) |

---

*Generated from codebase analysis on 2026-03-10.*
