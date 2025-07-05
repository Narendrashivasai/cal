const express = require('express')
const axios = require('axios')
const { logger } = require('../utils/logger')

const router = express.Router()

// USDA FoodData Central API
const USDA_API_KEY = process.env.USDA_API_KEY
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1'

// Edamam Nutrition API
const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/nutrition-data/v2'

// Get nutrition data for a specific food item
router.post('/', async (req, res) => {
  try {
    const { food, quantity, unit } = req.body
    
    if (!food || !quantity || !unit) {
      return res.status(400).json({ error: 'Food, quantity, and unit are required' })
    }
    
    // Try USDA API first
    if (USDA_API_KEY) {
      try {
        const usdaResult = await getNutritionFromUSDA(food, quantity, unit)
        return res.json(usdaResult)
      } catch (error) {
        logger.warn('USDA API failed, trying Edamam:', error.message)
      }
    }
    
    // Try Edamam API as fallback
    if (EDAMAM_APP_ID && EDAMAM_APP_KEY) {
      try {
        const edamamResult = await getNutritionFromEdamam(food, quantity, unit)
        return res.json(edamamResult)
      } catch (error) {
        logger.warn('Edamam API failed, using mock data:', error.message)
      }
    }
    
    // Return mock data if no API is available
    const mockResult = getMockNutritionData(food, quantity, unit)
    res.json(mockResult)
  } catch (error) {
    logger.error('Nutrition API error:', error)
    res.status(500).json({ error: 'Failed to get nutrition data' })
  }
})

// Search for foods
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' })
    }
    
    if (USDA_API_KEY) {
      try {
        const response = await axios.get(`${USDA_BASE_URL}/foods/search`, {
          params: {
            api_key: USDA_API_KEY,
            query: query,
            pageSize: limit,
            dataType: 'Branded,Foundation,Survey'
          }
        })
        
        const foods = response.data.foods.map(food => ({
          id: food.fdcId,
          name: food.description,
          brand: food.brandOwner,
          category: food.foodCategory
        }))
        
        return res.json({ foods })
      } catch (error) {
        logger.warn('USDA search failed:', error.message)
      }
    }
    
    // Return mock search results
    const mockResults = getMockSearchResults(query)
    res.json({ foods: mockResults })
  } catch (error) {
    logger.error('Nutrition search error:', error)
    res.status(500).json({ error: 'Failed to search foods' })
  }
})

// Get detailed nutrition info by food ID
router.get('/:foodId', async (req, res) => {
  try {
    const { foodId } = req.params
    
    if (USDA_API_KEY) {
      try {
        const response = await axios.get(`${USDA_BASE_URL}/food/${foodId}`, {
          params: {
            api_key: USDA_API_KEY
          }
        })
        
        const food = response.data
        const nutritionData = parseUSDANutritionData(food)
        
        return res.json(nutritionData)
      } catch (error) {
        logger.warn('USDA detail fetch failed:', error.message)
      }
    }
    
    // Return mock data
    const mockData = getMockNutritionData('Unknown Food', 100, 'g')
    res.json(mockData)
  } catch (error) {
    logger.error('Nutrition detail error:', error)
    res.status(500).json({ error: 'Failed to get food details' })
  }
})

// Get nutrition from USDA API
async function getNutritionFromUSDA(food, quantity, unit) {
  const searchResponse = await axios.get(`${USDA_BASE_URL}/foods/search`, {
    params: {
      api_key: USDA_API_KEY,
      query: food,
      pageSize: 1,
      dataType: 'Foundation,Survey'
    }
  })
  
  if (searchResponse.data.foods.length === 0) {
    throw new Error('Food not found in USDA database')
  }
  
  const foodId = searchResponse.data.foods[0].fdcId
  const detailResponse = await axios.get(`${USDA_BASE_URL}/food/${foodId}`, {
    params: {
      api_key: USDA_API_KEY
    }
  })
  
  const nutritionData = parseUSDANutritionData(detailResponse.data)
  
  // Adjust for quantity
  const multiplier = calculateMultiplier(quantity, unit)
  const adjustedNutrients = adjustNutrients(nutritionData.nutrients, multiplier)
  
  return {
    food: food,
    nutrients: adjustedNutrients,
    serving: { quantity, unit },
    source: 'USDA'
  }
}

