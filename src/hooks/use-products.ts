import { useKV } from '@github/spark/hooks'
import { Product } from '@/lib/types'
import { products as defaultProducts } from '@/lib/products'
import { useEffect } from 'react'

export function useProducts() {
  const [adminProducts, setAdminProducts] = useKV<Product[]>('admin-products', [])
  const [isInitialized, setIsInitialized] = useKV<boolean>('products-initialized', false)

  useEffect(() => {
    if (!isInitialized && (!adminProducts || adminProducts.length === 0)) {
      setAdminProducts(defaultProducts)
      setIsInitialized(true)
    }
  }, [isInitialized, adminProducts])

  const products = (adminProducts && adminProducts.length > 0) ? adminProducts : defaultProducts

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id)
  }

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug)
  }

  const getProductsByCategory = (category: 'upholstered' | 'bespoke'): Product[] => {
    return products.filter(p => p.category === category)
  }

  const getInStockProducts = (): Product[] => {
    return products.filter(p => p.inStock)
  }

  return {
    products,
    getProductById,
    getProductBySlug,
    getProductsByCategory,
    getInStockProducts
  }
}
