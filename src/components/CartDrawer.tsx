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

  const updateQuantity = (productId: string, delta: number) => {
    setCart((currentCart) => {
      const existingItem = (currentCart || []).find(item => item.product.id === productId)
      if (!existingItem) return currentCart || []

      const newQuantity = existingItem.quantity + delta
      
      if (newQuantity <= 0) {
        toast.success('Item removed from cart')
        return (currentCart || []).filter(item => item.product.id !== productId)
      }

      return (currentCart || []).map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    })
  }

  const removeItem = (productId: string) => {
    setCart((currentCart) => (currentCart || []).filter(item => item.product.id !== productId))
    toast.success('Item removed from cart')
  }

  const total = (cart || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
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
                {(cart || []).map((item) => (
                  <div key={item.product.id} className="flex gap-4 py-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-heading text-lg font-medium">
                          {item.product.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mt-1"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        £{item.product.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, -1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, 1)}
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
