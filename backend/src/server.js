import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import vaultRoutes from './routes/vaultRoutes.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'

dotenv.config()

// Connect to Database
connectDB()

const app = express()

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
  })
)
app.use(express.json())

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/vault', vaultRoutes)
app.use('/api/auth', authRoutes)

// Error Middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`[Pixellon API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})

export default app
