// User types
export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Date
  updatedAt: Date
  preferences?: UserPreferences
}

export interface UserPreferences {
  calorieGoal: number
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active'
  dietaryRestrictions: string[]
  allergies: string[]
  weight?: number
  height?: number
  age?: number
  gender?: 'male' | 'female' | 'other'
}

// Meal types
export interface Meal {
  id: string
  userId: string
  name: string
  imageUrl?: string
  foods: FoodItem[]
  totalCalories: number
  totalNutrients: NutrientInfo
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  createdAt: Date
  updatedAt: Date
}

export interface FoodItem {
  id: string
  name: string
  quantity: number
  unit: string
  calories: number
  nutrients: NutrientInfo
  confidence?: number
  recognized?: boolean
}

export interface NutrientInfo {
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
  calcium?: number
  iron?: number
  vitaminC?: number
  vitaminA?: number
}

// API Response types
export interface FoodRecognitionResponse {
  foods: DetectedFood[]
  confidence: number
  imageAnalysis?: {
    quality: number
    brightness: number
    sharpness: number
  }
}

export interface DetectedFood {
  name: string
  confidence: number
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
  quantity?: {
    estimated: number
    unit: string
  }
}

export interface NutritionResponse {
  food: string
  nutrients: NutrientInfo
  serving: {
    quantity: number
    unit: string
  }
  source: 'USDA' | 'Edamam' | 'Custom'
}

// Meal Planning types
export interface MealPlan {
  id: string
  userId: string
  title: string
  description: string
  meals: PlannedMeal[]
  totalCalories: number
  totalNutrients: NutrientInfo
  duration: number // days
  createdAt: Date
}

export interface PlannedMeal {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  day: number
  foods: FoodItem[]
  recipe?: Recipe
}

export interface Recipe {
  id: string
  name: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

// Analytics types
export interface DailyStats {
  date: Date
  totalCalories: number
  totalNutrients: NutrientInfo
  mealsCount: number
  calorieGoal: number
  achieved: boolean
}

export interface WeeklyStats {
  week: Date
  days: DailyStats[]
  averageCalories: number
  goalAchievement: number // percentage
}

// UI Component types
export interface LoadingState {
  isLoading: boolean
  message?: string
}

export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}

export interface CameraState {
  isActive: boolean
  hasPermission: boolean
  isCapturing: boolean
  error?: string
}

// API Error types
export interface ApiError {
  message: string
  code: string
  details?: any
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  displayName: string
}

export interface ProfileForm {
  displayName: string
  calorieGoal: number
  activityLevel: UserPreferences['activityLevel']
  dietaryRestrictions: string[]
  allergies: string[]
  weight?: number
  height?: number
  age?: number
  gender?: UserPreferences['gender']
}