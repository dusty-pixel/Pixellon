# Pixellon — Complete Tutorial

> Everything about Pixellon: what it is, how the frontend is built,
> how the backend is built, how the backend is *to be* built, and
> what Pixellon is up to right now.

---

## 1. What is Pixellon?

**Pixellon** is a gaming discovery hub — *"Small pixels. Big possibilities. Play. Share. Belong."*
It connects players, indie developers, and esports fans in one cyber/retro-styled web app:

| Pillar | What it does | Main pages |
|---|---|---|
| **Discover** | Indie radar, free-game giveaways, deals vault, release calendar, news, reviews | `/indie`, `/free-games`, `/deals`, `/calendar`, `/news`, `/reviews` |
| **Learn** | Community game wiki ("Codex"), beginner guides | `/vault`, `/vault/:gameId`, `/gateway` |
| **Compete** | Live esports match center, streams directory | `/esports`, `/streams` |
| **Belong** | Profiles, sign-in, session XP, mascots, Discord alerts | `/profile`, `/signin` |

Key idea: the app works **with or without a backend**. Every remote data source has a
local fallback (mock data, `localStorage`, cached feeds), so the frontend is fully
usable offline-first, and the backend progressively enhances it (real auth, live
trending data, cached Steam stats).

---

## 2. Repository map

```
Pixellon/
├── frontend/               # ← THE app (Pixellon). Start here.
│   ├── src/
│   │   ├── App.jsx         # Layout shell + route table
│   │   ├── main.jsx        # Boot: providers + router + CSS
│   │   ├── index.css       # Tailwind v4 + theme tokens + retro layer
│   │   ├── pages/          # 14 route views
│   │   ├── components/     # UI blocks (home, mascot, motion, sidebar, tlou, webgl…)
│   │   ├── context/        # Auth, Theme, Codex (React contexts)
│   │   ├── gamification/   # XPProvider (session XP + toasts)
│   │   ├── motion/         # Motion tokens, sound synth, pointer hooks
│   │   ├── retro/          # CRT overlay + LED ticker event bus
│   │   ├── utils/          # API clients (RAWG, CheapShark, Steam, Discord…)
│   │   └── data/           # Mock/seed datasets
│   ├── vite.config.js      # Dev-server API proxies
│   ├── wrangler.jsonc      # Cloudflare static deploy (serves dist/)
│   └── package.json
├── backend/                # Express + MongoDB API (thin, growing)
│   └── src/
│       ├── server.js       # Entry: middleware, routes, error handlers
│       ├── routes/         # authRoutes, vaultRoutes, healthRoutes
│       ├── controllers/    # authController (register/login/me/profile)
│       ├── models/         # userModel (only model so far)
│       ├── middlewares/    # JWT protect, 404 + error handler
│       ├── services/       # trendingService (FreeToGame live feed)
│       └── config/db.js    # Mongoose connect (with mock-mode fallback)
├── src/                    # ⚠️ LEGACY prototype ("Nexus Gaming", old name).
│                           # Not part of Pixellon. Only `frontend/` is built/deployed.
├── wrangler.jsonc          # Root deploy: serves ./frontend/dist as SPA
└── package.json            # Monorepo scripts (dev/build/lint/deploy)
```

**Monorepo scripts** (`package.json` at root):

| Command | What it runs |
|---|---|
| `npm run dev` / `dev:frontend` | Vite dev server → `http://localhost:5173` |
| `npm run dev:backend` | Express API with `--watch` → `http://localhost:5000` |
| `npm run build` / `build:frontend` | Production bundle → `frontend/dist/` |
| `npm run start:backend` | Production backend (`node src/server.js`) |
| `npm run lint` | Oxlint over `frontend/` |
| `npm run deploy` | Build frontend + `wrangler deploy` (Cloudflare) |

---

## 3. How the frontend is built

Stack: **React 19 + Vite 8 + React Router v7 + Tailwind CSS v4 + Three.js + Framer Motion + Lucide icons.**

### 3.1 Boot sequence (`frontend/src/main.jsx`)

