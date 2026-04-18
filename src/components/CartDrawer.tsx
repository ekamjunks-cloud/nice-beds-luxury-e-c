import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Minus, Plus, X, ShoppingBag } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { CartItem as CartItemType } from '@/lib/types'
import { toast } from 'sonner'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const [cart, setCart] = useKV<CartItemType[]>('cart', [])

  const updateQuantity = (productId: string, itemIndex: number, delta: number) => {
    setCart((currentCart) => {
      const newCart = [...(currentCart || [])]
      const item = newCart[itemIndex]
      
      if (!item) return currentCart || []

      const newQuantity = item.quantity + delta
      
      if (newQuantity <= 0) {
        toast.success('Item removed from cart')
        newCart.splice(itemIndex, 1)
        return newCart
      }

      newCart[itemIndex] = { ...item, quantity: newQuantity }
      return newCart
    })
  }

  const removeItem = (productId: string, itemIndex: number) => {
    setCart((currentCart) => {
      const newCart = [...(currentCart || [])]
      newCart.splice(itemIndex, 1)
      return newCart
    })
    toast.success('Item removed from cart')
  }

  const total = (cart || []).reduce((sum, item) => {
    const itemPrice = item.product.price + (item.customizationPrice || 0)
    return sum + (itemPrice * item.quantity)
  }, 0)
  const itemCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-heading text-3xl">Your Cart</SheetTitle>
        </SheetHeader>

        {(cart || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <ShoppingBag size={64} weight="thin" className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">Your cart is empty</p>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="mt-4"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 mt-8 h-[calc(100vh-280px)]">
              <div className="space-y-4">
                {(cart || []).map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className="flex gap-4 py-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-heading text-lg font-medium">
                            {item.product.name}
                          </h4>
                          {item.customization && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.customization.size} • {item.customization.fabric} • {item.customization.color}
                              {item.customization.ottomanStorage && ' • Ottoman'}
                              {item.customization.metalBase && ' • Metal Base'}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mt-1"
                          onClick={() => removeItem(item.product.id, index)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        £{item.product.price.toLocaleString()}
                        {item.customizationPrice && item.customizationPrice > 0 && (
                          <span> + £{item.customizationPrice.toLocaleString()} custom</span>
                        )}
                      </p>
                      {item.customizationPrice && item.customizationPrice > 0 && (
                        <p className="text-sm font-medium text-primary mb-2">
                          Total: £{(item.product.price + item.customizationPrice).toLocaleString()}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, index, -1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, index, 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-6 mt-auto">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items ({itemCount})</span>
                  <span className="font-medium">£{total.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-heading text-lg font-medium">Total</span>
                  <span className="font-heading text-2xl font-medium text-primary">
                    £{total.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300">
                Request Quote
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                We'll contact you to discuss delivery and customization options
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
