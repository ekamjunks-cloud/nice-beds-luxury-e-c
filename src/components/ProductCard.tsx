import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { motion } from 'framer-motion'
import { Sparkle, Heart } from '@phosphor-icons/react'
import { useWishlist } from '@/hooks/use-wishlist'

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
        <div 
          className="relative aspect-[4/3] overflow-hidden"
          onClick={() => onViewDetails(product)}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.category === 'bespoke' && (
            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground gap-1">
              <Sparkle size={14} weight="fill" />
              Bespoke
            </Badge>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              toggleWishlist(product)
            }}
            className="absolute top-3 left-3 h-10 w-10 rounded-full bg-card/80 backdrop-blur hover:bg-card transition-all"
          >
            <Heart 
              size={20} 
              weight={inWishlist ? "fill" : "regular"} 
              className={inWishlist ? "text-accent" : "text-foreground"}
            />
          </Button>
        </div>
        <CardContent className="p-6">
          <h3 className="font-heading text-2xl font-medium text-foreground mb-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {product.description}
          </p>
          <p className="text-2xl font-heading font-medium text-primary">
            £{product.price.toLocaleString()}
          </p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button 
            onClick={() => onViewDetails(product)}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