```jsx
<BrowserRouter>
  <ThemeProvider>      // dark/light + palette → <html> attributes
    <AuthProvider>     // session user, backend-or-localStorage login
      <CodexProvider>  // community wiki custom pages (localStorage)
        <MotionProvider>// pointer tracking, reduced-motion, MOTION±
          <XPProvider> // session XP, toasts, ticker announcements
            <App />
```

`App.jsx` renders the shell: `ParallaxBackground` → `CRTOverlay` → `PixelTicker` →
`Navbar` → page `Routes` → `Footer` → `MascotDirector`.

### 3.2 Routing table (`frontend/src/App.jsx`)

| Route | Page | Purpose |
|---|---|---|
| `/` | `Home.jsx` | Arena landing: spotlight hero, path picker, discovery grid |
| `/indie` | `Indie.jsx` | Indie spotlights (RAWG indie query + mock) |
| `/reviews` | `Reviews.jsx` | Review feed with sort + verdict badges |
| `/calendar` | `Calendar.jsx` | Release calendar + platform filter |
| `/deals` | `Deals.jsx` | PC deals via CheapShark |
| `/gateway` | `Gateway.jsx` | Beginner collections + guides ("start here") |
| `/vault`, `/vault/:gameId`, `/vault/:gameId/:pageId` | `CodexHub.jsx`, `GameWiki.jsx` | Game wiki hub + markdown articles (`/codex/*` redirects to `/vault/*`) |
| `/free-games` | `FreeGames.jsx` | 100%-off drops (Steam/Epic/GOG) |
| `/news` | `News.jsx` | Editorial dispatch-style gaming news wire |
| `/streams` | `Streams.jsx` | Twitch/Kick stream directory |
| `/esports` | `Esports.jsx` | Live match center + scores |
| `/profile` | `Profile.jsx` | Player card, badges, game picker |
| `/signin` (+`/login`, `/signup`) | `SignIn.jsx` | Login / register |

### 3.3 Theming engine (`context/ThemeContext.jsx` + `index.css`)

- Two axes: **color mode** (`dark` default "Midnight Obsidian" / `light` "Crisp Slate")
  and **palette** (`cyan`, `emerald`, `violet`, `inferno`), both persisted in `localStorage`.
- Applied as `<html data-color-mode data-theme>` attributes; all surfaces resolve
  through CSS vars (`--theme-bg`, `--theme-surface`, `--theme-text`, `--theme-accent`…).
- `index.css` (~900 lines) holds: design tokens, light-mode polish overrides,
  canonical 8px button system (`.btn-primary/.btn-surface/.btn-ghost`), micro badges
  (`.badge-live/.badge-discount/.badge-trending/.badge-new`), filter chips,
  progress bars, LED ticker + neon + CRT + scanline retro layer, TLOU cinematic
  classes, and editorial utilities. Flat-design rule: **no glow shadows** —
  glow utilities exist only as neutralized no-ops.

### 3.4 Data layer (`utils/` + `data/`)

External APIs (all with graceful degradation to mock data):

| Client | Source | Used for |
|---|---|---|
| `utils/api.js` | RAWG (`VITE_RAWG_API_KEY`) | Trending, top-rated, upcoming, indie games; gaming news for ticker |
| `utils/spotlightApi.js` | Backend `/api/vault/*` | Live trending spotlight + list |
| `utils/deals.js` | CheapShark (keyless) | Price matrix per title, store names |
| `utils/vaultGame.js`, `vaultRecord.js`, `wikidata.js` | Wiki/curated sources | Codex content |
| `utils/esportsLive.js` + `data/esportsData.js` | Live feed + mock | Match center |
| `utils/livestreams.js` + `data/mockStreams.js` | Twitch/Kick + mock | Streams directory |
| `utils/discordWebhook.js` | User-supplied webhook URL | Free-game/deal Discord alerts |
| `utils/currency.js` | Local | `formatINR` price formatting |

Static seeds live in `data/`: `mockData.js` (games/reviews/releases/guides),
`popularGamesCatalog.js`, `mockStreams.js`, `esportsData.js`.

