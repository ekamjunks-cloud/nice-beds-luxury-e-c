export interface Discount {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description: string
  minPurchase?: number
  maxUses?: number
  usedCount: number
  expiresAt?: number
  isActive: boolean
  createdAt: number
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  size: string
  color: string
  price: number
  stock: number
  images?: string[]
}

export interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  pendingOrders: number
  lowStockProducts: number
  activeDiscounts: number
  recentOrders: number
}

export interface AdminNotification {
  id: string
  type: 'order' | 'stock' | 'user' | 'system'
  title: string
  message: string
  timestamp: number
  read: boolean
  link?: string
}