// Get nutrition from Edamam API
async function getNutritionFromEdamam(food, quantity, unit) {
  const ingredient = `${quantity} ${unit} ${food}`
  
  const response = await axios.get(EDAMAM_BASE_URL, {
    params: {
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
      ingr: ingredient
    }
  })
  
  const data = response.data
  
  return {
    food: food,
    nutrients: {
      protein: Math.round(data.totalNutrients.PROCNT?.quantity || 0),
      carbs: Math.round(data.totalNutrients.CHOCDF?.quantity || 0),
      fat: Math.round(data.totalNutrients.FAT?.quantity || 0),
      fiber: Math.round(data.totalNutrients.FIBTG?.quantity || 0),
      sugar: Math.round(data.totalNutrients.SUGAR?.quantity || 0),
      sodium: Math.round(data.totalNutrients.NA?.quantity || 0)
    },
    serving: { quantity, unit },
    source: 'Edamam'
  }
}

// Parse USDA nutrition data
function parseUSDANutritionData(food) {
  const nutrients = {}
  
  if (food.foodNutrients) {
    food.foodNutrients.forEach(nutrient => {
      const name = nutrient.nutrient.name.toLowerCase()
      const value = nutrient.amount || 0
      
      if (name.includes('protein')) {
        nutrients.protein = Math.round(value)
      } else if (name.includes('carbohydrate')) {
        nutrients.carbs = Math.round(value)
      } else if (name.includes('total lipid') || name.includes('fat')) {
        nutrients.fat = Math.round(value)
      } else if (name.includes('fiber')) {
        nutrients.fiber = Math.round(value)
      } else if (name.includes('sugar')) {
        nutrients.sugar = Math.round(value)
      } else if (name.includes('sodium')) {
        nutrients.sodium = Math.round(value)
      }
    })
  }
  
  return {
    name: food.description,
    nutrients: nutrients
  }
}

// Calculate multiplier for quantity adjustment
function calculateMultiplier(quantity, unit) {
  const baseUnit = 'g'
  const baseQuantity = 100
  
  let multiplier = quantity / baseQuantity
  
  // Unit conversions
  switch (unit.toLowerCase()) {
    case 'oz':
      multiplier = (quantity * 28.35) / baseQuantity
      break
    case 'lb':
      multiplier = (quantity * 453.592) / baseQuantity
      break
    case 'kg':
      multiplier = (quantity * 1000) / baseQuantity
      break
    case 'cup':
      multiplier = (quantity * 240) / baseQuantity // approximate
      break
    case 'tbsp':
      multiplier = (quantity * 15) / baseQuantity
      break
    case 'tsp':
      multiplier = (quantity * 5) / baseQuantity
      break
    default:
      // Assume grams
      break
  }
  
  return multiplier
}

// Adjust nutrients based on multiplier
function adjustNutrients(nutrients, multiplier) {
  const adjusted = {}
  
  Object.keys(nutrients).forEach(key => {
    adjusted[key] = Math.round(nutrients[key] * multiplier)
  })
  
  return adjusted
}

// Get mock nutrition data
function getMockNutritionData(food, quantity, unit) {
  const baseFoods = {
    'chicken': { protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
    'beef': { protein: 26, carbs: 0, fat: 17, fiber: 0, sugar: 0, sodium: 72 },
    'fish': { protein: 22, carbs: 0, fat: 6, fiber: 0, sugar: 0, sodium: 59 },
    'rice': { protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1 },
    'bread': { protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5, sodium: 491 },
    'apple': { protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1 },
    'banana': { protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1 },
    'broccoli': { protein: 2.8, carbs: 6, fat: 0.4, fiber: 2.6, sugar: 1.5, sodium: 33 }
  }
  
  const lowerFood = food.toLowerCase()
  let baseNutrients = baseFoods['chicken'] // default
  
  for (const [key, nutrients] of Object.entries(baseFoods)) {
    if (lowerFood.includes(key)) {
      baseNutrients = nutrients
      break
    }
  }
  
  const multiplier = calculateMultiplier(quantity, unit)
  const adjustedNutrients = adjustNutrients(baseNutrients, multiplier)
  
  return {
    food: food,
    nutrients: adjustedNutrients,
    serving: { quantity, unit },
    source: 'Mock'
  }
}

// Get mock search results
function getMockSearchResults(query) {
  const mockFoods = [
    { id: 1, name: 'Chicken Breast', brand: 'Generic', category: 'Poultry' },
    { id: 2, name: 'Brown Rice', brand: 'Generic', category: 'Grains' },
    { id: 3, name: 'Broccoli', brand: 'Generic', category: 'Vegetables' },
    { id: 4, name: 'Salmon Fillet', brand: 'Generic', category: 'Fish' },
    { id: 5, name: 'Apple', brand: 'Generic', category: 'Fruits' }
  ]
  
  return mockFoods.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  )
}

module.exports = router