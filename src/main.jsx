import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CodexProvider } from './context/CodexContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
 <StrictMode>
 <BrowserRouter>
 <CodexProvider>
 <App />
 </CodexProvider>
 </BrowserRouter>
 </StrictMode>,
)
