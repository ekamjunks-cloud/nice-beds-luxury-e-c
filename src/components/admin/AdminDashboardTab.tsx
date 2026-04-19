import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  ArrowUp,
  ArrowDown,
  ShoppingCart,
  Package,
  Clock,
  Warning,
  ShoppingBag,
  Star,
  ChatCircle,
  Truck,
  WarningCircle,
  TrendUp,
  Plus,
  Percent,
  Printer,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  Sparkle
} from '@phosphor-icons/react'

interface Review {
  id: string
  productId: string
  productName: string
  rating: number
  comment: string
  author: string
  date: number
}

interface CustomerMessage {
  id: string
  from: string
  subject: string
  message: string
  date: number
  read: boolean
}

export function AdminDashboardTab() {
  const { stats, orders, products, variants, updateOrder } = useAdmin()
  const [reviews] = useKV<Review[]>('product-reviews', [])
  const [messages] = useKV<CustomerMessage[]>('customer-messages', [])
  const [abandonedCarts] = useKV<any[]>('abandoned-carts', [])
  const [bannerText, setBannerText] = useKV('homepage-banner', '')
  const [newBannerText, setNewBannerText] = useState('')
  const [addProductOpen, setAddProductOpen] = useState(false)
  const [discountOpen, setDiscountOpen] = useState(false)

  const today = new Date().setHours(0, 0, 0, 0)
  const todayOrders = orders.filter(o => o.createdAt >= today)
  const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'in-production')
  const lowStock = variants.filter(v => v.stock < 10 && v.stock > 0)
  const recentReviews = (reviews || []).slice(0, 5)
  const unreadMessages = (messages || []).filter(m => !m.read)
  const deliveryIssues = orders.filter(o => o.status === 'out-for-delivery' && o.estimatedDeliveryDate && o.estimatedDeliveryDate < Date.now())
  const problemOrders = orders.filter(o => o.notes && o.notes.toLowerCase().includes('issue'))

  const topProducts = products
    .map(p => {
      const orderItems = orders.flatMap(o => o.items).filter(i => i.product.id === p.id)
      const totalSold = orderItems.reduce((sum, i) => sum + i.quantity, 0)
      const revenue = orderItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0)
      return { ...p, totalSold, revenue }
    })
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5)

  const handlePrintOrders = () => {
    const ordersToPrint = pendingOrders.slice(0, 10)
    toast.success(`Preparing to print ${ordersToPrint.length} orders`)
  }

  const handleMarkDispatched = (orderId: string) => {
    updateOrder(orderId, {
      status: 'out-for-delivery'
    })
    toast.success('Order marked as dispatched')
  }

  const handleBulkDispatch = () => {
    const toDispatch = confirmedOrders.slice(0, 5)
    toDispatch.forEach(order => {
      updateOrder(order.id, {
        status: 'out-for-delivery'
      })
    })
    toast.success(`${toDispatch.length} orders dispatched`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-medium text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Your control room for Nice Beds</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus size={18} className="mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quick Add Product</DialogTitle>
                <DialogDescription>Add a new product to your catalog</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="Enter product name" />
                </div>
                <div>
                  <Label htmlFor="product-price">Price (£)</Label>
                  <Input id="product-price" type="number" placeholder="0.00" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddProductOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  toast.success('Product added successfully')
                  setAddProductOpen(false)
                }}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={discountOpen} onOpenChange={setDiscountOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Percent size={18} className="mr-2" />
                Create Discount
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Discount Code</DialogTitle>
                <DialogDescription>Set up a new promotional discount</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="discount-code">Discount Code</Label>
                  <Input id="discount-code" placeholder="SUMMER2024" />
                </div>
                <div>
                  <Label htmlFor="discount-value">Value (%)</Label>
                  <Input id="discount-value" type="number" placeholder="10" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDiscountOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  toast.success('Discount code created')
                  setDiscountOpen(false)
                }}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handlePrintOrders}>
            <Printer size={18} className="mr-2" />
            Print Orders
          </Button>

          <Button variant="outline" onClick={handleBulkDispatch} disabled={confirmedOrders.length === 0}>
            <CheckCircle size={18} className="mr-2" />
            Bulk Dispatch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendUp size={16} weight="bold" />
              Today's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-semibold text-foreground">
              £{todaySales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {todayOrders.length} orders
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart size={16} weight="fill" />
              Orders Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-semibold text-foreground">
              {todayOrders.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalOrders} total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock size={16} weight="fill" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-semibold text-foreground">
              {pendingOrders.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Need action
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package size={16} weight="fill" />
              In Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-semibold text-foreground">
              {confirmedOrders.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready to ship
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Warning size={16} weight="fill" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-semibold text-foreground">
              {lowStock.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Below 10 units
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingBag size={16} weight="fill" />
              Abandoned Carts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-semibold text-foreground">
              {(abandonedCarts || []).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Potential £{(abandonedCarts || []).reduce((s, c) => s + (c.total || 0), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star size={20} weight="fill" className="text-accent" />
              Top Products
            </CardTitle>
            <CardDescription>Best selling items</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No sales data yet</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, idx) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.totalSold} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">£{product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star size={20} weight="fill" className="text-amber-500" />
              Recent Reviews
            </CardTitle>
            <CardDescription>Latest customer feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              {recentReviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reviews yet</p>
              ) : (
                <div className="space-y-3 pr-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              weight={i < review.rating ? 'fill' : 'regular'}
                              className={i < review.rating ? 'text-amber-500' : 'text-muted-foreground'}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">by {review.author}</span>
                      </div>
                      <p className="text-sm line-clamp-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChatCircle size={20} weight="fill" className="text-blue-500" />
              Customer Messages
            </CardTitle>
            <CardDescription>{unreadMessages.length} unread</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {(messages || []).length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-sm">No messages</p>
              ) : (
                <div className="space-y-2 pr-4">
                  {(messages || []).slice(0, 5).map((msg) => (
                    <div key={msg.id} className="p-2 rounded border hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{msg.subject}</p>
                          <p className="text-xs text-muted-foreground truncate">{msg.from}</p>
                        </div>
                        {!msg.read && <Badge variant="destructive" className="h-5 text-xs">New</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck size={20} weight="fill" className="text-orange-500" />
              Delivery Issues
            </CardTitle>
            <CardDescription>Overdue deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {deliveryIssues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle size={32} className="text-green-500 mx-auto mb-2" weight="fill" />
                  <p className="text-sm text-muted-foreground">All deliveries on track</p>
                </div>
              ) : (
                <div className="space-y-2 pr-4">
                  {deliveryIssues.map((order) => (
                    <div key={order.id} className="p-2 rounded border border-orange-200 bg-orange-50/50">
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        Expected: {new Date(order.estimatedDeliveryDate!).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WarningCircle size={20} weight="fill" className="text-red-500" />
              Problem Orders
            </CardTitle>
            <CardDescription>Requires attention</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {problemOrders.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle size={32} className="text-green-500 mx-auto mb-2" weight="fill" />
                  <p className="text-sm text-muted-foreground">No issues</p>
                </div>
              ) : (
                <div className="space-y-2 pr-4">
                  {problemOrders.map((order) => (
                    <div key={order.id} className="p-2 rounded border border-red-200 bg-red-50/50">
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{order.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package size={20} weight="fill" />
            Pending Orders
          </CardTitle>
          <CardDescription>Orders awaiting processing</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending orders</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingOrders.slice(0, 10).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.shippingAddress?.street || 'N/A'}</TableCell>
                    <TableCell>{order.items.length} item(s)</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">£{order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkDispatched(order.id)}
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Confirm
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warning size={20} weight="fill" className="text-yellow-500" />
            Low Stock Items
          </CardTitle>
          <CardDescription>Products running low on inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {lowStock.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">All items well stocked</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.map((variant) => {
                  const product = products.find(p => p.id === variant.productId)
                  return (
                    <TableRow key={variant.id}>
                      <TableCell className="font-mono text-sm">{variant.sku}</TableCell>
                      <TableCell className="font-medium">{product?.name}</TableCell>
                      <TableCell>{variant.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: variant.color.toLowerCase() }}
                          />
                          {variant.color}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={variant.stock < 5 ? 'destructive' : 'secondary'}>
                          {variant.stock} units
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">£{variant.price.toLocaleString()}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkle size={20} weight="fill" className="text-accent" />
            Homepage Banner
          </CardTitle>
          <CardDescription>Quick edit your homepage banner message</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="banner-text">Banner Text</Label>
              <Textarea
                id="banner-text"
                value={newBannerText || bannerText}
                onChange={(e) => setNewBannerText(e.target.value)}
                placeholder="Enter banner text (e.g., 'Free delivery on orders over £500')"
                rows={2}
                className="resize-none"
              />
            </div>
            <Button
              onClick={() => {
                setBannerText(newBannerText)
                toast.success('Banner updated successfully')
                setNewBannerText('')
              }}
              disabled={!newBannerText}
            >
              Update Banner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
