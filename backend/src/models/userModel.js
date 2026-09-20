import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
    },
    displayName: {
      type: String,
      default: function () {
        return this.username
      },
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    avatar: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(this.username || 'Gamer')}`
      },
    },
    role: {
      type: String,
      default: 'Vanguard Member',
    },
    level: {
      type: Number,
      default: 1,
    },
    headline: {
      type: String,
      default: 'Pixellon Gamer',
    },
    bio: {
      type: String,
      default: 'Gamer on Pixellon platform.',
    },
    location: {
      type: String,
      default: 'Global',
    },
    battleStation: {
      type: String,
      default: 'Custom Gaming Rig',
    },
    openToPlay: {
      type: Boolean,
      default: true,
    },
    steamId: {
      type: String,
      default: '',
    },
    discordTag: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export const User = mongoose.models.User || mongoose.model('User', userSchema)