Dev-server proxies (`frontend/vite.config.js`): `/api/steam`, `/api/igdb`,
`/api/steamapi` → upstream hosts, so the browser avoids CORS/key exposure.

### 3.5 State: three contexts + session XP

- **`AuthContext`** — dual-mode auth. If `VITE_API_URL` is set it tries the backend
  (`/auth/login`, `/auth/register`, stores `pixellon_token`); on failure it falls
  back to a `localStorage` accounts DB (`pixellon_accounts_db` + `pixellon_user`),
  seeded with a demo account (**email `alex.rider@pixellon.com`, password `demo1234`**).
  Session syncs across tabs via the `storage` event.
- **`CodexContext`** — user-created wiki pages per game, persisted as
  `pixellon_codex_custom_v3` in `localStorage` (`addPage/updatePage/deletePage`).
- **`XPProvider`** (`gamification/`) — session-scoped gamification (no accounts):
  discovering areas awards XP (`sessionStorage`), level = `floor(xp/100)+1`,
  toast popups, WebAudio `xp`/`discovery` blips, and ticker announcements
  (`+20 XP // NEW AREA`). `useDiscovery(areaId)` hook powers the Discovery Grid.

### 3.6 Motion, audio, retro systems (`motion/`, `retro/`, `components/`)

- **`motion/tokens.js`** — single source of truth: durations, easings, springs,
  card-tilt limits, Framer Motion reveal variants. Every animation references these.
- **`motion/sound.js`** — zero-dependency WebAudio synth (XP, portal, clicks).
- **`motion/MotionProvider.jsx`** — pointer position, `prefers-reduced-motion`,
  MOTION+/MOTION− intensity control.
- **Retro layer** — `CRTOverlay` (scanlines/grain), `PixelTicker` + `TickerProvider`:
  a global LED news band fed by a window event bus
  (`sayTicker('…')` → `CustomEvent('pixellon:ticker')`), with per-route messages,
  breaking headlines, and XP event interrupts.
- **3D/WebGL** — `components/webgl/ArenaScene.jsx` (voxel field), `GalaxyFall.jsx`
  (intro dive, lazy-loaded, error-boundary fallback), `components/PixelCat/`
  (canvas pixel-cat companion with states/behavior/cursor tracking),
  `components/mascot/MascotDirector.jsx` (orchestrates mascot).
- **Home sections** (`components/home/`): `PortalHero`, `ChoosePath` (4 doors),
  `DiscoverNet` (hoverable world-node SVG grid), `CommunityLobby`/`LobbyChat`,
  `BuildSection`, `EndOfLevel`.
- **TLOU spotlight** (`components/tlou/`): cinematic Lord-of-the-Wolves-style hero
  (`TlouSpotlightHero`, `TlouAtmosphere`, trailer modal/card, awards sidebar).
- **Sidebars** (`components/sidebar/`): sticky portal rails — trending news, live
  esports, upcoming radar, review scores, free drops, community pulse.

### 3.7 Pages in one line each

- **Home** — hero spotlight (live backend feed w/ fallback), Choose-Your-Path,
  Discovery Grid, community lobby.
- **Indie / Reviews / Calendar** — curated feeds with filters/sorting.
- **Deals / FreeGames** — CheapShark prices; 100%-off radar + Discord share.
- **CodexHub / GameWiki** — wiki index + markdown articles (GFM), TOC, infobox,
  live Steam player counts, Discord webhook modal.
- **News** — rotating editorial hero + archive sections.
- **Streams / Esports** — stream cards with filters; live/finished match cards.
- **Gateway** — newcomer collections + beginner guides + stats.
- **Profile / SignIn** — editable player card, badges, local or backend auth.

---

## 4. How the backend is built

Stack: **Node.js (ESM) + Express 4 + Mongoose 8 + JWT + bcryptjs + dotenv.**
Only **10 files** — deliberately thin.

### 4.1 Entry (`backend/src/server.js`)

```text
dotenv → connectDB() → express()
  → cors(localhost:5173/74/75 + credentials)
  → express.json()
  → /api/health → /api/vault → /api/auth
  → notFound → errorHandler → listen(PORT || 5000)
```

