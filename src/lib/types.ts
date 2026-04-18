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

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
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
