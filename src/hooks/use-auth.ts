import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, CartItem, WishlistItem } from '@/lib/types'

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('spark-session-id')
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('spark-session-id', sessionId)
  }
  return sessionId
}

async function migrateAnonymousData(userId: string) {
  const sessionId = getSessionId()
  
  const anonymousCartKey = `cart-${sessionId}`
  const anonymousWishlistKey = `wishlist-${sessionId}`
  const userCartKey = `cart-user-${userId}`
  const userWishlistKey = `wishlist-user-${userId}`
  
  const anonymousCart = await window.spark.kv.get<CartItem[]>(anonymousCartKey)
  const anonymousWishlist = await window.spark.kv.get<WishlistItem[]>(anonymousWishlistKey)
  
  if (anonymousCart && anonymousCart.length > 0) {
    const userCart = await window.spark.kv.get<CartItem[]>(userCartKey) || []
    const mergedCart = [...userCart]
    
    for (const anonItem of anonymousCart) {
      const existingIndex = mergedCart.findIndex(
        item => 
          item.product.id === anonItem.product.id && 
          item.selectedColor === anonItem.selectedColor &&
          JSON.stringify(item.customization) === JSON.stringify(anonItem.customization)
      )
      
      if (existingIndex !== -1) {
        mergedCart[existingIndex].quantity += anonItem.quantity
      } else {
        mergedCart.push(anonItem)
      }
    }
    
    await window.spark.kv.set(userCartKey, mergedCart)
    await window.spark.kv.delete(anonymousCartKey)
  }
  
  if (anonymousWishlist && anonymousWishlist.length > 0) {
    const userWishlist = await window.spark.kv.get<WishlistItem[]>(userWishlistKey) || []
    const mergedWishlist = [...userWishlist]
    
    for (const anonItem of anonymousWishlist) {
      const exists = mergedWishlist.some(item => item.product.id === anonItem.product.id)
      if (!exists) {
        mergedWishlist.push(anonItem)
      }
    }
    
    await window.spark.kv.set(userWishlistKey, mergedWishlist)
    await window.spark.kv.delete(anonymousWishlistKey)
  }
}

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

    await migrateAnonymousData(userEntry.user.id)
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
    await migrateAnonymousData(newUser.id)
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
