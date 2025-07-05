'use client'

import React from 'react'
import { CameraIcon, ChartBarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { CameraCapture } from '@/components/CameraCapture'
import { Navigation } from '@/components/Navigation'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/AuthModal'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-primary-600">Cali</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI-powered meal recognition and calorie tracking. Snap a photo of your meal and get instant nutritional insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard 
              icon={CameraIcon}
              title="Photo Recognition"
              description="Snap a photo and let AI identify your food items"
            />
            <FeatureCard 
              icon={ChartBarIcon}
              title="Nutrition Analysis"
              description="Get detailed calories and nutrient breakdown"
            />
            <FeatureCard 
              icon={ClockIcon}
              title="Meal Planning"
              description="AI-generated meal suggestions based on your goals"
            />
            <FeatureCard 
              icon={UserIcon}
              title="Personal Tracking"
              description="Track your progress and dietary habits"
            />
          </div>
          
          <AuthModal />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hi, {user.displayName || 'there'}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to track your next meal?
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CameraCapture />
          </div>
          
          <div className="space-y-6">
            <QuickStats />
            <RecentMeals />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ComponentType<{ className?: string }>, 
  title: string, 
  description: string 
}) {
  return (
    <div className="card text-center hover:shadow-lg transition-shadow">
      <Icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

function QuickStats() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Calories</span>
          <span className="font-medium">1,240 / 2,000</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full" style={{ width: '62%' }}></div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium text-success-600">Protein</div>
            <div>45g</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-secondary-600">Carbs</div>
            <div>150g</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-danger-600">Fat</div>
            <div>42g</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RecentMeals() {
  const meals = [
    { name: 'Breakfast', time: '8:30 AM', calories: 420 },
    { name: 'Lunch', time: '12:45 PM', calories: 680 },
    { name: 'Snack', time: '3:20 PM', calories: 140 },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Meals</h3>
      <div className="space-y-3">
        {meals.map((meal, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-900">{meal.name}</div>
              <div className="text-sm text-gray-500">{meal.time}</div>
            </div>
            <div className="font-medium text-primary-600">{meal.calories} cal</div>
          </div>
        ))}
      </div>
    </div>
  )
}