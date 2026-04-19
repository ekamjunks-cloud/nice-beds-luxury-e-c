import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'

export function useAuth() {
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = await window.spark.kv.get<Record<string, { email: string; password: string; user: User }>>('users') || {}

    const userEntry = Object.values(users).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    )

    if (!userEntry) {
      return { success: false, error: 'Invalid email or password' }
    }

    if (userEntry.password !== password) {
      return { success: false, error: 'Invalid email or password' }
    }

    setCurrentUser(userEntry.user)
    return { success: true }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const users = await window.spark.kv.get<Record<string, { email: string; password: string; user: User }>>('users') || {}

    const existingUser = Object.values(users).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    )

    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' }
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      phone,
      createdAt: Date.now()
    }

    const updatedUsers = {
      ...users,
      [newUser.id]: {
        email,
        password,
        user: newUser
      }
    }

    await window.spark.kv.set('users', updatedUsers)
    setCurrentUser(newUser)

    return { success: true }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    signup,
    logout
  }
}
