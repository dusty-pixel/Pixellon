import mongoose from 'mongoose'

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/pixellon'
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    })
    console.log(`[MongoDB] Connected: ${conn.connection.host}`)
  } catch (error) {
    console.warn(`[MongoDB] Database connection failed (${error.message}). Running in-memory mock mode for local dev.`)
  }
}
