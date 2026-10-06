import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { Send, ShieldAlert } from 'lucide-react'

// Simple profanity list for demo
const BAD_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 
  'cunt', 'bastard', 'slut', 'whore', 'nigger', 'faggot'
]

// Fake active users to simulate a live lobby
const FAKE_USERS = ['Nova', 'Rook', 'Byte', 'Pixel', 'Volt', 'Echo', 'Neon_Fox', 'CyberSamurai']
const FAKE_MESSAGES = [
  "Anyone up for a raid later?",
  "Did you guys see the new trailer?",
  "This lobby is so chill.",
  "LFG Need 1 more for ranked.",
  "What's the meta right now?",
  "Just unlocked the legendary skin!!",
  "GGs that was a close match",
  "Is the server lagging for anyone else?"
]

export default function LobbyChat() {
  const { user } = useAuth()
  
  // Local state for chat
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isBlocked, setIsBlocked] = useState(false)
  const chatEndRef = useRef(null)

  // Load blocked status on mount
  useEffect(() => {
    const blocked = localStorage.getItem('nexus_chat_blocked')
    if (blocked === 'true') {
      setIsBlocked(true)
    }

    // Initial greeting
    setMessages([
      { id: 1, type: 'system', text: 'Welcome to the Lobby Chat!' },
      { id: 2, type: 'system', text: 'Please follow all community guidelines.' }
    ])
  }, [])

  // Auto-scroll removed as requested

  // Simulate incoming live messages
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to drop a fake message every 4 seconds
      if (Math.random() > 0.7) {
        const randomUser = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)]
        const randomMsg = FAKE_MESSAGES[Math.floor(Math.random() * FAKE_MESSAGES.length)]
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'user',
          user: randomUser,
          text: randomMsg
        }])
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const checkProfanity = (text) => {
    const lower = text.toLowerCase()
    return BAD_WORDS.some(word => lower.includes(word))
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isBlocked || !user) return

    if (checkProfanity(inputValue)) {
      setIsBlocked(true)
      localStorage.setItem('nexus_chat_blocked', 'true')
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        text: 'You have been permanently blocked from chat for violating community guidelines.'
      }])
      setInputValue('')
      return
    }

    // Send valid message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      user: user.username || 'Player',
      text: inputValue.trim(),
      isMe: true
    }])
    setInputValue('')
  }

  return (
    <div className="flex flex-col h-[400px] lg:h-full rounded-2xl border border-surface-700 bg-surface-900 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-surface-700 bg-brand-surface px-4 py-3 font-pixel text-[10px] tracking-widest sm:px-4 shrink-0">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-brand-text font-bold">LIVE CHAT</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className="text-xs sm:text-sm font-sans">
            {msg.type === 'system' ? (
              <div className="text-brand-muted italic flex items-start gap-1.5 bg-surface-800/50 p-2 rounded-lg border border-surface-700">
                <ShieldAlert className="h-4 w-4 text-brand-accent2 shrink-0 mt-0.5" />
                <span>{msg.text}</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className={`font-bold ${msg.isMe ? 'text-brand-primary' : 'text-stone-300'}`}>
                  {msg.user}
                </span>
                <span className="text-brand-text break-words mt-0.5 leading-relaxed bg-surface-800 p-2 rounded-lg rounded-tl-none border border-surface-700 inline-block w-fit max-w-[90%]">
                  {msg.text}
                </span>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-brand-surface border-t border-surface-700 shrink-0">
        {!user ? (
          <div className="text-center py-2">
            <p className="text-xs text-brand-muted mb-2">You must be logged in to chat.</p>
            <Link to="/auth" className="inline-block bg-brand-primary/20 text-brand-accent px-4 py-1.5 rounded-lg text-xs font-bold border border-brand-primary/40 hover:bg-brand-primary hover:text-white transition-colors">
              Login / Sign Up
            </Link>
          </div>
        ) : isBlocked ? (
          <div className="bg-red-950/40 border border-red-900/50 rounded-lg p-2.5 text-center flex flex-col items-center gap-1">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <p className="text-xs text-red-400 font-medium">Chat privileges revoked.</p>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-brand-text placeholder-surface-500 focus:outline-none focus:border-brand-primary/50 transition-colors"
              maxLength={150}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-brand-primary text-white rounded-lg px-3 py-2 hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
