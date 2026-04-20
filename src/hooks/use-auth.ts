import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, CartItem, WishlistItem } from '@/lib/types'
import { 
  validateEmail, 
  validatePassword,
  sanitizeUserInput
} from '@/lib/auth'
import { StorageHelper } from '@/lib/storage'
import { auth } from '@/lib/firebase'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth'

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

function mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    phone: firebaseUser.phoneNumber || undefined,
    createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()).getTime()
  }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = mapFirebaseUserToUser(firebaseUser)
        setCurrentUser(user)
        await migrateAnonymousData(user.id)
      } else {
        setCurrentUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [setCurrentUser])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' }
      }

      if (!password || password.length === 0) {
        return { success: false, error: 'Please enter your password' }
      }

      const sanitizedEmail = sanitizeUserInput(email)
      await signInWithEmailAndPassword(auth, sanitizedEmail, password)
      
      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      
      let errorMessage = 'Unable to sign in. Please try again.'
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      return { 
        success: false, 
        error: errorMessage
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
      console.log('Starting Firebase signup...')
      
      if (!validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' }
      }

      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error }
      }

      const sanitizedEmail = sanitizeUserInput(email)
      const sanitizedName = sanitizeUserInput(name)

      if (!sanitizedName || sanitizedName.length < 2) {
        return { success: false, error: 'Please enter a valid name' }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, sanitizedEmail, password)
      
      await updateProfile(userCredential.user, {
        displayName: sanitizedName
      })

      console.log('Firebase user created successfully')
      return { success: true }
    } catch (error: any) {
      console.error('Signup error:', error)
      
      let errorMessage = 'Unable to create account. Please try again.'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setCurrentUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
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
