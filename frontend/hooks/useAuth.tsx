'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        // Check if user is stored in localStorage for demo purposes
        const storedUser = localStorage.getItem('cali_user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Demo login - in production, use Firebase Auth
      const demoUser: User = {
        id: '1',
        email,
        displayName: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          calorieGoal: 2000,
          activityLevel: 'moderately_active',
          dietaryRestrictions: [],
          allergies: [],
        }
      }
      
      setUser(demoUser)
      localStorage.setItem('cali_user', JSON.stringify(demoUser))
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    setLoading(true)
    try {
      // Demo registration - in production, use Firebase Auth
      const newUser: User = {
        id: Date.now().toString(),
        email,
        displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          calorieGoal: 2000,
          activityLevel: 'moderately_active',
          dietaryRestrictions: [],
          allergies: [],
        }
      }
      
      setUser(newUser)
      localStorage.setItem('cali_user', JSON.stringify(newUser))
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      setUser(null)
      localStorage.removeItem('cali_user')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() }
    setUser(updatedUser)
    localStorage.setItem('cali_user', JSON.stringify(updatedUser))
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Firebase Auth implementation (for production)
/*
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth'
import { auth } from '@/services/firebase'

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date(firebaseUser.metadata.creationTime!),
          updatedAt: new Date(),
        }
        setUser(user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string, displayName: string) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
    await updateFirebaseProfile(firebaseUser, { displayName })
  }

  const logout = async () => {
    await signOut(auth)
  }

  return { user, loading, login, register, logout }
}
*/