import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { motion } from 'framer-motion'
import { Sparkle, Heart, Star, Check } from '@phosphor-icons/react'
import { useWishlist } from '@/hooks/use-wishlist'
import { getProductReviews, calculateAverageRating } from '@/lib/reviews'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)
  const [imageIndex, setImageIndex] = useState(0)
  
  const reviews = getProductReviews(product.id)
  const avgRating = calculateAverageRating(reviews)
  const hasReviews = reviews.length > 0

  const handleMouseEnter = () => {
    if (product.images.length > 1) {
      setImageIndex(1)
    }
  }

  const handleMouseLeave = () => {
    setImageIndex(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-primary/5 border-border hover:border-accent/30 transition-all duration-300">
        <div 
          className="relative aspect-[4/3] overflow-hidden bg-muted/30"
          onClick={() => onViewDetails(product)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={product.images[imageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {product.category === 'bespoke' && (
            <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground gap-1.5 shadow-lg backdrop-blur-sm px-3 py-1">
              <Sparkle size={14} weight="fill" />
              Bespoke
            </Badge>
          )}
          
          {!product.inStock && (
            <Badge className="absolute top-4 right-4 bg-muted text-muted-foreground gap-1.5 shadow-lg backdrop-blur-sm px-3 py-1">
              Contact for Details
            </Badge>
          )}
          
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              toggleWishlist(product)
            }}
            className="absolute top-4 left-4 h-10 w-10 rounded-full bg-card/90 backdrop-blur-md hover:bg-card shadow-md hover:scale-110 transition-all duration-200"
          >
            <Heart 
              size={20} 
              weight={inWishlist ? "fill" : "regular"} 
              className={inWishlist ? "text-accent" : "text-foreground"}
            />
          </Button>

          {product.inStock && product.features.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex flex-wrap gap-2">
                {product.features.slice(0, 2).map((feature, idx) => (
                  <span 
                    key={idx}
                    className="text-xs text-card flex items-center gap-1 bg-card/20 backdrop-blur-sm px-2 py-1 rounded-full"
                  >
                    <Check size={12} weight="bold" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-5">
          {hasReviews && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    weight={idx < Math.round(avgRating) ? "fill" : "regular"}
                    className={idx < Math.round(avgRating) ? "text-accent" : "text-muted-foreground"}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <h3 className="font-heading text-2xl font-medium text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-heading font-semibold text-primary">
              £{product.price.toLocaleString()}
            </p>
            {product.category === 'upholstered' && (
              <span className="text-xs text-muted-foreground">from</span>
            )}
          </div>

          {product.colors.length > 0 && product.category !== 'bespoke' && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{product.colors.length} colors available</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0 flex gap-2">
          <Button 
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {product.category === 'bespoke' ? 'Start Design' : 'Customize'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
