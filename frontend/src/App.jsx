import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ParallaxBackground from './components/ParallaxBackground'
import MascotDirector from './components/mascot/MascotDirector'
import PixelTicker from './retro/PixelTicker'
import { TickerProvider } from './retro/TickerProvider'
import CRTOverlay from './retro/CRTOverlay'
import { useEasterEggs } from './motion/easterEggs'
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
import SignIn from './pages/SignIn'

function LegacyCodexRedirect() {
 const { pathname, search, hash } = useLocation()
 return <Navigate to={`${pathname.replace(/^\/codex/, '/vault')}${search}${hash}`} replace />
}

function Shell() {
 const location = useLocation()
 const isHome = location.pathname === '/'
 const [scrolledPastHero, setScrolledPastHero] = useState(false)

 useEasterEggs()

 useEffect(() => {
  if (!isHome) {
   setScrolledPastHero(true)
   return
  }
  const onScroll = () => {
   setScrolledPastHero(window.scrollY > 480)
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
 }, [isHome])

 return (
 <div className="flex min-h-screen flex-col bg-[#070B12]">
 <ParallaxBackground />
 <CRTOverlay />
 {!isHome && <PixelTicker />}
 {(!isHome || scrolledPastHero) && <Navbar />}
 <main className="relative z-10 flex-1">
 <AnimatePresence mode="wait">
 <Routes>
 <Route path="/" element={<Home />} />
 <Route path="/indie" element={<Indie />} />
 <Route path="/reviews" element={<Reviews />} />
 <Route path="/calendar" element={<Calendar />} />
 <Route path="/deals" element={<Deals />} />
 <Route path="/gateway" element={<Gateway />} />
 <Route path="/vault" element={<CodexHub />} />
 <Route path="/vault/:gameId" element={<GameWiki />} />
 <Route path="/vault/:gameId/:pageId" element={<GameWiki />} />
 <Route path="/codex/*" element={<LegacyCodexRedirect />} />
 <Route path="/free-games" element={<FreeGames />} />
 <Route path="/news" element={<News />} />
 <Route path="/streams" element={<Streams />} />
 <Route path="/esports" element={<Esports />} />
 <Route path="/profile" element={<Profile />} />
 <Route path="/signin" element={<SignIn />} />
 <Route path="/login" element={<SignIn />} />
 <Route path="/signup" element={<SignIn />} />
 </Routes>
 </AnimatePresence>
 </main>
 <div className="relative z-10">
 <Footer />
 </div>
 <MascotDirector />
 </div>
 )
}

export default function App() {
 return (
 <TickerProvider>
 <Shell />
 </TickerProvider>
 )
}
