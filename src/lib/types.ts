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
