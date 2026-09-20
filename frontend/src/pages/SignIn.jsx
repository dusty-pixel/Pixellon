import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { PixellonLogo } from '../components/PixellonLogo'
import { PixelPatternBg } from '../components/BrandDecorations'
import { useAuth } from '../context/AuthContext'

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { login, signup, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.from || '/profile'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    if (isSignUp) {
      if (!username) {
        setErrorMessage('Please provide a gamer username.')
        return
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.')
        return
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.')
        return
      }

      try {
        await signup(username, email, password)
        setSuccessMessage('Account created! Entering Pixellon...')
        setTimeout(() => navigate(returnTo), 600)
      } catch (err) {
        setErrorMessage(err.message || 'Failed to create account. Please try again.')
      }
    } else {
      try {
        await login(email, password)
        setSuccessMessage('Welcome back, Player!')
        setTimeout(() => navigate(returnTo), 600)
      } catch (err) {
        setErrorMessage(err.message || 'Invalid credentials. Please verify your email/password.')
      }
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* ── LEFT COLUMN: Brand Showcase (5 cols) ────── */}
          <div className="lg:col-span-5 flex flex-col justify-center rounded-2xl border border-surface-700 bg-brand-surface p-7 sm:p-9 relative overflow-hidden shadow-xl">
            <PixelPatternBg />

            <div className="relative z-10 space-y-6">
              {/* Logo & Headline */}
              <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
                <PixellonLogo size="md" />
              </Link>

              <div className="space-y-3">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-text leading-tight">
                  Your Command Center for Modern Gaming
                </h1>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Join thousands of players tracking free game drops, tournament feeds, verified steam cards, and community codex guides.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Authentication Form (7 cols) ─────────── */}
          <div className="lg:col-span-7 rounded-2xl border border-surface-700 bg-brand-surface p-7 sm:p-9 shadow-xl">
            <div className="space-y-6">
              {/* Top Mode Selector Tabs */}
              <div className="flex items-center rounded-lg bg-surface-900 p-1 border border-surface-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false)
                    setErrorMessage('')
                    setSuccessMessage('')
                  }}
                  className={`flex-1 rounded-lg py-2 text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                    !isSignUp
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'text-brand-muted hover:text-brand-text'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true)
                    setErrorMessage('')
                    setSuccessMessage('')
                  }}
                  className={`flex-1 rounded-lg py-2 text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                    isSignUp
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'text-brand-muted hover:text-brand-text'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form Heading */}
              <div>
                <h2 className="font-display text-2xl font-bold text-brand-text">
                  {isSignUp ? 'Create Your Gamer Account' : 'Sign in to Pixellon'}
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  {isSignUp
                    ? 'Start building your squad reputation and game collection.'
                    : 'Access your saved drops, codex notes, and squad network.'}
                </p>
              </div>

              {/* Error & Success Feedback Alerts */}
              <AnimatePresence mode="wait">
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/30 p-3 text-xs font-mono text-red-400"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-brand-primary/15 p-3 text-xs font-mono text-brand-accent"
                  >
                    <Check className="h-4 w-4 shrink-0 text-brand-accent" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Form */}
              <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-mono font-semibold text-brand-text mb-1">
                      GAMER USERNAME
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. ShadowViper_99"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        name="pixellon_username_field"
                        className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2.5 pl-9 pr-3 text-xs font-mono text-brand-text placeholder:text-brand-muted/60 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono font-semibold text-brand-text mb-1">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="player@pixellon.com"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      name="pixellon_email_field"
                      className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2.5 pl-9 pr-3 text-xs font-mono text-brand-text placeholder:text-brand-muted/60 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono font-semibold text-brand-text">
                      PASSWORD
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to demo registered email.')}
                        className="text-[11px] font-mono text-brand-accent hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      name="pixellon_password_field"
                      className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2.5 pl-9 pr-10 text-xs font-mono text-brand-text placeholder:text-brand-muted/60 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-xs font-mono font-semibold text-brand-text mb-1">
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        name="pixellon_confirm_password_field"
                        className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2.5 pl-9 pr-3 text-xs font-mono text-brand-text placeholder:text-brand-muted/60 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Remember me & agreement checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-mono text-brand-muted cursor-pointer select-none">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={rememberMe}
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors cursor-pointer ${
                        rememberMe
                          ? 'border-brand-primary bg-brand-primary text-white'
                          : 'border-surface-600 bg-surface-900'
                      }`}
                    >
                      {rememberMe && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                    <span>Remember this device</span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#0274B3] transition-all duration-150 active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Gamer Account' : 'Sign In to Pixellon'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
