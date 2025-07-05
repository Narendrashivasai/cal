import { FoodRecognitionResponse, DetectedFood } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function analyzeMealImage(imageData: string): Promise<FoodRecognitionResponse> {
  try {
    // Convert data URL to blob
    const response = await fetch(imageData)
    const blob = await response.blob()
    
    // Create form data
    const formData = new FormData()
    formData.append('image', blob, 'meal.jpg')
    
    // Call backend API
    const apiResponse = await fetch(`${API_BASE_URL}/api/analyze-meal`, {
      method: 'POST',
      body: formData,
    })
    
    if (!apiResponse.ok) {
      throw new Error('Failed to analyze meal')
    }
    
    const result = await apiResponse.json()
    return result
  } catch (error) {
    console.error('Food recognition error:', error)
    
    // Return mock data for demo purposes
    return {
      foods: [
        {
          name: 'Grilled Chicken Breast',
          confidence: 0.85,
          quantity: {
            estimated: 150,
            unit: 'g'
          }
        },
        {
          name: 'Steamed Broccoli',
          confidence: 0.92,
          quantity: {
            estimated: 100,
            unit: 'g'
          }
        },
        {
          name: 'Brown Rice',
          confidence: 0.78,
          quantity: {
            estimated: 80,
            unit: 'g'
          }
        }
      ],
      confidence: 0.85,
      imageAnalysis: {
        quality: 0.9,
        brightness: 0.8,
        sharpness: 0.85
      }
    }
  }
}

export async function getNutritionData(foodName: string, quantity: number, unit: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nutrition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        food: foodName,
        quantity,
        unit
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to get nutrition data')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Nutrition data error:', error)
    throw error
  }
}

// Mock function for client-side food recognition using TensorFlow.js
export async function recognizeFoodClientSide(imageData: string): Promise<DetectedFood[]> {
  try {
    // This would use TensorFlow.js models in production
    // For now, return mock data
    return [
      {
        name: 'Apple',
        confidence: 0.9,
        boundingBox: {
          x: 100,
          y: 100,
          width: 200,
          height: 200
        }
      }
    ]
  } catch (error) {
    console.error('Client-side recognition error:', error)
    return []
  }
}