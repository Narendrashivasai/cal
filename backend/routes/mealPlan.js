const express = require('express')
const { logger } = require('../utils/logger')

const router = express.Router()

// Get meal plans for user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id
    
    // Demo data - in production, fetch from database
    const mealPlans = [
      {
        id: '1',
        userId: userId,
        title: 'Healthy Week Plan',
        description: 'Balanced meals for a healthy week',
        duration: 7,
        totalCalories: 14000,
        createdAt: new Date().toISOString()
      }
    ]
    
    res.json({ mealPlans })
  } catch (error) {
    logger.error('Get meal plans error:', error)
    res.status(500).json({ error: 'Failed to get meal plans' })
  }
})

// Generate meal plan using AI
router.post('/generate', async (req, res) => {
  try {
    const userId = req.user.id
    const { preferences, duration = 7 } = req.body
    
    // In production, call OpenAI API for meal plan generation
    const generatedPlan = {
      id: Date.now().toString(),
      userId: userId,
      title: 'AI Generated Meal Plan',
      description: 'Personalized meal plan based on your preferences',
      duration: duration,
      meals: generateMockMealPlan(duration),
      totalCalories: duration * 2000,
      createdAt: new Date().toISOString()
    }
    
    logger.info('Meal plan generated:', generatedPlan)
    
    res.json({ mealPlan: generatedPlan })
  } catch (error) {
    logger.error('Generate meal plan error:', error)
    res.status(500).json({ error: 'Failed to generate meal plan' })
  }
})

function generateMockMealPlan(duration) {
  const meals = []
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']
  
  for (let day = 1; day <= duration; day++) {
    mealTypes.forEach(mealType => {
      meals.push({
        mealType: mealType,
        day: day,
        foods: [
          { name: `${mealType} food`, calories: 300, protein: 20, carbs: 30, fat: 10 }
        ]
      })
    })
  }
  
  return meals
}

module.exports = router