import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel'
import { Product } from '@/lib/types'
import { Ruler, Sparkle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { CartItem } from '@/lib/types'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

interface ProductDetailDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  const [, setCart] = useKV<CartItem[]>('cart', [])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!carouselApi) return

    carouselApi.on('select', () => {
      setSelectedImageIndex(carouselApi.selectedScrollSnap())
    })
  }, [carouselApi])

  if (!product) return null

  const addToCart = () => {
    setCart((currentCart) => {
      const existing = (currentCart || []).find(item => item.product.id === product.id)
      
      if (existing) {
        toast.success('Quantity updated in cart')
        return (currentCart || []).map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      toast.success('Added to cart')
      return [...(currentCart || []), { product, quantity: 1 }]
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-4xl font-medium pr-8">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <Carousel
                opts={{ loop: true }}
                className="w-full"
                setApi={setCarouselApi}
              >
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${product.name} - View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              {product.category === 'bespoke' && (
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground gap-1">
                  <Sparkle size={14} weight="fill" />
                  Bespoke
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index)
                    carouselApi?.scrollTo(index)
                  }}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-accent ring-2 ring-accent/20'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-4xl font-heading font-medium text-primary mb-4">
                £{product.price.toLocaleString()}
                {product.category === 'bespoke' && <span className="text-lg text-muted-foreground"> starting</span>}
              </p>
              <p className="text-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {product.dimensions.width > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Ruler size={20} className="text-muted-foreground" />
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Dimensions
                  </h4>
                </div>
                <p className="text-foreground">
                  {product.dimensions.width}cm W × {product.dimensions.length}cm L × {product.dimensions.height}cm H
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                Materials
              </h4>
              <ul className="space-y-2">
                {product.materials.map((material, idx) => (
                  <li key={idx} className="text-foreground flex items-start">
                    <span className="text-accent mr-2">•</span>
                    {material}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                Available Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                Features
              </h4>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="text-foreground flex items-start">
                    <span className="text-accent mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="space-y-3">
              {product.inStock ? (
                <Button
                  onClick={addToCart}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
                  size="lg"
                >
                  Add to Cart
                </Button>
              ) : (
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                  size="lg"
                >
                  Request Consultation
                </Button>
              )}
              <p className="text-xs text-muted-foreground text-center">
                Delivery times vary based on customization options
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