### 4.2 Routes & endpoints

| Method + path | Handler | Auth | What it does |
|---|---|---|---|
| `GET /api/health` | inline | No | `{ status:'online', timestamp, service, version }` |
| `POST /api/auth/register` | `authController.registerUser` | No | Validate → duplicate check → `User.create` (auto-hashed) → profile JSON + JWT (30d) |
| `POST /api/auth/login` | `authController.loginUser` | No | Find by email → `bcrypt.compare` → profile JSON + JWT |
| `GET /api/auth/me` | `authController.getMe` | **Yes** | Current profile (no password) |
| `PUT /api/auth/profile` | `authController.updateProfile` | **Yes** | Update displayName/headline/bio/location/battleStation/openToPlay/avatar, re-issue token |
| `GET /api/vault/trending-spotlight?gameId&force` | `trendingService` | No | Live spotlight detail (FreeToGame) |
| `GET /api/vault/spotlight-list` | `trendingService` | No | Top-5 by popularity (1h cache) |
| `GET /api/vault/upcoming-steam` | inline fetch | No | Steam `featuredcategories.coming_soon` mapped to Pixellon shape |
| `GET /api/vault/steam-players/:appid` | inline + TTL cache | No | Steam player count; **204 empty if `STEAM_API_KEY` unset** (frontend hides stats) |

### 4.3 Auth internals

- **Model** (`models/userModel.js`): username/email (unique, trimmed/lowercased),
  password (min 6, bcrypt-hashed in `pre('save')`), gamer-profile fields
  (displayName, avatar via DiceBear pixel-art, role, level, headline, bio,
  location, battleStation, openToPlay, steamId, discordTag) + timestamps.
- **Middleware** (`middlewares/authMiddleware.js`): `protect` parses
  `Authorization: Bearer <jwt>`, verifies with `JWT_SECRET`, attaches
  `req.user` (falls back to `{ id }` if DB lookup misses — mock-session tolerant).
- **Errors** (`middlewares/errorMiddleware.js`): 404 catcher + JSON error handler
  (stack traces hidden in production).

### 4.4 Live-data services

- **`services/trendingService.js`** — FreeToGame API aggregator: top-5 popularity
  list (hour-cached), per-game detail enrichment (screenshots, synopsis, ranking
  badges), verified YouTube trailer matching, full offline `FALLBACK_GAME/LIST`.
- **Vault cache** (`vaultRoutes.js`) — in-memory `Map` with 5-min TTL for Steam
  player counts (code comment: *"swap for Redis when scaling"*).
- **DB resilience** (`config/db.js`) — 2.5s server-selection timeout; on failure
  logs a warning and runs in **in-memory mock mode** instead of crashing.

