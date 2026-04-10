# How I Built CityDeals - A Map-Based Local Marketplace for India

## The Idea

I wanted to build a platform where anyone in India could list something to sell - called a "deal" - and pin it right on the map of their city. Buyers browsing the map could see deals near them, check the details, and contact the seller directly via phone or email. Simple, hyperlocal, no middleman.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) with TypeScript |
| **Frontend** | React 19, Tailwind CSS 4 |
| **Maps** | Leaflet + React Leaflet with OpenStreetMap tiles |
| **Nearby Places** | Overpass API (OpenStreetMap POI data) |
| **Database** | Turso (SQLite-compatible serverless DB via libsql) |
| **Hosting** | Vercel (frontend + API routes) |
| **ID Generation** | UUID v4 |

I chose Next.js API routes over a separate backend to keep it simple - one project, one deploy. Turso was perfect because it gives you cloud-hosted SQLite with a generous free tier, and the `@libsql/client` package is a drop-in replacement for local SQLite during development.

## Architecture

The app is a single-page layout with three main sections:

1. **Header** - City picker (searchable dropdown with 90+ cities across all 28 Indian states and 8 UTs), grouped by state, plus a "Post Deal" button.
2. **Sidebar** - Shows the deal list, deal creation form (2-step wizard), or deal detail view depending on the current action.
3. **Map** - Interactive Leaflet map with deal markers, hover tooltips, click popups, and an optional POI overlay showing nearby shops, restaurants, hospitals, ATMs, etc.

## Key Features I Built

**Deal Posting:** Users click anywhere on the map to pin a location, which auto-opens a 2-step form. Step 1 captures the deal info (title, description, price, category, expiry duration). Step 2 collects contact info (email/phone). The deal goes live immediately with a marker on the map.

**Search & Filter:** A wrapping grid of 13 category filter chips (Electronics, Vehicles, Grocery Store, etc.) with emoji icons and live count badges. Filters update the map markers and sidebar list in real-time.

**Deal Expiry:** Sellers choose how long their deal stays active - 1 day, 3 days, 7 days, 15 days, 30 days, or never. Expired deals are automatically filtered out by the API. Cards show a "5d left" badge that turns red when under 24 hours.

**Nearby Places Overlay:** A "Nearby Places" panel on the map lets you toggle 8 POI types (restaurants, cafes, shops, hospitals, pharmacies, ATMs, petrol pumps, schools). These are fetched from the Overpass API when zoomed in to street level, displayed as colored emoji markers with clickable popups showing names, phone numbers, and websites.

**Contact:** Every deal card has direct call (tel:) and email (mailto:) links. The deal detail view has prominent contact buttons.

**City Coverage:** I mapped 90+ cities covering every Indian state - from metros like Mumbai, Delhi, Bangalore to smaller capitals like Itanagar, Gangtok, Kavaratti.

## Database Design

A single `deals` table in Turso:

```
id, title, description, price, category, city,
lat, lng, contact_email, contact_phone,
expires_at, created_at
```

The API routes handle all CRUD operations - `GET /api/deals?city=Mumbai` returns non-expired deals for a city, `POST /api/deals` creates one, `DELETE /api/deals/[id]` removes it. Expired deals are filtered server-side with `WHERE expires_at IS NULL OR expires_at > datetime('now')`.

## Challenges & Solutions

**Map Click Conflicts:** Clicking a deal marker was also triggering the "post deal" map click handler, causing crashes. I fixed this by tracking marker clicks via a ref and checking `event.originalEvent.target` to ignore clicks on markers and popups.

**Leaflet + Next.js SSR:** Leaflet doesn't work with server-side rendering. I used Next.js `dynamic()` import with `ssr: false` and a skeleton loader as the fallback.

**City Picker at Scale:** With 90+ cities, a plain dropdown was unusable. I built a searchable dropdown that groups cities by state with sticky headers, and flattens to search results when you type.

## Deployment

The app runs on **Vercel** with the database on **Turso** (EU-West region). Both are free tier. Every push to GitHub auto-deploys via Vercel's Git integration. Environment variables (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) are set in the Vercel dashboard.

The local development setup falls back to a local SQLite file (`file:citydeals.db`) when Turso credentials aren't present, so you can develop without any cloud dependency.

## What I'd Add Next

- User authentication so only deal owners can delete their deals
- Image uploads for deal listings
- Real-time notifications when someone contacts you
- Reviews and trust scores for repeat sellers
- Multi-language support (Hindi, regional languages)

## Links

- **Live:** [citydeals.vercel.app](https://citydeals.vercel.app)
- **GitHub:** [github.com/soni-world/citydeals](https://github.com/soni-world/citydeals)
- **Built by:** [Soni Kumari](https://www.linkedin.com/in/soni-kumari-29a59a21/)
