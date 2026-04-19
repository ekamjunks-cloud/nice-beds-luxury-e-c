import { useKV } from '@github/spark/hooks'
import { CartItem, Product, BedCustomization } from '@/lib/types'
import { toast } from 'sonner'

export function useCart() {
  const [cart, setCart] = useKV<CartItem[]>('cart', [])

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
