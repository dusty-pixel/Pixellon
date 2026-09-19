import { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [colorMode, setColorMode] = useState(() => {
    return localStorage.getItem('pixellon_color_mode') || 'dark'
  })

  const [palette, setPalette] = useState(() => {
    return localStorage.getItem('pixellon_theme') || 'cyan'
  })

  useEffect(() => {
    // Apply color mode (dark vs light)
    document.documentElement.setAttribute('data-color-mode', colorMode)
    if (colorMode === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('pixellon_color_mode', colorMode)
  }, [colorMode])

  useEffect(() => {
    // Apply color palette (cyan, emerald, violet, inferno)
    if (palette === 'default' || palette === 'cyan') {
      document.documentElement.setAttribute('data-theme', 'cyan')
    } else {
      document.documentElement.setAttribute('data-theme', palette)
    }
    localStorage.setItem('pixellon_theme', palette)
  }, [palette])

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider
      value={{
        colorMode,
        setColorMode,
        toggleColorMode,
        isDark: colorMode === 'dark',
        palette,
        setPalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
