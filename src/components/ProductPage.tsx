import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel'
import { Navigation } from '@/components/Navigation'
import { CartDrawer } from '@/components/CartDrawer'
import { BedCustomizer, BedCustomization } from '@/components/BedCustomizer'
import { ReviewsSection } from '@/components/ReviewsSection'
import { products } from '@/lib/products'
import { getProductReviews } from '@/lib/reviews'
import { Product, CartItem } from '@/lib/types'
import { Sparkle, ArrowLeft, ShoppingCart, ShieldCheck, Lock } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Toaster } from '@/components/ui/sonner'

export function ProductPage() {
  const [cartOpen, setCartOpen] = useState(false)
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [, setCart] = useKV<CartItem[]>('cart', [])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [customization, setCustomization] = useState<BedCustomization | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')

  const product = products.find(p => p.slug === slug)

  useEffect(() => {
    if (!carouselApi) return

    carouselApi.on('select', () => {
      setSelectedImageIndex(carouselApi.selectedScrollSnap())
    })
  }, [carouselApi])

  useEffect(() => {
    if (product && product.colors.length > 0) {
      setSelectedColor(product.colors[0])
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-medium text-foreground mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    )
  }

  const handleCustomizationChange = (newCustomization: BedCustomization) => {
    setCustomization(newCustomization)
  }

  const calculateCustomizationPrice = (custom: BedCustomization): number => {
    let total = 0
    
    const sizeOptions = [
      { name: 'Double', price: 0 },
      { name: 'King', price: 200 },
      { name: 'Super King', price: 400 },
    ]
    
    const fabricOptions = [
      { name: 'Naples', price: 0 },
      { name: 'Plush Velvet', price: 150 },
    ]
    
    const baseOptions = [
      { name: 'Slats', price: 0 },
      { name: 'Board', price: 50 },
    ]
    
    const size = sizeOptions.find(s => s.name === custom.size)
    if (size) total += size.price
    
    const fabric = fabricOptions.find(f => f.name === custom.fabric)
    if (fabric) total += fabric.price
    
    if (custom.ottomanStorage) total += 250
    if (custom.metalBase) total += 100
    
    const base = baseOptions.find(b => b.name === custom.baseType)
    if (base) total += base.price
    
    return total
  }

  const addToCart = () => {
    const customizationPrice = customization ? calculateCustomizationPrice(customization) : 0
    
    setCart((currentCart) => {
      const existing = (currentCart || []).find(item => 
        item.product.id === product.id && 
        JSON.stringify(item.customization) === JSON.stringify(customization)
      )
      
      if (existing) {
        toast.success('Quantity updated in cart')
        return (currentCart || []).map(item =>
          item.product.id === product.id && 
          JSON.stringify(item.customization) === JSON.stringify(customization)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      toast.success('Added to cart')
      return [...(currentCart || []), { 
        product, 
        quantity: 1, 
        selectedColor,
        customization: customization || undefined,
        customizationPrice
      }]
    })
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  const reviews = getProductReviews(product.id)

  const handleNavigate = (section: string) => {
    navigate('/')
    setTimeout(() => {
      const element = document.getElementById(section)
      element?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <>
      <Navigation
        onCartOpen={() => setCartOpen(true)}
        onNavigate={handleNavigate}
        currentSection="shop"
      />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-accent/10"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Shop
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 lg:sticky lg:top-24 lg:self-start"
          >
            <div className="relative rounded-lg overflow-hidden bg-muted/20">
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
                {product.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
              {product.category === 'bespoke' && (
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground gap-1">
                  <Sparkle size={14} weight="fill" />
                  Bespoke
                </Badge>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
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
            )}

            <div className="hidden lg:block bg-muted/30 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Why Choose Nice Beds?
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-sm">
                  <span className="text-accent mr-2">✓</span>
                  <span>Handcrafted in Leeds by skilled artisans</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-accent mr-2">✓</span>
                  <span>Premium materials and sustainable practices</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-accent mr-2">✓</span>
                  <span>15+ years of British craftsmanship</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-accent mr-2">✓</span>
                  <span>Customization options available</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h1 className="font-heading text-5xl font-medium text-foreground mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-heading font-medium text-primary">
                  £{product.price.toLocaleString()}
                  {product.category === 'bespoke' && <span className="text-lg text-muted-foreground"> starting</span>}
                </p>
                {customization && (
                  <p className="text-xl text-muted-foreground">
                    + £{calculateCustomizationPrice(customization).toLocaleString()} customization
                  </p>
                )}
              </div>
              {customization && (
                <div className="mt-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <p className="font-heading text-2xl font-medium text-foreground">
                    Total: £{(product.price + calculateCustomizationPrice(customization)).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-foreground leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="font-heading text-3xl font-medium text-foreground mb-6">
                Customize Your Bed
              </h2>
              <BedCustomizer 
                onCustomizationChange={handleCustomizationChange}
                basePrice={product.price}
                onBuyNow={addToCart}
              />
            </div>

            <div className="space-y-4 sticky top-4 bg-background pt-4 pb-4">
              {product.inStock ? (
                <>
                  <Button
                    onClick={addToCart}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
                    size="lg"
                  >
                    <ShoppingCart size={20} className="mr-2" weight="bold" />
                    Add to Cart
                  </Button>
                  <div className="flex flex-col items-center gap-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs text-muted-foreground">Secure payment with</span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-5 px-1.5 bg-card border border-border rounded flex items-center justify-center">
                          <svg viewBox="0 0 48 32" className="h-3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="32" rx="3" fill="#1434CB"/>
                            <path d="M21.5 8L18 24h-3l3.5-16h3zm13.5 10.5l1.8-5 1 5h-2.8zm3.5 5.5h2.7l-2.3-16h-2.5c-.5 0-1 .3-1.2.8l-4.2 15.2h3.2l.6-1.8h3.9l.8 1.8zm-8-5.3c0-4.2-5.8-4.4-5.7-6.3 0-.6.6-1.2 1.8-1.3.6 0 2.3-.1 4.2.7l.8-3.6c-1-.4-2.4-.7-4.1-.7-3.4 0-5.8 1.8-5.8 4.4 0 1.9 1.7 3 3 3.6 1.4.7 1.8 1.1 1.8 1.7 0 .9-1.1 1.3-2.1 1.3-1.8 0-2.7-.3-4.2-1l-.7 3.6c1 .4 2.7.8 4.5.8 3.6.1 6-1.7 6-4.5l.5.3zM17.5 8l-5.5 16h-3.2L6.5 11.2c-.2-.7-.3-1-.9-1.3C4.8 9.4 3.2 9 2 8.7l.1-.7h5.2c.7 0 1.3.5 1.5 1.3l1.3 7.1L13.5 8h3z" fill="white"/>
                          </svg>
                        </div>
                        <div className="h-5 px-1.5 bg-card border border-border rounded flex items-center justify-center">
                          <svg viewBox="0 0 48 32" className="h-3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="32" rx="3" fill="#EB001B"/>
                            <circle cx="20" cy="16" r="10" fill="#EB001B"/>
                            <circle cx="28" cy="16" r="10" fill="#F79E1B"/>
                            <path d="M24 8a9.96 9.96 0 00-4 8c0 3.26 1.56 6.16 4 8a9.96 9.96 0 004-8c0-3.26-1.56-6.16-4-8z" fill="#FF5F00"/>
                          </svg>
                        </div>
                        <div className="h-5 px-1.5 bg-card border border-border rounded flex items-center justify-center">
                          <svg viewBox="0 0 48 32" className="h-3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="32" rx="3" fill="#016FD0"/>
                            <path d="M15.5 11.8l-2.2 8.4h-2.2l2.2-8.4h2.2zm11.8 5.5l1.2-3.3.7 3.3h-1.9zm2.5 2.9h2l-1.7-8.4h-1.9c-.4 0-.8.2-.9.6l-3.3 7.8h2.3l.5-1.2h2.8l.2 1.2zm-5.5-2.7c0-2.2-3-2.3-3-3.3 0-.3.3-.6.9-.7.3 0 1.2 0 2.2.4l.4-1.9c-.5-.2-1.3-.4-2.2-.4-2.3 0-3.9 1.2-3.9 2.9 0 1.3 1.1 2 2 2.4.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.4.9-1.2 0-1.8-.2-2.8-.7l-.5 2.4c.6.3 1.8.5 3 .5 2.5 0 4.1-1.2 4.1-3.1v-.5zm-9-6.2l-3.7 8.4h-2.4l-1.8-7c-.1-.4-.2-.5-.6-.7-.6-.3-1.7-.6-2.6-.8l.1-.4h4.5c.6 0 1.1.4 1.2 1.1l1.1 5.9 2.8-7h2.4z" fill="white"/>
                          </svg>
                        </div>
                        <div className="h-5 px-1.5 bg-card border border-border rounded flex items-center justify-center">
                          <svg viewBox="0 0 48 32" className="h-3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="32" rx="3" fill="#00457C"/>
                            <path d="M19.5 11.2c-2.8 0-5.1 2.3-5.1 5.1s2.3 5.1 5.1 5.1c1.2 0 2.4-.4 3.3-1.2l1.4 1.4c-1.3 1.2-3 1.9-4.7 1.9-4 0-7.2-3.2-7.2-7.2s3.2-7.2 7.2-7.2c1.7 0 3.4.7 4.7 1.9l-1.4 1.4c-.9-.7-2.1-1.2-3.3-1.2zm8.8-.9v11.8h-2v-11.8h2zm8.4 0l4.8 11.8h-2.2l-1-2.5h-5.1l-1 2.5h-2.2l4.8-11.8h1.9zm-2.8 7.5h3.6l-1.8-4.5-1.8 4.5z" fill="#009CDE"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/5 border border-accent/20 rounded-md">
                        <ShieldCheck size={16} weight="fill" className="text-accent" />
                        <span className="text-xs font-medium text-foreground">SSL Secured</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/5 border border-accent/20 rounded-md">
                        <Lock size={16} weight="fill" className="text-accent" />
                        <span className="text-xs font-medium text-foreground">Safe Checkout</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    In stock • Ready for customization
                  </p>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      const element = document.getElementById('contact')
                      element?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                    size="lg"
                  >
                    <Sparkle size={20} className="mr-2" weight="fill" />
                    Request Consultation
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Custom made to order • Contact us for details
                  </p>
                </>
              )}
              <p className="text-xs text-muted-foreground text-center">
                Free delivery across the UK • 10-year warranty included
              </p>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24"
          >
            <h2 className="font-heading text-3xl font-medium text-foreground mb-8">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => navigate(`/product/${relatedProduct.slug}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-heading text-xl font-medium mb-2">{relatedProduct.name}</h3>
                  <p className="text-2xl font-heading font-medium text-primary">
                    £{relatedProduct.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <ReviewsSection reviews={reviews} productName={product.name} />
        </div>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <Toaster />
    </>
  )
}
