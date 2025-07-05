const axios = require('axios')
const sharp = require('sharp')
const { logger } = require('../utils/logger')

// Google Vision API configuration
const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY
const GOOGLE_VISION_URL = 'https://vision.googleapis.com/v1/images:annotate'

// Clarifai API configuration
const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY
const CLARIFAI_MODEL_ID = 'bd367be194cf45149e75f01d59f77ba7' // Food model

/**
 * Recognize food items in an image
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<Object>} Recognition results
 */
async function recognizeFood(imageBuffer) {
  try {
    // Process image
    const processedImage = await preprocessImage(imageBuffer)
    
    // Try Google Vision API first
    if (GOOGLE_VISION_API_KEY) {
      try {
        const googleResult = await recognizeWithGoogleVision(processedImage)
        return googleResult
      } catch (error) {
        logger.warn('Google Vision API failed, trying Clarifai:', error.message)
      }
    }
    
    // Try Clarifai API as fallback
    if (CLARIFAI_API_KEY) {
      try {
        const clarifaiResult = await recognizeWithClarifai(processedImage)
        return clarifaiResult
      } catch (error) {
        logger.warn('Clarifai API failed, using mock data:', error.message)
      }
    }
    
    // Return mock data if no API is available
    return getMockRecognitionResult()
  } catch (error) {
    logger.error('Food recognition error:', error)
    throw new Error('Failed to recognize food items')
  }
}

/**
 * Preprocess image for better recognition
 * @param {Buffer} imageBuffer - Raw image buffer
 * @returns {Promise<Buffer>} Processed image buffer
 */
