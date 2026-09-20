import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Pixellon Gaming Platform API',
    version: '1.0.0',
  })
})

export default router
