import { useKV } from '@github/spark/hooks'
import { Product, Order, User, UpdateRequest } from '@/lib/types'
import { Discount, ProductVariant, AdminStats, AdminNotification } from '@/lib/admin-types'
import { useState, useEffect } from 'react'

export function useAdmin() {
  const [products, setProducts] = useKV<Product[]>('admin-products', [])
  const [orders, setOrders] = useKV<Order[]>('orders', [])
  const [discounts, setDiscounts] = useKV<Discount[]>('discounts', [])
  const [variants, setVariants] = useKV<ProductVariant[]>('product-variants', [])
  const [userIndex, setUserIndex] = useKV<User[]>('user-index', [])
  const [updateRequests, setUpdateRequests] = useKV<UpdateRequest[]>('update-requests', [])
  const [adminNotifications, setAdminNotifications] = useKV<AdminNotification[]>('admin-notifications', [])
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    activeDiscounts: 0,
    recentOrders: 0
  })

  useEffect(() => {
    const calculateStats = () => {
      const totalRevenue = (orders || []).reduce((sum, order) => sum + order.totalAmount, 0)
      const totalOrders = (orders || []).length
      const totalProducts = (products || []).length
      const totalUsers = (userIndex || []).length
      const pendingOrders = (orders || []).filter(o => o.status === 'pending').length
      const lowStockProducts = (variants || []).filter(v => v.stock < 10).length
      const activeDiscounts = (discounts || []).filter(d => d.isActive).length
      const recentOrders = (orders || []).filter(o => Date.now() - o.createdAt < 7 * 24 * 60 * 60 * 1000).length

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        pendingOrders,
        lowStockProducts,
        activeDiscounts,
        recentOrders
      })
    }

    calculateStats()
  }, [orders, products, userIndex, variants, discounts])

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setProducts(current => [...(current || []), newProduct])
    return newProduct
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(current => 
      (current || []).map(p => p.id === id ? { ...p, ...updates } : p)
    )
  }

  const deleteProduct = (id: string) => {
    setProducts(current => (current || []).filter(p => p.id !== id))
    setVariants(current => (current || []).filter(v => v.productId !== id))
  }

  const addDiscount = (discount: Omit<Discount, 'id' | 'usedCount' | 'createdAt'>) => {
    const newDiscount: Discount = {
      ...discount,
      id: `disc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      usedCount: 0,
      createdAt: Date.now()
    }
    setDiscounts(current => [...(current || []), newDiscount])
    return newDiscount
  }

  const updateDiscount = (id: string, updates: Partial<Discount>) => {
    setDiscounts(current =>
      (current || []).map(d => d.id === id ? { ...d, ...updates } : d)
    )
  }

  const deleteDiscount = (id: string) => {
    setDiscounts(current => (current || []).filter(d => d.id !== id))
  }

  const addVariant = (variant: Omit<ProductVariant, 'id'>) => {
    const newVariant: ProductVariant = {
      ...variant,
      id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setVariants(current => [...(current || []), newVariant])
    return newVariant
  }

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants(current =>
      (current || []).map(v => v.id === id ? { ...v, ...updates } : v)
    )
  }

  const deleteVariant = (id: string) => {
    setVariants(current => (current || []).filter(v => v.id !== id))
  }

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(current =>
      (current || []).map(o => o.id === id ? { ...o, ...updates, updatedAt: Date.now() } : o)
    )
  }

  const respondToUpdateRequest = (requestId: string, response: string) => {
    setUpdateRequests(current =>
      (current || []).map(r => 
        r.id === requestId 
          ? { ...r, status: 'responded' as const, response, respondedAt: Date.now() } 
          : r
      )
    )
  }

  const addNotification = (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AdminNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    }
    setAdminNotifications(current => [newNotification, ...(current || [])])
  }

  const markNotificationRead = (id: string) => {
    setAdminNotifications(current =>
      (current || []).map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const clearAllNotifications = () => {
    setAdminNotifications([])
  }

  return {
    products: products || [],
    orders: orders || [],
    discounts: discounts || [],
    variants: variants || [],
    users: userIndex || [],
    updateRequests: updateRequests || [],
    notifications: adminNotifications || [],
    stats,
    addProduct,
    updateProduct,
    deleteProduct,
    addDiscount,
    updateDiscount,
    deleteDiscount,
    addVariant,
    updateVariant,
    deleteVariant,
    updateOrder,
    respondToUpdateRequest,
    addNotification,
    markNotificationRead,
    clearAllNotifications
  }
}
