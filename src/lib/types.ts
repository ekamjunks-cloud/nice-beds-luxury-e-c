export interface Product {
  id: string
  name: string
  slug: string
  price: number
  description: string
  category: 'upholstered' | 'bespoke'
  dimensions: {
    width: number
    length: number
    height: number
  }
  materials: string[]
  colors: string[]
  images: string[]
  features: string[]
  inStock: boolean
}

export interface BedCustomization {
  size: 'Double' | 'King' | 'Super King' | 'Custom'
  customSize?: {
    width: string
    length: string
  }
  fabric: 'Naples' | 'Plush Velvet'
  color: string
  ottomanStorage: boolean
  gasLift: boolean
  metalBase: boolean
  baseType: 'Slats' | 'Board'
}

export interface WishlistItem {
  product: Product
  addedAt: number
  customization?: BedCustomization
  customizationPrice?: number
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  customization?: BedCustomization
  customizationPrice?: number
}

export interface ConsultationRequest {
  id: string
  name: string
  email: string
  phone: string
  message: string
  productInterest?: string
  timestamp: number
}

export interface Review {
  id: string
  author: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  size?: string
  color?: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  createdAt: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'in-production' | 'quality-check' | 'ready-for-delivery' | 'out-for-delivery' | 'delivered'
  createdAt: number
  updatedAt: number
  shippingAddress?: {
    street: string
    city: string
    postcode: string
    country: string
  }
  notes?: string
  estimatedDeliveryDate?: number
  trackingNumber?: string
  statusHistory?: OrderStatusUpdate[]
}

export interface OrderStatusUpdate {
  status: Order['status']
  timestamp: number
  note?: string
}

export interface UpdateRequest {
  id: string
  orderId: string
  userId: string
  message: string
  createdAt: number
  status: 'pending' | 'responded'
  response?: string
  respondedAt?: number
}
