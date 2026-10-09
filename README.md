# Pixellon

A gaming discovery hub — indie radar, free-game giveaways, deals, release calendar,
community wiki, live esports and streams. *Small pixels. Big possibilities.*

**Stack:** React 19 · Vite 8 · Tailwind CSS v4 · Three.js · Express · MongoDB

Full walkthrough: [`tutorial.md`](./tutorial.md)

---

## Features

- **Discover** — indie spotlights, 100%-off game radar, PC deals vault, release calendar, news wire, reviews
- **Learn** — community game wiki (Codex) with markdown articles, beginner Gateway guides
- **Compete** — live esports match center, Twitch/Kick stream directory
- **Belong** — profiles with auth, session XP for exploring, Discord webhook alerts for drops
- **Presentation** — dark/light mode with four palettes, WebGL arena intro, CRT/LED retro layer, synth audio feedback

## Repository layout

```
Pixellon/
├── frontend/          # The app. React SPA, builds to frontend/dist/
│   └── src/
│       ├── pages/         # 14 route views (Home, Indie, Reviews, Calendar, Deals,
│       │                  # Gateway, CodexHub, GameWiki, FreeGames, News, Streams,
│       │                  # Esports, Profile, SignIn)
│       ├── components/    # UI blocks (home sections, sidebar, motion, tlou, webgl…)
│       ├── context/       # Auth, Theme, Codex
│       ├── gamification/  # Session XP provider
│       ├── motion/        # Animation tokens, sound synth, pointer hooks
│       ├── retro/         # CRT overlay, LED ticker event bus
│       ├── utils/         # API clients (RAWG, CheapShark, Steam, Discord…)
│       └── data/          # Seed/mock datasets
├── backend/           # Express + Mongoose API (auth, vault, health)
│   └── src/
│       ├── routes/        # authRoutes, vaultRoutes, healthRoutes
│       ├── controllers/   # authController
│       ├── models/        # userModel
│       ├── middlewares/   # JWT protect, error handlers
│       ├── services/      # trendingService (FreeToGame live feed)
│       └── config/        # DB connection
├── src/               # Legacy prototype (old "Nexus" app). Not built or deployed.
├── tutorial.md        # In-depth guide: architecture, data flow, backend roadmap
└── wrangler.jsonc     # Cloudflare deploy config (serves frontend/dist as SPA)
```

## Getting started

Prerequisites: **Node.js 18+**, **npm 9+**, and optionally a local MongoDB
(the backend runs in mock mode without one).

```bash
# 1. Clone and install
git clone https://github.com/ayushraj16/pixellon.git
cd pixellon
npm install
npm install --prefix frontend
npm install --prefix backend

# 2. Backend config
cp backend/.env.example backend/.env
# Edit backend/.env: set JWT_SECRET, MONGO_URI, STEAM_API_KEY (optional)

# 3. Frontend config (optional) — frontend/.env
# VITE_API_URL=http://localhost:5000/api
# VITE_RAWG_API_KEY=<key>   (game metadata; falls back to mock data without it)
```

Without any `.env` files the app still runs end-to-end on local fallbacks
(mock data + localStorage accounts).

```bash
# 4. Run (two terminals)
npm run dev:frontend   # http://localhost:5173
npm run dev:backend    # http://localhost:5000
```

Demo login (works with no backend): `alex.rider@pixellon.com` / `demo1234`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` / `dev:frontend` | Vite dev server with HMR |
| `npm run dev:backend` | Express API with `--watch` restart |
| `npm run build` / `build:frontend` | Production bundle to `frontend/dist/` |
| `npm run start:backend` | Production backend |
| `npm run lint` | Oxlint over `frontend/` |
| `npm run deploy` | Build + `wrangler deploy` to Cloudflare |

## How it fits together

The frontend is backend-optional: auth tries `VITE_API_URL` then falls back to a
localStorage account store; the trending spotlight tries `/api/vault` then falls
back to mock data; Steam player counts hide when the backend answers 204
(no `STEAM_API_KEY`). The frontend deploys as a Cloudflare static SPA; the
Express API runs separately. Backend gaps and next steps are tracked in
[`tutorial.md`](./tutorial.md#6-how-the-backend-is-to-be-built-roadmap).

## Notes

- Hidden interactions: click the navbar logo 5 times, `pixellon:summon-cat` event,
  `MOTION+`/`MOTION-` and sound toggles in the HUD.
- Secrets (`.env`) are git-ignored. Passwords are bcrypt-hashed; auth is
  stateless JWT (30-day expiry).

## Contributing

1. Fork and create a feature branch (`git checkout -b feat/name`)
2. Commit (`git commit -m "feat: description"`)
3. Push and open a pull request

## License

MIT
