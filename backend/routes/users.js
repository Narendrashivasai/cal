const express = require('express')
const { logger } = require('../utils/logger')

const router = express.Router()

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id
    
    // Demo data - in production, fetch from database
    const user = {
      id: userId,
      email: req.user.email,
      displayName: req.user.displayName || 'User',
      preferences: {
        calorieGoal: 2000,
        activityLevel: 'moderately_active',
        dietaryRestrictions: [],
        allergies: []
      },
      createdAt: new Date().toISOString()
    }
    
    res.json({ user })
  } catch (error) {
    logger.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id
    const updates = req.body
    
    // In production, update in database
    const updatedUser = {
      id: userId,
      email: req.user.email,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    logger.info('Profile updated:', updatedUser)
    
    res.json({ user: updatedUser })
  } catch (error) {
    logger.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

module.exports = router