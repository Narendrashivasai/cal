const express = require('express')
const { logger } = require('../utils/logger')

const router = express.Router()

// Get user's meals
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id
    
    // Demo data - in production, fetch from database
    const meals = [
      {
        id: '1',
        userId: userId,
        name: 'Healthy Lunch',
        foods: [
          { name: 'Grilled Chicken', calories: 231, protein: 43, carbs: 0, fat: 5 },
          { name: 'Brown Rice', calories: 112, protein: 2, carbs: 23, fat: 1 },
          { name: 'Steamed Broccoli', calories: 27, protein: 3, carbs: 5, fat: 0 }
        ],
        totalCalories: 370,
        mealType: 'lunch',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: userId,
        name: 'Morning Breakfast',
        foods: [
          { name: 'Scrambled Eggs', calories: 155, protein: 11, carbs: 1, fat: 11 },
          { name: 'Whole Grain Toast', calories: 80, protein: 4, carbs: 14, fat: 1 },
          { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15 }
        ],
        totalCalories: 395,
        mealType: 'breakfast',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
    
    res.json({ meals })
  } catch (error) {
    logger.error('Get meals error:', error)
    res.status(500).json({ error: 'Failed to get meals' })
  }
})

// Create a new meal
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id
    const { name, foods, mealType } = req.body
    
    if (!name || !foods || !mealType) {
      return res.status(400).json({ error: 'Name, foods, and meal type are required' })
    }
    
    // Calculate totals
    const totalCalories = foods.reduce((sum, food) => sum + (food.calories || 0), 0)
    const totalProtein = foods.reduce((sum, food) => sum + (food.protein || 0), 0)
    const totalCarbs = foods.reduce((sum, food) => sum + (food.carbs || 0), 0)
    const totalFat = foods.reduce((sum, food) => sum + (food.fat || 0), 0)
    
    const meal = {
      id: Date.now().toString(),
      userId: userId,
      name: name,
      foods: foods,
      totalCalories: totalCalories,
      totalNutrients: {
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      },
      mealType: mealType,
      createdAt: new Date().toISOString()
    }
    
    // In production, save to database
    logger.info('Meal created:', meal)
    
    res.json({ meal })
  } catch (error) {
    logger.error('Create meal error:', error)
    res.status(500).json({ error: 'Failed to create meal' })
  }
})

// Get meal by ID
router.get('/:mealId', async (req, res) => {
  try {
    const { mealId } = req.params
    const userId = req.user.id
    
    // Demo data - in production, fetch from database
    const meal = {
      id: mealId,
      userId: userId,
      name: 'Sample Meal',
      foods: [
        { name: 'Sample Food', calories: 100, protein: 10, carbs: 15, fat: 5 }
      ],
      totalCalories: 100,
      mealType: 'lunch',
      createdAt: new Date().toISOString()
    }
    
    res.json({ meal })
  } catch (error) {
    logger.error('Get meal error:', error)
    res.status(500).json({ error: 'Failed to get meal' })
  }
})

// Update meal
router.put('/:mealId', async (req, res) => {
  try {
    const { mealId } = req.params
    const userId = req.user.id
    const updates = req.body
    
    // In production, update in database
    const updatedMeal = {
      id: mealId,
      userId: userId,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    logger.info('Meal updated:', updatedMeal)
    
    res.json({ meal: updatedMeal })
  } catch (error) {
    logger.error('Update meal error:', error)
    res.status(500).json({ error: 'Failed to update meal' })
  }
})

// Delete meal
router.delete('/:mealId', async (req, res) => {
  try {
    const { mealId } = req.params
    const userId = req.user.id
    
    // In production, delete from database
    logger.info('Meal deleted:', { mealId, userId })
    
    res.json({ message: 'Meal deleted successfully' })
  } catch (error) {
    logger.error('Delete meal error:', error)
    res.status(500).json({ error: 'Failed to delete meal' })
  }
})

module.exports = router