import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'pixellon_super_secret_jwt_key_2026_gamer',
    {
      expiresIn: '30d',
    }
  )
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      res.status(400)
      throw new Error('Please fill in all fields (username, email, password)')
    }

    const normalizedEmail = email.toLowerCase().trim()
    const trimmedUsername = username.trim()

    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: trimmedUsername }],
    })

    if (userExists) {
      res.status(400)
      if (userExists.email === normalizedEmail) {
        throw new Error('An account with this email address already exists')
      } else {
        throw new Error('This username is already taken')
      }
    }

    // Create user
    const user = await User.create({
      username: trimmedUsername,
      displayName: trimmedUsername,
      email: normalizedEmail,
      password,
    })

    if (user) {
      res.status(201).json({
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        headline: user.headline,
        bio: user.bio,
        location: user.location,
        battleStation: user.battleStation,
        openToPlay: user.openToPlay,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data received')
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400)
      throw new Error('Please provide email and password')
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        headline: user.headline,
        bio: user.bio,
        location: user.location,
        battleStation: user.battleStation,
        openToPlay: user.openToPlay,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error('Invalid email or password')
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (user) {
      res.json(user)
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (user) {
      user.displayName = req.body.displayName || user.displayName
      user.headline = req.body.headline || user.headline
      user.bio = req.body.bio || user.bio
      user.location = req.body.location || user.location
      user.battleStation = req.body.battleStation || user.battleStation
      user.openToPlay = req.body.openToPlay ?? user.openToPlay
      user.avatar = req.body.avatar || user.avatar

      const updatedUser = await user.save()
      res.json({
        id: updatedUser._id,
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        headline: updatedUser.headline,
        bio: updatedUser.bio,
        location: updatedUser.location,
        battleStation: updatedUser.battleStation,
        openToPlay: updatedUser.openToPlay,
        token: generateToken(updatedUser._id),
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } catch (error) {
    next(error)
  }
}
