import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useWishlist } from '@/hooks/use-wishlist'
import { BedCustomization } from '@/lib/types'
import { Trash, ShoppingCart, Heart } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface WishlistDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formatCustomizationDetails = (customization?: BedCustomization) => {
  if (!customization) return null

  const details = []
  
  details.push(`Size: ${customization.size}`)
  details.push(`${customization.fabric} - ${customization.color}`)
  
  const extras = []
  if (customization.ottomanStorage) extras.push('Ottoman Storage')
  if (customization.gasLift) extras.push('Gas Lift')
  if (customization.metalBase) extras.push('Metal Base')
  extras.push(`Base: ${customization.baseType}`)
  
  if (extras.length > 0) {
    details.push(extras.join(' • '))
  }
  
  return details
}

export function WishlistDrawer({ open, onOpenChange }: WishlistDrawerProps) {
  const { wishlist, removeFromWishlist } = useWishlist()
  const navigate = useNavigate()

  const handleViewProduct = (slug: string) => {
    onOpenChange(false)
    navigate(`/product/${slug}`)
  }

  const calculateTotalPrice = () => {
    return wishlist.reduce((sum, item) => {
      const basePrice = item.product.price
      const customPrice = item.customizationPrice || 0
      return sum + basePrice + customPrice
    }, 0)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart size={24} weight="fill" className="text-accent" />
              <DrawerTitle className="text-2xl font-heading font-medium">
                Your Wishlist
              </DrawerTitle>
              {wishlist.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                </Badge>
              )}
            </div>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto px-6 py-6 flex-1">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Heart size={40} weight="regular" className="text-muted-foreground" />
              </div>
              <h3 className="font-heading text-xl font-medium text-foreground mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Start adding your favorite beds to save them for later
              </p>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {wishlist.map((item) => {
                  const customizationDetails = formatCustomizationDetails(item.customization)
                  const itemTotalPrice = item.product.price + (item.customizationPrice || 0)
                  
                  return (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div 
                        className="w-32 h-32 flex-shrink-0 cursor-pointer"
                        onClick={() => handleViewProduct(item.product.slug)}
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 py-4 pr-4 flex flex-col justify-between">
                        <div>
                          <h4
                            onClick={() => handleViewProduct(item.product.slug)}
                            className="font-heading text-lg font-medium text-foreground hover:text-primary transition-colors cursor-pointer mb-1"
                          >
                            {item.product.name}
                          </h4>
                          {customizationDetails ? (
                            <div className="mb-2 space-y-1">
                              {customizationDetails.map((detail, idx) => (
                                <p key={idx} className="text-xs text-muted-foreground">
                                  {detail}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {item.product.description}
                            </p>
                          )}
                          <div className="flex items-baseline gap-2">
                            <p className="text-xl font-heading font-medium text-primary">
                              £{itemTotalPrice.toLocaleString()}
                            </p>
                            {item.customizationPrice && item.customizationPrice > 0 && (
                              <p className="text-xs text-muted-foreground">
                                (Base: £{item.product.price.toLocaleString()} + £{item.customizationPrice.toLocaleString()})
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleViewProduct(item.product.slug)}
                            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                          >
                            <ShoppingCart size={16} weight="regular" className="mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromWishlist(item.product.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive border-border"
                          >
                            <Trash size={16} weight="regular" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {wishlist.length > 0 && (
          <>
            <Separator />
            <div className="px-6 py-4 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </span>
                <span className="text-lg font-heading font-medium text-foreground">
                  Total: £{calculateTotalPrice().toLocaleString()}
                </span>
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
