import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'

export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'pixellon_super_secret_jwt_key_2026_gamer'
      )

      req.user = await User.findById(decoded.id).select('-password')
      if (!req.user) {
        // Fallback for mock session
        req.user = { id: decoded.id }
      }
      next()
    } catch (error) {
      res.status(401)
      next(new Error('Not authorized, token failed'))
    }
  }

  if (!token) {
    res.status(401)
    next(new Error('Not authorized, no token provided'))
  }
}
