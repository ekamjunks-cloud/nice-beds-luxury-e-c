import { useKV } from '@github/spark/hooks'
import { CartItem, Product, BedCustomization } from '@/lib/types'
import { toast } from 'sonner'
import { useAuth } from './use-auth'
import { useEffect, useState } from 'react'

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('spark-session-id')
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('spark-session-id', sessionId)
  }
  return sessionId
}

export function useCart() {
  const { user } = useAuth()
  const sessionId = getSessionId()
  const cartKey = user ? `cart-user-${user.id}` : `cart-${sessionId}`
  
  const [cart, setCart] = useKV<CartItem[]>(cartKey, [])

  const addToCart = (
    product: Product, 
    quantity: number = 1,
    selectedColor?: string,
    customization?: BedCustomization,
    customizationPrice?: number
  ) => {
    setCart((currentCart) => {
      const existingIndex = (currentCart || []).findIndex(
        item => 
          item.product.id === product.id && 
          item.selectedColor === selectedColor &&
          JSON.stringify(item.customization) === JSON.stringify(customization)
      )

      if (existingIndex !== -1) {
        const updated = [...(currentCart || [])]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        }
        toast.success('Cart updated')
        return updated
      }

      toast.success('Added to cart')
      return [
        ...(currentCart || []),
        { 
          product, 
          quantity, 
          selectedColor,
          customization,
          customizationPrice
        }
      ]
    })
  }

  const removeFromCart = (index: number) => {
    setCart((currentCart) => {
      const updated = [...(currentCart || [])]
      updated.splice(index, 1)
      toast.success('Item removed from cart')
      return updated
    })
  }

  const updateQuantity = (index: number, delta: number) => {
    setCart((currentCart) => {
      const updated = [...(currentCart || [])]
      const item = updated[index]
      
      if (!item) return currentCart || []

      const newQuantity = item.quantity + delta
      
      if (newQuantity <= 0) {
        updated.splice(index, 1)
        toast.success('Item removed from cart')
        return updated
      }

      updated[index] = { ...item, quantity: newQuantity }
      return updated
    })
  }

  const clearCart = () => {
    setCart([])
    toast.success('Cart cleared')
  }

  const getCartTotal = () => {
    return (cart || []).reduce((sum, item) => {
      const itemPrice = item.product.price + (item.customizationPrice || 0)
      return sum + (itemPrice * item.quantity)
    }, 0)
  }

  const getCartCount = () => {
    return (cart || []).reduce((sum, item) => sum + item.quantity, 0)
  }

  return {
    cart: cart || [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal: getCartTotal(),
    cartCount: getCartCount()
  }
}
