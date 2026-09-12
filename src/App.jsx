import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PixelCat from './components/PixelCat/PixelCat'
import Home from './pages/Home'
import Indie from './pages/Indie'
import Reviews from './pages/Reviews'
import Calendar from './pages/Calendar'
import Deals from './pages/Deals'
import Gateway from './pages/Gateway'
import GameWiki from './pages/GameWiki'
import CodexHub from './pages/CodexHub'
import FreeGames from './pages/FreeGames'
import News from './pages/News'
import Streams from './pages/Streams'
import Esports from './pages/Esports'
import Profile from './pages/Profile'

export default function App() {
 const location = useLocation()
 
 return (
 <div className="flex min-h-screen flex-col">
 <Navbar />
 <main className="flex-1">
 <AnimatePresence mode="wait">
 <Routes location={location} key={location.pathname}>
 <Route path="/" element={<Home />} />
 <Route path="/indie" element={<Indie />} />
 <Route path="/reviews" element={<Reviews />} />
 <Route path="/calendar" element={<Calendar />} />
 <Route path="/deals" element={<Deals />} />
 <Route path="/gateway" element={<Gateway />} />
 <Route path="/codex" element={<CodexHub />} />
 <Route path="/codex/:gameId" element={<GameWiki />} />
 <Route path="/codex/:gameId/:pageId" element={<GameWiki />} />
 <Route path="/free-games" element={<FreeGames />} />
 <Route path="/news" element={<News />} />
 <Route path="/streams" element={<Streams />} />
 <Route path="/esports" element={<Esports />} />
 <Route path="/profile" element={<Profile />} />
 </Routes>
 </AnimatePresence>
 </main>
 <Footer />
 <PixelCat />
 </div>
 )
}
