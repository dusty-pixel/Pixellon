import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const ACCOUNTS_DB_KEY = 'pixellon_accounts_db'
const SESSION_USER_KEY = 'pixellon_user'

// Default seed account for testing
const SEED_ACCOUNT = {
  id: 'usr_84920',
  username: 'AlexRider',
  displayName: 'Alex Rider',
  email: 'alex.rider@pixellon.com',
  passwordHash: 'demo1234',
  avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
  battleStation: 'Custom PC (RTX 4080) & Steam Deck',
  role: 'Vanguard Elite',
  headline: 'Tactical Shooter Specialist & Community Contributor',
  bio: 'Building squad strategy guides and tracking rare drop keys across Steam.',
  location: 'Tokyo, Japan',
  level: 42,
  steamId: '76561197960287930',
  discordTag: 'AlexRider#0001',
  joinedDate: '2024-03-15',
}

function getStoredAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_DB_KEY)
    if (!raw) {
      const initial = [SEED_ACCOUNT]
      localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(initial))
      return initial
    }
    const accounts = JSON.parse(raw)
    if (!Array.isArray(accounts) || accounts.length === 0) {
      localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify([SEED_ACCOUNT]))
      return [SEED_ACCOUNT]
    }
    return accounts
  } catch (e) {
    return [SEED_ACCOUNT]
  }
}

function saveStoredAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accounts))
  } catch (e) {
    console.error('Failed to save accounts database:', e)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(SESSION_USER_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return null
      }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)

  // Sync session across browser tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === SESSION_USER_KEY) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null)
        } catch (err) {
          setUser(null)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    const normalizedEmail = (email || '').trim().toLowerCase()

    try {
      // 1. Try Backend API if configured
      const apiUrl = import.meta.env.VITE_API_URL
      if (apiUrl) {
        try {
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: normalizedEmail, password }),
          })
          if (res.ok) {
            const data = await res.json()
            const userData = data.user || data
            setUser(userData)
            localStorage.setItem(SESSION_USER_KEY, JSON.stringify(userData))
            if (data.token) localStorage.setItem('pixellon_token', data.token)
            setIsLoading(false)
            return userData
          }
        } catch (netErr) {
          console.warn('Backend API unreachable, falling back to local credentials store:', netErr)
        }
      }

      // 2. Local Account Verification
      await new Promise((r) => setTimeout(r, 450))
      const accounts = getStoredAccounts()
      const found = accounts.find(
        (acc) => acc.email.toLowerCase() === normalizedEmail
      )

      if (!found) {
        throw new Error('No account registered with this email. Please click "Create Account".')
      }

      if (found.passwordHash && found.passwordHash !== password) {
        throw new Error('Incorrect password. Please verify your password.')
      }

      const { passwordHash, ...safeUserData } = found
      setUser(safeUserData)
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(safeUserData))
      setIsLoading(false)
      return safeUserData
    } catch (err) {
      setIsLoading(false)
      throw err
    }
  }

  const signup = async (username, email, password) => {
    setIsLoading(true)
    const normalizedEmail = (email || '').trim().toLowerCase()
    const trimmedUsername = (username || '').trim()

    try {
      // 1. Try Backend API if configured
      const apiUrl = import.meta.env.VITE_API_URL
      if (apiUrl) {
        try {
          const res = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: trimmedUsername, email: normalizedEmail, password }),
          })
          if (res.ok) {
            const data = await res.json()
            const userData = data.user || data
            setUser(userData)
            localStorage.setItem(SESSION_USER_KEY, JSON.stringify(userData))
            if (data.token) localStorage.setItem('pixellon_token', data.token)
            setIsLoading(false)
            return userData
          }
        } catch (netErr) {
          console.warn('Backend API unreachable, falling back to local database:', netErr)
        }
      }

      // 2. Local Registration
      await new Promise((r) => setTimeout(r, 500))
      const accounts = getStoredAccounts()

      // Check duplicate email
      const emailExists = accounts.some(
        (acc) => acc.email.toLowerCase() === normalizedEmail
      )
      if (emailExists) {
        throw new Error('An account with this email address already exists.')
      }

      // Check duplicate username
      const usernameExists = accounts.some(
        (acc) => acc.username.toLowerCase() === trimmedUsername.toLowerCase()
      )
      if (usernameExists) {
        throw new Error('This username is already taken. Please choose another.')
      }

      const newAccount = {
        id: `usr_${Math.floor(10000 + Math.random() * 90000)}`,
        username: trimmedUsername,
        displayName: trimmedUsername,
        email: normalizedEmail,
        passwordHash: password,
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(trimmedUsername)}`,
        battleStation: 'Custom Gaming Rig',
        role: 'Rookie Vanguard',
        headline: `Pixellon Gamer • #${trimmedUsername}`,
        bio: 'New player exploring the Pixellon community codex and live game drops.',
        location: 'Global',
        level: 1,
        steamId: '',
        discordTag: '',
        joinedDate: new Date().toISOString().split('T')[0],
      }

      accounts.push(newAccount)
      saveStoredAccounts(accounts)

      const { passwordHash, ...safeUserData } = newAccount
      setUser(safeUserData)
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(safeUserData))
      setIsLoading(false)
      return safeUserData
    } catch (err) {
      setIsLoading(false)
      throw err
    }
  }

  const updateProfile = (fields) => {
    if (!user) return
    const updated = { ...user, ...fields }
    setUser(updated)
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(updated))

    const accounts = getStoredAccounts()
    const index = accounts.findIndex((acc) => acc.id === user.id || acc.email === user.email)
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...fields }
      saveStoredAccounts(accounts)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_USER_KEY)
    localStorage.removeItem('pixellon_token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
