import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Product } from '@/lib/types'

const MAX_RECENT_PRODUCTS = 6

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useKV<string[]>('recently-viewed', [])

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed((current) => {
      const filtered = (current || []).filter(id => id !== productId)
      return [productId, ...filtered].slice(0, MAX_RECENT_PRODUCTS)
    })
  }

  const getRecentlyViewedProducts = (allProducts: Product[], currentProductId?: string): Product[] => {
    const productIds = recentlyViewed || []
    const filtered = currentProductId 
      ? productIds.filter(id => id !== currentProductId)
      : productIds
    
    return filtered
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined)
  }

  return {
    recentlyViewed: recentlyViewed || [],
    addToRecentlyViewed,
    getRecentlyViewedProducts
  }
}
