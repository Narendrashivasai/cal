const jwt = require('jsonwebtoken')
const { logger } = require('../utils/logger')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Token verification failed:', err.message)
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Generate JWT token
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

// Refresh JWT token
function refreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true })
    const newToken = generateToken({ 
      id: decoded.id, 
      email: decoded.email 
    })
    return newToken
  } catch (error) {
    throw new Error('Invalid token')
  }
}

module.exports = {
  authenticateToken,
  generateToken,
  refreshToken
}