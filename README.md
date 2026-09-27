<div align="center">

# 🎮 PIXELLON

**The Ultimate Gaming Discovery, Indie Radar, Codex & Esports Hub**

<p align="center">
  <em>"Small pixels. Big possibilities. Play. Share. Belong."</em>
</p>

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 Overview

**Pixellon** is a cyber-themed, next-generation gaming hub connecting players, developers, and esports fans in a unified ecosystem. Built with cutting-edge web technologies (**React 19**, **Vite 8**, **Tailwind CSS v4**, and **Three.js**), Pixellon pairs high-performance data feeds with a tactile, gamified interface.

From tracking **100% OFF verified game giveaways** and **live esports tournaments** to exploring the comprehensive **Community Codex (Wiki)** and earning **Session XP**, Pixellon is the all-in-one battle station for modern gamers.

---

## ⚡ Key Features

```
  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
  │   DISCOVER      │       │     LEARN       │       │    COMPETE      │
  │ • Indie Radar   │ ────► │ • Game Codex    │ ────► │ • Esports Hub   │
  │ • Free Giveaways│       │ • Wiki Guides   │       │ • Live Streams  │
  │ • Deals Vault   │       │ • News & Reviews│       │ • Leaderboards  │
  └─────────────────┘       └─────────────────┘       └─────────────────┘
```

### 🌌 1. Immersive 3D Arena Experience
* **WebGL Voxel Universe**: Real-time floating voxel field with cursor parallax, depth scaling, and camera dampening via Three.js.
* **Tactile Micro-Interactions**: Magnetic buttons with pixel bursts, 3D card tilts with specular glare, and reactive cursor lighting.
* **WebAudio Synth System**: Zero-dependency audio feedback for XP collection, portal transitions, and button clicks.

### 🎮 2. Gamified Session Progression
* **Exploration XP Engine**: Earn XP automatically as you uncover new sectors (Game Library, Codex, Radar, Deals).
* **Dynamic Arena HUD**: Real-time level badge, progress bar, audio toggle, and motion intensity controls (`MOTION+` / `MOTION-`).
* **Interactive Mascot**: 3D animated Pixel Cat companion with autonomous idle walk-ins and summon commands.

### 📚 3. Community Codex & Wiki Hub
* **Hierarchical Documentation**: In-depth game wikis with markdown support, GFM tables, and code snippets.
* **Game Vault & Records**: Curated game metadata, platform badges, developer credits, and community verdicts.

### 💸 4. Deals, Giveaways & Release Radar
* **Free Game Radar**: Real-time tracker for 100% free drops across Steam, Epic Games Store, and GOG.
* **Launch Calendar**: Interactive release schedule with platform filters and confirmed launch alerts.
* **Discord Webhook Alerts**: Connect your Discord server to receive automated giveaway notifications.

### 🏆 5. Esports Arena & Live Streams
* **Match Center**: Live tournament feeds, scoreboards, match schedules, and team roster stats.
* **Live Streams Directory**: Embedded Twitch/Kick streams with category filters and viewer analytics.

---

## 🛠️ Tech Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | React 19, Vite 8, React Router v7, React DOM 19 |
| **Styling & Theme** | Tailwind CSS v4, CSS Custom Properties, Dark/Light Mode Engine |
| **Graphics & Motion** | Three.js, Framer Motion, `@react-three/fiber`, WebAudio API |
| **Icons & UI** | Lucide React, Custom Pixel Brand Kit, CRT Retro Overlays |
| **Backend API** | Node.js (ES Modules), Express.js, CORS, Dotenv |
| **Data & Auth** | MongoDB, Mongoose, JWT (JSON Web Tokens), bcryptjs |
| **Code Quality** | Oxlint (Ultra-fast Rust-based linter) |

---

## 📁 Repository Structure

