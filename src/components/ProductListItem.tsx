import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product, CartItem } from '@/lib/types'
import { ShoppingCart, Heart, Eye } from '@phosphor-icons/react'
import { useWishlist } from '@/hooks/use-wishlist'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { useState } from 'react'

interface ProductListItemProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export function ProductListItem({ product, onViewDetails }: ProductListItemProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [, setCart] = useKV<CartItem[]>('cart', [])
  const [selectedColor] = useState<string>(product.colors[0] || '')
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    setCart((currentCart) => {
      const existing = (currentCart || []).find(item => 
        item.product.id === product.id && !item.customization
      )
      
      if (existing) {
        toast.success('Quantity updated in cart')
        return (currentCart || []).map(item =>
          item.product.id === product.id && !item.customization
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      toast.success('Added to cart')
      return [...(currentCart || []), { 
        product, 
        quantity: 1,
        selectedColor
      }]
    })
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product)
  }

  return (
    <motion.div
      layout
      className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        <div className="relative w-full sm:w-64 h-64 sm:h-48 flex-shrink-0 rounded-lg overflow-hidden bg-muted group">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {!product.inStock && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              Out of Stock
            </Badge>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-heading text-2xl font-medium text-foreground mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {product.category} Collection
                </p>
              </div>
              <p className="font-heading text-2xl font-medium text-primary flex-shrink-0">
                £{product.price.toLocaleString()}
              </p>
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Materials:</span>
                <div className="flex flex-wrap gap-1">
                  {product.materials.map((material) => (
                    <Badge key={material} variant="secondary" className="text-xs">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Available in:</span>
                <div className="flex flex-wrap gap-1">
                  {product.colors.map((color) => (
                    <Badge key={color} variant="outline" className="text-xs">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => onViewDetails(product)}
              className="flex-1 sm:flex-none"
            >
              <Eye size={18} weight="regular" className="mr-2" />
              View Details
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <ShoppingCart size={18} weight="regular" className="mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={handleToggleWishlist}
              variant="outline"
              size="icon"
            >
              <Heart
                size={18}
                weight={inWishlist ? 'fill' : 'regular'}
                className={inWishlist ? 'text-accent' : ''}
              />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
