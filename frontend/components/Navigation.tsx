'use client'

import React from 'react'
import { 
  HomeIcon, 
  CameraIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'

export function Navigation() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">Cali</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="/" icon={HomeIcon} label="Home" />
              <NavLink href="/analyze" icon={CameraIcon} label="Analyze" />
              <NavLink href="/dashboard" icon={ChartBarIcon} label="Dashboard" />
              <NavLink href="/meal-plan" icon={CalendarIcon} label="Meal Plan" />
              <NavLink href="/profile" icon={UserIcon} label="Profile" />
            </div>
            
            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-700">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 h-16">
          <MobileNavLink href="/" icon={HomeIcon} label="Home" />
          <MobileNavLink href="/analyze" icon={CameraIcon} label="Analyze" />
          <MobileNavLink href="/dashboard" icon={ChartBarIcon} label="Dashboard" />
          <MobileNavLink href="/meal-plan" icon={CalendarIcon} label="Plan" />
          <MobileNavLink href="/profile" icon={UserIcon} label="Profile" />
        </div>
      </div>
    </nav>
  )
}

function NavLink({ 
  href, 
  icon: Icon, 
  label 
}: { 
  href: string, 
  icon: React.ComponentType<{ className?: string }>, 
  label: string 
}) {
  return (
    <a
      href={href}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </a>
  )
}

function MobileNavLink({ 
  href, 
  icon: Icon, 
  label 
}: { 
  href: string, 
  icon: React.ComponentType<{ className?: string }>, 
  label: string 
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center space-y-1 text-xs font-medium text-gray-600 hover:text-primary-600 transition-colors"
    >
      <Icon className="h-6 w-6" />
      <span>{label}</span>
    </a>
  )
}