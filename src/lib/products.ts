import { Product } from './types'

export const products: Product[] = [
  {
    id: '1',
    name: 'The Mayfair',
    slug: 'the-mayfair',
    price: 1299,
    description: 'A sophisticated upholstered bed frame featuring deep button tufting and elegant wingback design. Handcrafted in our Leeds workshop with premium materials.',
    category: 'upholstered',
    dimensions: {
      width: 180,
      length: 220,
      height: 135
    },
    materials: ['Premium velvet', 'Solid pine frame', 'High-density foam'],
    colors: ['Forest Green', 'Navy Blue', 'Charcoal Grey', 'Blush Pink'],
    images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'],
    features: ['Deep button tufting', 'Wingback headboard', 'Sprung slats included', 'Made in Leeds'],
    inStock: true
  },
  {
    id: '2',
    name: 'The Chelsea',
    slug: 'the-chelsea',
    price: 1099,
    description: 'Clean lines meet luxury comfort in this contemporary upholstered bed. Perfect for modern interiors seeking understated elegance.',
    category: 'upholstered',
    dimensions: {
      width: 160,
      length: 210,
      height: 120
    },
    materials: ['Linen blend fabric', 'Solid oak frame', 'Premium foam padding'],
    colors: ['Natural Linen', 'Soft Grey', 'Stone Beige', 'Slate Blue'],
    images: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80'],
    features: ['Minimalist design', 'Reinforced corners', 'Easy assembly', 'Handcrafted quality'],
    inStock: true
  },
  {
    id: '3',
    name: 'The Kensington',
    slug: 'the-kensington',
    price: 1499,
    description: 'Our signature statement piece featuring a grand upholstered headboard with intricate channel stitching. A true centerpiece for any bedroom.',
    category: 'upholstered',
    dimensions: {
      width: 180,
      length: 220,
      height: 145
    },
    materials: ['Luxury velvet', 'Hardwood frame', 'Multi-layer padding'],
    colors: ['Deep Emerald', 'Royal Blue', 'Burgundy', 'Champagne Gold'],
    images: ['https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'],
    features: ['Channel stitching', 'Extra tall headboard', 'Gold-finished feet', 'Premium construction'],
    inStock: true
  },
  {
    id: '4',
    name: 'The Richmond',
    slug: 'the-richmond',
    price: 999,
    description: 'Timeless simplicity with plush comfort. The Richmond offers classic styling that complements any bedroom aesthetic.',
    category: 'upholstered',
    dimensions: {
      width: 150,
      length: 200,
      height: 110
    },
    materials: ['Cotton blend', 'Sustainable wood frame', 'Natural latex foam'],
    colors: ['Warm Grey', 'Cream', 'Soft Taupe', 'Dove White'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80'],
    features: ['Eco-friendly materials', 'Classic design', 'Durable construction', 'UK craftsmanship'],
    inStock: true
  },
  {
    id: '5',
    name: 'Bespoke Collection',
    slug: 'bespoke-collection',
    price: 2499,
    description: 'Create your dream bed exactly as you envision it. Our bespoke service allows you to choose every detail - from dimensions to fabrics to finishing touches.',
    category: 'bespoke',
    dimensions: {
      width: 0,
      length: 0,
      height: 0
    },
    materials: ['Your choice of premium fabrics', 'Bespoke frame construction', 'Custom specifications'],
    colors: ['Unlimited options available'],
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'],
    features: ['Fully customizable', 'Personal consultation', 'Unique design', 'Expert craftsmanship'],
    inStock: false
  },
  {
    id: '6',
    name: 'The Notting Hill',
    slug: 'the-notting-hill',
    price: 1199,
    description: 'Curved elegance meets modern sophistication. Featuring a gently curved headboard and sumptuous upholstery for ultimate comfort.',
    category: 'upholstered',
    dimensions: {
      width: 160,
      length: 210,
      height: 125
    },
    materials: ['Bouclé fabric', 'Solid beech frame', 'Memory foam layers'],
    colors: ['Cream Bouclé', 'Oatmeal', 'Soft Grey', 'Warm Beige'],
    images: ['https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80'],
    features: ['Curved headboard', 'On-trend bouclé fabric', 'Supremely comfortable', 'Contemporary style'],
    inStock: true
  }
]