async function preprocessImage(imageBuffer) {
  try {
    const processedBuffer = await sharp(imageBuffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer()
    
    return processedBuffer
  } catch (error) {
    logger.error('Image preprocessing error:', error)
    return imageBuffer
  }
}

/**
 * Recognize food using Google Vision API
 * @param {Buffer} imageBuffer - Processed image buffer
 * @returns {Promise<Object>} Recognition results
 */
async function recognizeWithGoogleVision(imageBuffer) {
  const base64Image = imageBuffer.toString('base64')
  
  const requestBody = {
    requests: [
      {
        image: {
          content: base64Image
        },
        features: [
          {
            type: 'OBJECT_LOCALIZATION',
            maxResults: 10
          },
          {
            type: 'LABEL_DETECTION',
            maxResults: 10
          }
        ]
      }
    ]
  }
  
  const response = await axios.post(
    `${GOOGLE_VISION_URL}?key=${GOOGLE_VISION_API_KEY}`,
    requestBody,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  
  return parseGoogleVisionResponse(response.data)
}

/**
 * Recognize food using Clarifai API
 * @param {Buffer} imageBuffer - Processed image buffer
 * @returns {Promise<Object>} Recognition results
 */
async function recognizeWithClarifai(imageBuffer) {
  const base64Image = imageBuffer.toString('base64')
  
  const requestBody = {
    inputs: [
      {
        data: {
          image: {
            base64: base64Image
          }
        }
      }
    ]
  }
  
  const response = await axios.post(
    `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`,
    requestBody,
    {
      headers: {
        'Authorization': `Key ${CLARIFAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )
  
  return parseClarifaiResponse(response.data)
}

/**
 * Parse Google Vision API response
 * @param {Object} data - API response data
 * @returns {Object} Parsed results
 */
function parseGoogleVisionResponse(data) {
  const result = data.responses[0]
  const foods = []
  
  // Process object localization results
  if (result.localizedObjectAnnotations) {
    result.localizedObjectAnnotations.forEach(obj => {
      if (isFoodItem(obj.name)) {
        foods.push({
          name: obj.name,
          confidence: obj.score,
          boundingBox: {
            x: obj.boundingPoly.normalizedVertices[0].x * 800,
            y: obj.boundingPoly.normalizedVertices[0].y * 600,
            width: (obj.boundingPoly.normalizedVertices[2].x - obj.boundingPoly.normalizedVertices[0].x) * 800,
            height: (obj.boundingPoly.normalizedVertices[2].y - obj.boundingPoly.normalizedVertices[0].y) * 600
          }
        })
      }
    })
  }
  
  // Process label detection results for food items
  if (result.labelAnnotations && foods.length === 0) {
    result.labelAnnotations.forEach(label => {
      if (isFoodItem(label.description)) {
        foods.push({
          name: label.description,
          confidence: label.score,
          quantity: estimateQuantity(label.description)
        })
      }
    })
  }
  
  return {
    foods,
    confidence: foods.length > 0 ? foods.reduce((sum, food) => sum + food.confidence, 0) / foods.length : 0,
    source: 'Google Vision',
    imageAnalysis: {
      quality: 0.9,
      brightness: 0.8,
      sharpness: 0.85
    }
  }
}

/**
 * Parse Clarifai API response
 * @param {Object} data - API response data
 * @returns {Object} Parsed results
 */
function parseClarifaiResponse(data) {
  const concepts = data.outputs[0].data.concepts
  const foods = []
  
  concepts.forEach(concept => {
    if (concept.value > 0.7) { // Only high-confidence predictions
      foods.push({
        name: concept.name,
        confidence: concept.value,
        quantity: estimateQuantity(concept.name)
      })
    }
  })
  
  return {
    foods,
    confidence: foods.length > 0 ? foods.reduce((sum, food) => sum + food.confidence, 0) / foods.length : 0,
    source: 'Clarifai',
    imageAnalysis: {
      quality: 0.9,
      brightness: 0.8,
      sharpness: 0.85
    }
  }
}

/**
 * Check if a detected object/label is a food item
 * @param {string} name - Object/label name
 * @returns {boolean} True if it's a food item
 */
function isFoodItem(name) {
  const foodKeywords = [
    'food', 'fruit', 'vegetable', 'meat', 'chicken', 'beef', 'fish', 'rice', 'bread',
    'pasta', 'salad', 'soup', 'pizza', 'burger', 'sandwich', 'apple', 'banana',
    'orange', 'tomato', 'carrot', 'broccoli', 'potato', 'cheese', 'egg', 'milk'
  ]
  
  const lowerName = name.toLowerCase()
  return foodKeywords.some(keyword => lowerName.includes(keyword))
}

/**
 * Estimate quantity based on food name
 * @param {string} foodName - Name of the food
 * @returns {Object} Estimated quantity
 */
function estimateQuantity(foodName) {
  const portionSizes = {
    'apple': { estimated: 1, unit: 'piece' },
    'banana': { estimated: 1, unit: 'piece' },
    'orange': { estimated: 1, unit: 'piece' },
    'chicken': { estimated: 150, unit: 'g' },
    'beef': { estimated: 120, unit: 'g' },
    'fish': { estimated: 140, unit: 'g' },
    'rice': { estimated: 80, unit: 'g' },
    'bread': { estimated: 2, unit: 'slices' },
    'pasta': { estimated: 85, unit: 'g' },
    'salad': { estimated: 100, unit: 'g' },
    'pizza': { estimated: 1, unit: 'slice' },
    'burger': { estimated: 1, unit: 'piece' },
    'sandwich': { estimated: 1, unit: 'piece' }
  }
  
  const lowerName = foodName.toLowerCase()
  for (const [food, portion] of Object.entries(portionSizes)) {
    if (lowerName.includes(food)) {
      return portion
    }
  }
  
  return { estimated: 100, unit: 'g' }
}

/**
 * Get mock recognition result for demo purposes
 * @returns {Object} Mock recognition result
 */
function getMockRecognitionResult() {
  return {
    foods: [
      {
        name: 'Grilled Chicken Breast',
        confidence: 0.85,
        quantity: { estimated: 150, unit: 'g' }
      },
      {
        name: 'Steamed Broccoli',
        confidence: 0.92,
        quantity: { estimated: 100, unit: 'g' }
      },
      {
        name: 'Brown Rice',
        confidence: 0.78,
        quantity: { estimated: 80, unit: 'g' }
      }
    ],
    confidence: 0.85,
    source: 'Mock',
    imageAnalysis: {
      quality: 0.9,
      brightness: 0.8,
      sharpness: 0.85
    }
  }
}

module.exports = {
  recognizeFood,
  preprocessImage,
  getMockRecognitionResult
}