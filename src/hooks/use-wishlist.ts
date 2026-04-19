import { useKV } from '@github/spark/hooks'
import { Product, BedCustomization, WishlistItem } from '@/lib/types'
import { toast } from 'sonner'
import { useAuth } from './use-auth'

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('spark-session-id')
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('spark-session-id', sessionId)
  }
  return sessionId
}

export function useWishlist() {
  const { user } = useAuth()
  const sessionId = getSessionId()
  const wishlistKey = user ? `wishlist-user-${user.id}` : `wishlist-${sessionId}`
  
  const [wishlist, setWishlist] = useKV<WishlistItem[]>(wishlistKey, [])

  const addToWishlist = (product: Product, customization?: BedCustomization, customizationPrice?: number) => {
    setWishlist((current = []) => {
      const exists = current.some(item => item.product.id === product.id)
      if (exists) {
        toast.info('Already in your wishlist')
        return current
      }
      toast.success('Added to wishlist')
      return [...current, { 
        product, 
        addedAt: Date.now(),
        customization,
        customizationPrice
      }]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist((current = []) => {
      const filtered = current.filter(item => item.product.id !== productId)
      toast.success('Removed from wishlist')
      return filtered
    })
  }

  const isInWishlist = (productId: string) => {
    return (wishlist || []).some(item => item.product.id === productId)
  }

  const toggleWishlist = (product: Product, customization?: BedCustomization, customizationPrice?: number) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product, customization, customizationPrice)
    }
  }

  const clearWishlist = () => {
    setWishlist([])
    toast.success('Wishlist cleared')
  }

  return {
    wishlist: wishlist || [],
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount: (wishlist || []).length
  }
}
