import { Review } from './types'

export const reviewsByProduct: Record<string, Review[]> = {
  '1': [
    {
      id: 'r1',
      author: 'Sarah Mitchell',
      rating: 5,
      title: 'Absolutely Stunning Quality',
      content: 'The Mayfair exceeded all my expectations. The deep button tufting is exquisite and the velvet is incredibly luxurious. My bedroom has been completely transformed. Worth every penny!',
      date: '2024-02-15',
      verified: true,
      size: 'King',
      color: 'Forest Green'
    },
    {
      id: 'r2',
      author: 'James Thornton',
      rating: 5,
      title: 'Outstanding Craftsmanship',
      content: 'Impressed by the attention to detail. The wingback design adds such elegance to our master bedroom. Delivery was smooth and the installation team were professional.',
      date: '2024-01-28',
      verified: true,
      size: 'Super King',
      color: 'Navy Blue'
    },
    {
      id: 'r3',
      author: 'Emma Roberts',
      rating: 4,
      title: 'Beautiful but took time to arrive',
      content: 'The bed is gorgeous and the quality is top-notch. Only giving 4 stars because it took slightly longer to deliver than expected, but it was worth the wait.',
      date: '2024-01-10',
      verified: true,
      size: 'King',
      color: 'Charcoal Grey'
    }
  ],
  '2': [
    {
      id: 'r4',
      author: 'Oliver Watson',
      rating: 5,
      title: 'Perfect for Modern Homes',
      content: 'The Chelsea fits perfectly with our minimalist bedroom design. Clean lines, superb comfort, and the linen fabric feels premium. Highly recommend!',
      date: '2024-02-20',
      verified: true,
      size: 'King',
      color: 'Natural Linen'
    },
    {
      id: 'r5',
      author: 'Sophie Anderson',
      rating: 5,
      title: 'Excellent Value',
      content: 'For the price, this bed is incredible. The quality matches beds twice the cost. Assembly was straightforward and it looks amazing in our guest room.',
      date: '2024-02-05',
      verified: true,
      size: 'Double',
      color: 'Soft Grey'
    },
    {
      id: 'r6',
      author: 'Michael Davies',
      rating: 5,
      title: 'Comfort meets style',
      content: 'Really pleased with this purchase. The upholstery is beautifully done and it\'s so comfortable to lean against when reading. Great British craftsmanship.',
      date: '2024-01-22',
      verified: true,
      size: 'King',
      color: 'Stone Beige'
    }
  ],
  '3': [
    {
      id: 'r7',
      author: 'Victoria Hamilton',
      rating: 5,
      title: 'A True Statement Piece',
      content: 'The Kensington is absolutely breathtaking. The channel stitching is perfect and the emerald velvet catches the light beautifully. Everyone who visits comments on it!',
      date: '2024-02-18',
      verified: true,
      size: 'Super King',
      color: 'Deep Emerald'
    },
    {
      id: 'r8',
      author: 'David Richardson',
      rating: 5,
      title: 'Luxurious and Well-Made',
      content: 'This is the centerpiece of our bedroom. The tall headboard creates such an impressive look. Quality is exceptional throughout. Best bed we\'ve ever owned.',
      date: '2024-02-01',
      verified: true,
      size: 'King',
      color: 'Royal Blue'
    },
    {
      id: 'r9',
      author: 'Charlotte Williams',
      rating: 5,
      title: 'Worth the investment',
      content: 'Initially hesitant about the price, but after receiving it I understand why. The craftsmanship is outstanding. The burgundy color is rich and sophisticated.',
      date: '2024-01-15',
      verified: true,
      size: 'King',
      color: 'Burgundy'
    }
  ],
  '4': [
    {
      id: 'r10',
      author: 'Rachel Green',
      rating: 5,
      title: 'Classic and Comfortable',
      content: 'The Richmond is perfect for our cottage bedroom. The taupe color is neutral yet warm, and the comfort level is excellent. Very happy with this choice.',
      date: '2024-02-12',
      verified: true,
      size: 'Double',
      color: 'Soft Taupe'
    },
    {
      id: 'r11',
      author: 'Thomas Baker',
      rating: 4,
      title: 'Great quality, lovely design',
      content: 'Really pleased with the quality and eco-friendly materials. Looks great in our bedroom. Only minor issue was a small stitch that needed attention, but customer service sorted it quickly.',
      date: '2024-01-30',
      verified: true,
      size: 'King',
      color: 'Warm Grey'
    },
    {
      id: 'r12',
      author: 'Lucy Parker',
      rating: 5,
      title: 'Timeless elegance',
      content: 'This bed is beautiful. The cream color is exactly what I wanted and the cotton blend feels wonderful. UK craftsmanship at its finest.',
      date: '2024-01-18',
      verified: true,
      size: 'King',
      color: 'Cream'
    }
  ],
  '6': [
    {
      id: 'r13',
      author: 'Isabella Turner',
      rating: 5,
      title: 'Gorgeous Curved Design',
      content: 'The curved headboard is stunning! The bouclé fabric is so on-trend and adds such texture to the room. Couldn\'t be happier with this purchase.',
      date: '2024-02-22',
      verified: true,
      size: 'King',
      color: 'Cream Bouclé'
    },
    {
      id: 'r14',
      author: 'Henry Collins',
      rating: 5,
      title: 'Contemporary perfection',
      content: 'Modern, stylish, and incredibly comfortable. The memory foam layers make it perfect for reading in bed. The grey color is sophisticated.',
      date: '2024-02-08',
      verified: true,
      size: 'King',
      color: 'Soft Grey'
    },
    {
      id: 'r15',
      author: 'Amelia Foster',
      rating: 5,
      title: 'Love the bouclé texture',
      content: 'The fabric is exactly as pictured - soft, textured, and beautiful. The bed arrived well-packaged and in perfect condition. Assembly was easy too.',
      date: '2024-01-25',
      verified: true,
      size: 'Double',
      color: 'Oatmeal'
    }
  ]
}

export function getProductReviews(productId: string): Review[] {
  return reviewsByProduct[productId] || []
}

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return sum / reviews.length
}

export function getRatingDistribution(reviews: Review[]): Record<number, number> {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++
  })
  return distribution
}