```text
Pixellon/
├── backend/
│   ├── src/
│   │   ├── config/             # Database connection & environment configs
│   │   ├── controllers/        # Request controllers (Auth, Games, Vault)
│   │   ├── middlewares/        # JWT auth verification & error handlers
│   │   ├── models/             # Mongoose schemas (User, Game, Review, Wiki)
│   │   ├── routes/             # Express API routes (/auth, /vault, etc.)
│   │   └── server.js           # Backend server entry point
│   ├── .env.example            # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── public/                 # Public assets & icons
│   ├── src/
│   │   ├── assets/             # Brand logos & static vectors
│   │   ├── components/         # Modular UI components
│   │   │   ├── home/           # Homepage modular sections
│   │   │   ├── hud/            # Arena HUD, Section Progress & Scroll Hints
│   │   │   ├── intro/          # Cyberpunk Arena Boot / Loading Screen
│   │   │   ├── mascot/         # Pixel Cat Companion Director & 3D Canvas
│   │   │   ├── motion/         # Magnetic buttons, Parallax cards, Reveal animations
│   │   │   ├── sidebar/        # Portal sticky sidebar (Esports, Drops, Radar)
│   │   │   └── webgl/          # Three.js ArenaScene & VoxelField
│   │   ├── context/            # React Contexts (Auth, Theme, Codex)
│   │   ├── gamification/       # XPProvider & Session reward hooks
│   │   ├── motion/             # Motion tokens, sound engine, pointer hooks
│   │   ├── pages/              # Views (Home, Codex, Deals, Esports, Profile, etc.)
│   │   ├── retro/              # CRT Overlays & Pixel News Ticker
│   │   ├── utils/              # API clients, Discord webhooks, Deals parser
│   │   ├── App.jsx             # Master layout shell & routing table
│   │   ├── index.css           # Tailwind v4 directives & Cyber theme tokens
│   │   └── main.jsx            # React root mount
│   ├── package.json
│   └── vite.config.js
│
├── package.json                # Monorepo unified script manager
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or a MongoDB Atlas connection string

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/dusty-pixel/Pixellon.git
cd Pixellon
```

---

### Step 2: Install Dependencies

Install root and workspace dependencies:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

---

### Step 3: Configure Environment Variables

1. **Backend Configuration** (`backend/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/pixellon
   JWT_SECRET=pixellon_super_secret_jwt_key_2026_gamer
   CLIENT_URL=http://localhost:5173
   ```

2. **Frontend Configuration** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

### Step 4: Run the Application

#### 🏎️ Development Mode (Hot Reload)

Run frontend and backend concurrently in separate terminals:

```bash
# Terminal 1: Frontend (Vite on http://localhost:5173)
npm run dev:frontend

# Terminal 2: Backend (Node.js API on http://localhost:5000)
npm run dev:backend
```

#### 📦 Production Build & Run

```bash
# Build optimized frontend bundle
npm run build:frontend

# Start production backend server
npm run start:backend
```

---

## 📜 NPM Scripts Reference

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts frontend development server |
| `npm run dev:frontend` | Starts Vite dev server with HMR |
| `npm run dev:backend` | Starts Express backend server with `--watch` auto-restart |
| `npm run build` | Compiles optimized production frontend build |
| `npm run start:backend` | Launches production backend instance |
| `npm run lint` | Runs Oxlint across the frontend codebase |

---

## 🕹️ Easter Eggs & Controls

Pixellon includes hidden interactions and retro features:

| Trigger | Effect |
| :--- | :--- |
| **Intro Screen** | Click `ENTER ARENA →` or press any key to enter the hub |
| **HUD Controls** | Bottom-left HUD lets you toggle `SND ON/OFF` and `MOTION+/MOTION-` |
| **Cat Summon** | Dispatch `pixellon:summon-cat` event to summon the Pixel Cat mascot |
| **Brand Easter Egg** | Click the Pixellon logo in the navbar 5 times for a surprise particle burst |
| **Theme Toggle** | Switch seamlessly between Neon Cyber Dark and High-Contrast Light mode |

---

## 🔒 Security & Best Practices

- **Zero-Exposure Credentials**: All sensitive keys (`.env`) are strictly git-ignored.
- **JWT Authentication**: Password hashing with `bcryptjs` and stateless authentication tokens.
- **Safe WebGL Fallback**: Three.js canvas wrapped in error boundaries to ensure graceful fallback on non-hardware-accelerated devices.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m "feat: Add some AmazingFeature"`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with 💙 by the Pixellon Team. Small pixels, big possibilities.</sub>
</div>
