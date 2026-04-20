import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, CartItem, WishlistItem } from '@/lib/types'
import { 
  createPasswordHash, 
  verifyPassword, 
  validateEmail, 
  validatePassword,
  sanitizeUserInput,
  generateSecureToken
} from '@/lib/auth'
import { StorageHelper } from '@/lib/storage'

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
  
  const anonymousCart = await StorageHelper.safeKVGet<CartItem[]>(anonymousCartKey)
  const anonymousWishlist = await StorageHelper.safeKVGet<WishlistItem[]>(anonymousWishlistKey)
  
  if (anonymousCart && anonymousCart.length > 0) {
    const userCart = await StorageHelper.safeKVGet<CartItem[]>(userCartKey) || []
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
    
    await StorageHelper.safeKVSet(userCartKey, mergedCart)
    await StorageHelper.safeKVDelete(anonymousCartKey)
  }
  
  if (anonymousWishlist && anonymousWishlist.length > 0) {
    const userWishlist = await StorageHelper.safeKVGet<WishlistItem[]>(userWishlistKey) || []
    const mergedWishlist = [...userWishlist]
    
    for (const anonItem of anonymousWishlist) {
      const exists = mergedWishlist.some(item => item.product.id === anonItem.product.id)
      if (!exists) {
        mergedWishlist.push(anonItem)
      }
    }
    
    await StorageHelper.safeKVSet(userWishlistKey, mergedWishlist)
    await StorageHelper.safeKVDelete(anonymousWishlistKey)
  }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const storageCheck = StorageHelper.checkStorageAvailability()
      if (!storageCheck.available) {
        return { success: false, error: storageCheck.message || 'Storage not available' }
      }

      if (!validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' }
      }

      if (!password || password.length === 0) {
        return { success: false, error: 'Please enter your password' }
      }

      const sanitizedEmail = sanitizeUserInput(email)
      const emailKey = `user-email-${sanitizedEmail.toLowerCase()}`
      const userEntry = await StorageHelper.safeKVGet<{ email: string; passwordHash: string; user: User }>(emailKey)

      if (!userEntry) {
        return { success: false, error: 'Invalid email or password' }
      }

      const isPasswordValid = await verifyPassword(password, userEntry.passwordHash)
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid email or password' }
      }

      await migrateAnonymousData(userEntry.user.id)
      
      const sessionToken = generateSecureToken()
      sessionStorage.setItem('auth-token', sessionToken)
      sessionStorage.setItem('auth-token-expires', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString())
      
      setCurrentUser(userEntry.user)
      return { success: true }
    } catch (error) {
      console.error('Login error in useAuth:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unable to sign in. Please try again.' 
      }
    }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Starting signup process...')
      
      const storageCheck = StorageHelper.checkStorageAvailability()
      if (!storageCheck.available) {
        console.error('Storage not available:', storageCheck.message)
        return { success: false, error: storageCheck.message || 'Storage not available. Please enable cookies and local storage.' }
      }
      
      if (!validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' }
      }

      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error }
      }

      const sanitizedEmail = sanitizeUserInput(email)
      const sanitizedName = sanitizeUserInput(name)
      const sanitizedPhone = phone ? sanitizeUserInput(phone) : undefined

      if (!sanitizedName || sanitizedName.length < 2) {
        return { success: false, error: 'Please enter a valid name' }
      }

      console.log('Checking if email exists...')
      const emailKey = `user-email-${sanitizedEmail.toLowerCase()}`
      const existingUser = await StorageHelper.safeKVGet<{ email: string; passwordHash: string; user: User }>(emailKey)

      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' }
      }

      console.log('Creating password hash...')
      const passwordHash = await createPasswordHash(password)

      const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: sanitizedEmail,
        name: sanitizedName,
        phone: sanitizedPhone,
        createdAt: Date.now()
      }

      console.log('Saving user to KV store...')
      const userEntry = {
        email: sanitizedEmail,
        passwordHash,
        user: newUser
      }

      await StorageHelper.safeKVSet(emailKey, userEntry)
      await StorageHelper.safeKVSet(`user-id-${newUser.id}`, userEntry)
      
      const userIndex = await StorageHelper.safeKVGet<User[]>('user-index') || []
      await StorageHelper.safeKVSet('user-index', [...userIndex, newUser])
      console.log('User saved successfully')
      
      console.log('Migrating anonymous data...')
      try {
        await migrateAnonymousData(newUser.id)
      } catch (migrateError) {
        console.warn('Migration error (non-critical):', migrateError)
      }
      
      const sessionToken = generateSecureToken()
      sessionStorage.setItem('auth-token', sessionToken)
      sessionStorage.setItem('auth-token-expires', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString())
      
      console.log('Setting current user...')
      setCurrentUser(newUser)

      console.log('Signup completed successfully')
      return { success: true }
    } catch (error) {
      console.error('Signup error in useAuth:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unable to create account. Please enable cookies and local storage, then try again.' 
      }
    }
  }

  const logout = () => {
    sessionStorage.removeItem('auth-token')
    sessionStorage.removeItem('auth-token-expires')
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