### 4.5 Configuration (`backend/.env` — create from `.env.example`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/pixellon
JWT_SECRET=<long-random-string>
CLIENT_URL=http://localhost:5173
STEAM_API_KEY=<optional — enables live player counts>
```

> No `.env` files are committed (nothing found in repo) — you must create
> `backend/.env` and optionally `frontend/.env` (`VITE_API_URL`,
> `VITE_RAWG_API_KEY`, `VITE_DISCORD_WEBHOOK_URL`) yourself.

---

## 5. How frontend ↔ backend connect

```
Browser ──fetch──▶ Vite proxy (/api/steam…) or RAWG/CheapShark directly
Browser ──fetch──▶ Express :5000 (/api/auth, /api/vault)  ← only if VITE_API_URL set
```

Design philosophy: **backend-optional.** `AuthContext` tries the API then falls
back to `localStorage`; `spotlightApi` falls back to mock spotlight; Steam stats
hide on HTTP 204. Deployments reflect this split: the frontend ships as a
**Cloudflare Workers static SPA** (`wrangler.jsonc` → `frontend/dist`,
`not_found_handling: single-page-application`), while Express runs separately
(local `:5000` today — no cloud backend target configured yet).

---

## 6. How the backend is to be built (roadmap)

What's missing or stubbed, in rough priority order:

1. **Missing domain models** — README advertises `Game`, `Review`, `Wiki`
   models + `Games`/`Vault` controllers. None exist yet. To build:
   `models/gameModel.js`, `reviewModel.js`, `wikiPageModel.js` (+ controllers,
   routes, `protect` on writes) so Codex pages, reviews, and vault records
   persist server-side instead of `localStorage`/mock files.
2. **Persist gamification** — XP/discoveries are `sessionStorage`-only. Add a
   `PUT /api/auth/xp` or activity-log collection tied to the JWT user.
3. **Cache upgrade** — replace the in-route `Map` TTL with Redis
   (already flagged in code) once multiple instances/traffic arrive.
4. **Wire `STEAM_API_KEY`** — currently returns 204 without it; add key +
   extend to wishlists/prices; add IGDB proxy route (frontend proxies IGDB
   directly today, leaking the pattern if a token is ever needed).
5. **Production hardening** — CORS allow-list is localhost-only (add the
   Cloudflare domain), require `JWT_SECRET` (fail fast instead of default),
   add rate limiting + request validation, remove `pixellon-monorepo: file:..`
   self-dependency from `backend/package.json`.
6. **Tests & docs** — no backend tests exist; add endpoint tests (auth flow,
   vault cache, 204-without-key behavior) and OpenAPI/Swagger docs.
7. **Deploy target** — decide: keep Express on a VPS/Render/Fly, or migrate to
   Cloudflare Workers + D1 (Mongo/Mongoose can't run on Workers — that would
   mean a data-layer rewrite).

---

## 7. What Pixellon is up to (current state)

- **Frontend: feature-rich and shippable.** 14 routes, dual dark/light × 4-palette
  theme engine, WebGL arena + intro dive, pixel-cat mascot, synth audio, LED
  ticker event bus, session XP, Discord webhook alerts, live RAWG/CheapShark/
  Steam/FreeToGame integrations — all with offline fallbacks. Builds clean
  (`vite build`, ~1 MB JS) and lints clean (Oxlint, warnings only).
- **Backend: minimal but real.** Auth (register/login/profile, JWT+bcrypt),
  health check, live trending proxy, Steam cache — with mock-mode resilience.
  It authenticates the SignIn/Profile flow when `VITE_API_URL` points at it.
- **Just cleaned:** site-wide removal of glow/neon/AI-slop styling in favor of
  a flat design system (see `frontend/src/index.css` + per-page edits).
- **Next up:** server-side persistence for Codex/Reviews/Vault (replacing
  `localStorage` + mocks), production backend hosting + CORS, and Redis
  caching as traffic grows.

---

## 8. Run it yourself (5 minutes)

```bash
# 1. Install
npm install && npm install --prefix frontend && npm install --prefix backend

# 2. Backend env
cp backend/.env.example backend/.env   # then edit JWT_SECRET etc.

# 3. (Optional) frontend env → frontend/.env
# VITE_API_URL=http://localhost:5000/api
# VITE_RAWG_API_KEY=<your key>

# 4. Run both (two terminals)
npm run dev:frontend   # http://localhost:5173
npm run dev:backend    # http://localhost:5000

# 5. Try the demo login (works with no backend via local fallback):
#    email: alex.rider@pixellon.com   password: demo1234
```

---

## 9. Key-file cheat sheet

| Want to… | Open |
|---|---|
| Change routes/layout | `frontend/src/App.jsx` |
| Change theme/colors | `frontend/src/index.css` + `context/ThemeContext.jsx` |
| Add a page | `frontend/src/pages/` + route in `App.jsx` + ticker msg in `retro/TickerProvider.jsx` |
| Fetch a new game API | `frontend/src/utils/api.js` (follow RAWG mappers) |
| Change XP rules | `frontend/src/gamification/XPProvider.jsx` |
| Change animations | `frontend/src/motion/tokens.js` |
| Add auth fields | `backend/src/models/userModel.js` + `controllers/authController.js` |
| Add an endpoint | `backend/src/routes/` + mount in `backend/src/server.js` |
| Deploy frontend | `npm run build` then `wrangler deploy` |
