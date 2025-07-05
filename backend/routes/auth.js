const express = require('express')
const { generateToken } = require('../middleware/auth')
const { logger } = require('../utils/logger')

const router = express.Router()

// Demo login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    // Demo authentication - in production, verify against database
    const user = {
      id: '1',
      email: email,
      displayName: email.split('@')[0]
    }
    
    const token = generateToken(user)
    
    res.json({
      user: user,
      token: token
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Demo registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body
    
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'Email, password, and display name are required' })
    }
    
    // Demo registration - in production, save to database
    const user = {
      id: Date.now().toString(),
      email: email,
      displayName: displayName
    }
    
    const token = generateToken(user)
    
    res.json({
      user: user,
      token: token
    })
  } catch (error) {
    logger.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

module.exports = router