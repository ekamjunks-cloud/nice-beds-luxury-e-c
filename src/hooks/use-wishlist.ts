import { useKV } from '@github/spark/hooks'
import { Product } from '@/lib/types'
import { toast } from 'sonner'

export interface WishlistItem {
  product: Product
  addedAt: number
}

export function useWishlist() {
  const [wishlist, setWishlist] = useKV<WishlistItem[]>('wishlist', [])

  const addToWishlist = (product: Product) => {
    setWishlist((current = []) => {
      const exists = current.some(item => item.product.id === product.id)
      if (exists) {
        toast.info('Already in your wishlist')
        return current
      }
      toast.success('Added to wishlist')
      return [...current, { product, addedAt: Date.now() }]
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

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
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
