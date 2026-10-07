import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Indie from './pages/Indie'
import Reviews from './pages/Reviews'
import Calendar from './pages/Calendar'
import Gateway from './pages/Gateway'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/indie" element={<Indie />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/gateway" element={<Gateway />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
