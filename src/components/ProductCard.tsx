import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { motion } from 'framer-motion'
import { Sparkle, Heart, Star, Check, Ruler, Palette, Package, ShoppingCart } from '@phosphor-icons/react'
import { useWishlist } from '@/hooks/use-wishlist'
import { getProductReviews, calculateAverageRating } from '@/lib/reviews'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

const AVAILABLE_SIZES = ['Double', 'King', 'Super King']
const QUICK_COLORS = 4

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)
  const [imageIndex, setImageIndex] = useState(0)
  const [quickSelectedColor, setQuickSelectedColor] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const reviews = getProductReviews(product.id)
  const avgRating = calculateAverageRating(reviews)
  const hasReviews = reviews.length > 0

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (product.images.length > 1) {
      setImageIndex(1)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setImageIndex(0)
  }

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewDetails(product)
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
          
          {!product.inStock && product.category !== 'bespoke' && (
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
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex flex-wrap gap-2">
                {product.features.slice(0, 3).map((feature, idx) => (
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

        <CardContent className="p-5 space-y-4">
          {hasReviews && (
            <div className="flex items-center gap-2">
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
                {avgRating.toFixed(1)} ({reviews.length})
              </span>
            </div>
          )}

          <div>
            <h3 className="font-heading text-2xl font-medium text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
            
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-heading font-semibold text-primary">
              £{product.price.toLocaleString()}
            </p>
            {product.category === 'upholstered' && (
              <span className="text-xs text-muted-foreground">from</span>
            )}
          </div>

          {product.category !== 'bespoke' && product.inStock && (
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <Ruler size={16} className="text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">Available Sizes:</span>
              </div>
              <div className="flex gap-2">
                {AVAILABLE_SIZES.map((size) => (
                  <div
                    key={size}
                    className="flex-1 text-center px-2 py-1.5 rounded-md border border-border bg-muted/30 text-xs font-medium text-muted-foreground"
                  >
                    {size.replace(' ', '\n')}
                  </div>
                ))}
              </div>

              {product.colors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette size={16} className="text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      {product.colors.length} Colors
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {product.colors.slice(0, QUICK_COLORS).map((color, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation()
                          setQuickSelectedColor(color)
                        }}
                        className={cn(
                          "flex-1 h-8 rounded-md border-2 transition-all duration-200",
                          quickSelectedColor === color 
                            ? "border-accent ring-2 ring-accent/20" 
                            : "border-border hover:border-accent/50"
                        )}
                        style={{
                          background: color.toLowerCase().includes('green') ? '#2d5f3f' :
                                     color.toLowerCase().includes('blue') ? '#1e3a5f' :
                                     color.toLowerCase().includes('grey') || color.toLowerCase().includes('gray') ? '#4a5568' :
                                     color.toLowerCase().includes('pink') || color.toLowerCase().includes('blush') ? '#d4a5a5' :
                                     color.toLowerCase().includes('burgundy') ? '#6b1d1d' :
                                     color.toLowerCase().includes('emerald') ? '#065f46' :
                                     color.toLowerCase().includes('gold') || color.toLowerCase().includes('champagne') ? '#d4af37' :
                                     color.toLowerCase().includes('cream') || color.toLowerCase().includes('beige') ? '#f5f5dc' :
                                     color.toLowerCase().includes('taupe') ? '#b38b6d' :
                                     color.toLowerCase().includes('white') || color.toLowerCase().includes('dove') ? '#f8f8f8' :
                                     color.toLowerCase().includes('linen') ? '#faf0e6' :
                                     color.toLowerCase().includes('stone') ? '#d3cbc6' :
                                     color.toLowerCase().includes('slate') ? '#708090' :
                                     '#9ca3af'
                        }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > QUICK_COLORS && (
                      <div className="flex items-center justify-center px-2 text-xs text-muted-foreground">
                        +{product.colors.length - QUICK_COLORS}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 pt-1">
                <Package size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Customizable with storage, base options & more
                </span>
              </div>
            </div>
          )}

          {product.category === 'bespoke' && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-start gap-2">
                <Sparkle size={16} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Fully customizable design, materials, and dimensions
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={16} className="text-accent mt-0.5 flex-shrink-0" weight="bold" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Personal consultation included
                </span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0 flex gap-2">
          {product.category === 'bespoke' ? (
            <Button 
              onClick={() => onViewDetails(product)}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Sparkle size={16} weight="fill" className="mr-2" />
              Start Design
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => onViewDetails(product)}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Customize
              </Button>
              <Button
                onClick={handleQuickAddToCart}
                variant="outline"
                className="px-4 border-accent/30 hover:bg-accent/10 transition-all duration-200"
              >
                <ShoppingCart size={18} />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
