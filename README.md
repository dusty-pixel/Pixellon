# Pixellon 🎮

> **Next-Gen Gaming Discovery, Indie Radar, Codex & Esports Hub**

Pixellon is a full-stack modern gaming platform built for gamers, indie game developers, and esports fans. It brings together game discovery, release calendars, deals, live streams, game wikis (Codex), tournament trackers, and gamer profile management in a unified cyber-themed experience.

---

## 🚀 Features

- **🎯 Indie Radar & Game Discovery**: Explore upcoming indie releases, trending titles, and curated games.
- **📖 Gaming Codex (Wiki)**: In-depth game wikis, guides, and documentation.
- **📅 Release Calendar**: Track upcoming gaming launch dates across platforms.
- **💸 Deals & Free Games**: Discover active game deals, discounts, and free giveaway trackers.
- **⚡ Esports Arena**: Live match trackers, tournament brackets, schedules, and team stats.
- **📺 Streams & Live Hub**: Stream directories and live viewer integration.
- **📰 Gaming News & Reviews**: Curated breaking gaming news and community reviews.
- **👤 Gamer Profile**: Custom gamer profiles, stat tracking, and bookmarks.
- **🔐 Secure Authentication**: JWT-based user authentication and session management.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations & 3D**: [Framer Motion](https://www.framer.com/motion/) & [Three.js](https://threejs.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Auth**: [JSON Web Tokens (JWT)](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Security & Utilities**: CORS, Dotenv

---

## 📁 Project Structure

```text
Pixellon/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and server configs
│   │   ├── controllers/    # API request handlers
│   │   ├── middlewares/    # Auth and error middlewares
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express API routes
│   │   └── server.js       # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images and icons
│   │   ├── components/     # UI components (Navbar, Footer, PixelCat, etc.)
│   │   ├── context/        # React context providers
│   │   ├── data/           # Mock data and static content
│   │   ├── pages/          # Application views (Home, Indie, Codex, Esports, etc.)
│   │   ├── utils/          # Helper utilities
│   │   ├── App.jsx         # App shell & routing
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # Frontend entry point
│   ├── package.json
│   └── vite.config.js
│
├── package.json            # Root workspace scripts
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas URI)

### Installation

1. **Clone repository:**
   ```bash
   git clone https://github.com/dusty-pixel/Pixellon.git
   cd Pixellon
   ```

2. **Install dependencies:**
   ```bash
   # Root & sub-projects
   npm install
   npm install --prefix frontend
   npm install --prefix backend
   ```

3. **Configure Environment Variables:**

   In `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/pixellon
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```

   In `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

## 💻 Running the Application

### Development Mode

Run frontend and backend simultaneously or independently:

```bash
# Start frontend dev server (Vite on http://localhost:5173)
npm run dev:frontend

# Start backend server (Node watch mode on http://localhost:5000)
npm run dev:backend
```

### Production Build

```bash
# Build frontend production bundle
npm run build:frontend

# Start production backend server
npm run start:backend
```

---

## 📜 Available Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Runs frontend development server |
| `npm run dev:frontend` | Runs frontend Vite dev server |
| `npm run dev:backend` | Runs backend Express server with auto-reload |
| `npm run build` | Builds frontend distribution files |
| `npm run start:backend` | Starts backend production server |
| `npm run lint` | Lints frontend codebase using Oxlint |

---

## 📄 License

This project is licensed under the MIT License.
