# Backend API Quick Reference

This is a quick reference guide for developers working with the Nice Beds backend.

## Table of Contents
- [Authentication](#authentication)
- [Products](#products)
- [Shopping Cart](#shopping-cart)
- [Wishlist](#wishlist)
- [Orders](#orders)
- [Admin Operations](#admin-operations)

---

## Authentication

### Import
```typescript
import { useAuth } from '@/hooks/use-auth'
```

### Usage
```typescript
function MyComponent() {
  const { user, isAuthenticated, login, signup, logout } = useAuth()
  
  // Check if user is logged in
  if (isAuthenticated) {
    console.log('Logged in as:', user?.name)
  }
  
  // Sign up new user
  const handleSignup = async () => {
    const result = await signup('user@example.com', 'password123', 'John Doe')
    if (result.success) {
      console.log('Account created!')
    } else {
      console.error(result.error)
    }
  }
  
  // Login existing user
  const handleLogin = async () => {
    const result = await login('user@example.com', 'password123')
    if (result.success) {
      console.log('Logged in!')
    } else {
      console.error(result.error)
    }
  }
  
  // Logout
  const handleLogout = () => {
    logout()
  }
}
```

### Available Data
```typescript
user: {
  id: string          // Unique user ID
  email: string       // User email
  name: string        // User full name
  phone?: string      // Optional phone
  createdAt: number   // Account creation timestamp
}
```

---

## Products

### Import
```typescript
import { useProducts } from '@/hooks/use-products'
```

### Usage
```typescript
function ProductList() {
  const { 
    products,              // All products
    getProductById,        // Get by ID
    getProductBySlug,      // Get by URL slug
    getProductsByCategory, // Filter by category
    getInStockProducts     // Only in-stock items
  } = useProducts()
  
  // Get all products
  console.log('All products:', products)
  
  // Get specific product by slug
  const product = getProductBySlug('royal-velvet-bed')
  
  // Get upholstered beds only
  const upholstered = getProductsByCategory('upholstered')
  
  // Get available items
  const available = getInStockProducts()
}
```

### Product Structure
```typescript
Product {
  id: string
  name: string
  slug: string           // URL-friendly identifier
  price: number          // Base price in GBP
  description: string
  category: 'upholstered' | 'bespoke'
  dimensions: {
    width: number
    length: number
    height: number
  }
  materials: string[]
  colors: string[]
  images: string[]       // Array of image URLs
  features: string[]
  inStock: boolean
}
```

---

## Shopping Cart

### Import
```typescript
import { useCart } from '@/hooks/use-cart'
```

### Usage
```typescript
function Cart() {
  const { 
    cart,           // Cart items
    cartTotal,      // Total price
    cartCount,      // Total items
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart()
  
  // Add product to cart
  const handleAddToCart = () => {
    const customization = {
      size: 'King',
      fabric: 'Plush Velvet',
      color: 'Navy Blue',
      ottomanStorage: true,
      gasLift: true,
      metalBase: false,
      baseType: 'Slats'
    }
    
    addToCart(
      product,           // Product object
      1,                 // Quantity
      'Navy Blue',       // Selected color
      customization,     // Full customization
      150                // Customization price
    )
  }
  
  // Remove item (by array index)
  const handleRemove = (index: number) => {
    removeFromCart(index)
  }
  
  // Update quantity
  const handleIncrement = (index: number) => {
    updateQuantity(index, 1)   // +1
  }
  
  const handleDecrement = (index: number) => {
    updateQuantity(index, -1)  // -1
  }
  
  // Clear entire cart
  const handleClear = () => {
    clearCart()
  }
  
  // Display cart total
  return (
    <div>
      <p>Items: {cartCount}</p>
      <p>Total: £{cartTotal.toFixed(2)}</p>
    </div>
  )
}
```

### Cart Item Structure
```typescript
CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  customization?: BedCustomization
  customizationPrice?: number
}
```

### Customization Structure
```typescript
BedCustomization {
  size: 'Double' | 'King' | 'Super King' | 'Custom'
  customSize?: {
    width: string
    length: string
  }
  fabric: 'Naples' | 'Plush Velvet'
  color: string
  ottomanStorage: boolean
  gasLift: boolean
  metalBase: boolean
  baseType: 'Slats' | 'Board'
}
```

---

## Wishlist

### Import
```typescript
import { useWishlist } from '@/hooks/use-wishlist'
```

### Usage
```typescript
function Wishlist() {
  const {
    wishlist,         // Wishlist items
    wishlistCount,    // Item count
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist
  } = useWishlist()
  
  // Add to wishlist
  const handleAddToWishlist = () => {
    addToWishlist(product, customization, customizationPrice)
  }
  
  // Remove from wishlist
  const handleRemove = (productId: string) => {
    removeFromWishlist(productId)
  }
  
  // Check if in wishlist
  const isWished = isInWishlist(product.id)
  
  // Toggle (add if not present, remove if present)
  const handleToggle = () => {
    toggleWishlist(product, customization, customizationPrice)
  }
  
  // Clear all
  const handleClear = () => {
    clearWishlist()
  }
}
```

### Wishlist Item Structure
```typescript
WishlistItem {
  product: Product
  addedAt: number                  // Timestamp
  customization?: BedCustomization
  customizationPrice?: number
}
```

---

## Orders

### Import
```typescript
import { useOrders } from '@/hooks/use-orders'
```

### Usage
```typescript
function Orders() {
  const { user } = useAuth()
  const {
    orders,           // User's orders
    allOrders,        // All orders (admin only)
    createOrder,
    updateOrderStatus,
    requestUpdate,
    updateRequests
  } = useOrders(user?.id)
  
  // Create new order
  const handlePlaceOrder = () => {
    const cartItems = [...] // from useCart
    const total = 1500
    
    const order = createOrder(user!.id, cartItems, total)
    console.log('Order created:', order.trackingNumber)
    console.log('Estimated delivery:', new Date(order.estimatedDeliveryDate))
  }
  
  // Update order status (admin only)
  const handleUpdateStatus = (orderId: string) => {
    updateOrderStatus(
      orderId,
      'in-production',
      'Your bed is now being handcrafted by our artisans'
    )
  }
  
  // Request update (customer)
  const handleRequestUpdate = (orderId: string) => {
    requestUpdate(
      orderId,
      user!.id,
      'Could you please provide an update on my order?'
    )
  }
}
```

### Order Structure
```typescript
Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'in-production' | 'quality-check' | 
          'ready-for-delivery' | 'out-for-delivery' | 'delivered'
  createdAt: number
  updatedAt: number
  estimatedDeliveryDate: number    // Timestamp (42 days from creation)
  trackingNumber: string           // Format: NB{timestamp}{random}
  statusHistory: OrderStatusUpdate[]
  shippingAddress?: {
    street: string
    city: string
    postcode: string
    country: string
  }
  notes?: string
}
```

### Order Status Update Structure
```typescript
OrderStatusUpdate {
  status: Order['status']
  timestamp: number
  note?: string
}
```

---

## Admin Operations

### Import
```typescript
import { useAdmin } from '@/hooks/use-admin'
```

### Usage
```typescript
function AdminPanel() {
  const {
    // Data
    products,
    orders,
    discounts,
    variants,
    users,
    updateRequests,
    notifications,
    stats,
    
    // Product operations
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Discount operations
    addDiscount,
    updateDiscount,
    deleteDiscount,
    
    // Variant operations
    addVariant,
    updateVariant,
    deleteVariant,
    
    // Order operations
    updateOrder,
    
    // Communication
    respondToUpdateRequest,
    addNotification,
    markNotificationRead,
    clearAllNotifications
  } = useAdmin()
  
  // Dashboard stats
  console.log('Today\'s revenue:', stats.totalRevenue)
  console.log('Pending orders:', stats.pendingOrders)
  console.log('Low stock items:', stats.lowStockProducts)
  
  // Add new product
  const handleAddProduct = () => {
    const newProduct = addProduct({
      name: 'New Luxury Bed',
      slug: 'new-luxury-bed',
      price: 1299,
      description: 'A stunning new addition',
      category: 'upholstered',
      dimensions: { width: 150, length: 200, height: 120 },
      materials: ['Velvet', 'Oak'],
      colors: ['Navy', 'Grey'],
      images: ['image1.jpg'],
      features: ['Handcrafted', 'Premium fabric'],
      inStock: true
    })
    console.log('Product added:', newProduct.id)
  }
  
  // Update product
  const handleUpdateProduct = (productId: string) => {
    updateProduct(productId, {
      price: 1499,
      inStock: false
    })
  }
  
  // Delete product (also deletes all variants)
  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId)
  }
  
  // Create discount code
  const handleCreateDiscount = () => {
    const discount = addDiscount({
      code: 'SUMMER2024',
      description: '15% off summer sale',
      discountType: 'percentage',
      value: 15,
      minPurchase: 500,
      maxUses: 100,
      validFrom: Date.now(),
      validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
      isActive: true
    })
  }
  
  // Update order
  const handleUpdateOrder = (orderId: string) => {
    updateOrder(orderId, {
      status: 'dispatched',
      notes: 'Shipped via DPD'
    })
  }
  
  // Respond to customer request
  const handleRespond = (requestId: string) => {
    respondToUpdateRequest(
      requestId,
      'Your bed is currently in the quality check phase and will be ready for delivery next week.'
    )
  }
  
  // Add admin notification
  const handleAddNotification = () => {
    addNotification({
      type: 'order',
      title: 'New Order Received',
      message: 'Order #12345 for £1,500'
    })
  }
}
```

### Admin Stats Structure
```typescript
AdminStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  pendingOrders: number
  lowStockProducts: number
  activeDiscounts: number
  recentOrders: number
}
```

### Discount Structure
```typescript
Discount {
  id: string
  code: string                    // Coupon code (e.g., 'SUMMER2024')
  description: string
  discountType: 'percentage' | 'fixed' | 'free-shipping'
  value: number                   // Percentage (15) or amount (50)
  minPurchase: number             // Minimum order value
  maxUses?: number                // Total usage limit
  usedCount: number               // Times used
  validFrom: number               // Start timestamp
  validUntil: number              // End timestamp
  isActive: boolean
  createdAt: number
}
```

### Product Variant Structure
```typescript
ProductVariant {
  id: string
  productId: string
  name: string
  size?: string
  fabric?: string
  color?: string
  priceAdjustment: number         // Added to base price
  stock: number
  sku: string                     // Stock keeping unit
}
```

---

## Common Patterns

### Creating a Complete Order Flow
```typescript
function CheckoutPage() {
  const { user } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const { createOrder } = useOrders(user?.id)
  const navigate = useNavigate()
  
  const handleCheckout = () => {
    // Create order
    const order = createOrder(user!.id, cart, cartTotal)
    
    // Clear cart
    clearCart()
    
    // Navigate to order confirmation
    navigate(`/order-confirmation/${order.id}`)
    
    // Show success message
    toast.success(`Order placed! Tracking number: ${order.trackingNumber}`)
  }
}
```

### Building a Product Page
```typescript
function ProductPage() {
  const { slug } = useParams()
  const { getProductBySlug } = useProducts()
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist } = useWishlist()
  const { addToRecentlyViewed } = useRecentlyViewed()
  
  const product = getProductBySlug(slug!)
  const [customization, setCustomization] = useState<BedCustomization>({...})
  
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product)
    }
  }, [product])
  
  const handleAddToCart = () => {
    addToCart(product, 1, customization.color, customization, 150)
  }
  
  const handleWishlist = () => {
    addToWishlist(product, customization, 150)
  }
  
  const inWishlist = isInWishlist(product.id)
}
```

### Admin Dashboard
```typescript
function Dashboard() {
  const { stats, orders, products, notifications } = useAdmin()
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Revenue" value={`£${stats.totalRevenue.toLocaleString()}`} />
        <StatCard label="Orders" value={stats.totalOrders} />
        <StatCard label="Pending" value={stats.pendingOrders} />
        <StatCard label="Products" value={stats.totalProducts} />
      </div>
      
      {/* Recent Orders */}
      <RecentOrders orders={orders.slice(0, 10)} />
      
      {/* Notifications */}
      <Notifications items={notifications} />
    </div>
  )
}
```

---

## Error Handling

All hooks handle errors gracefully and return default values:

```typescript
// If data doesn't exist in KV, hooks return empty arrays/null
const { products } = useProducts()  // [] if no products

const { cart } = useCart()          // [] if empty

const { user } = useAuth()          // null if not logged in
```

Always check for data existence:

```typescript
// ✅ Good
if (user) {
  console.log(user.name)
}

// ✅ Good
if (products.length > 0) {
  // Display products
}

// ❌ Bad
console.log(user.name)  // Error if user is null
```

---

## Performance Tips

### 1. Use Functional Updates
```typescript
// ✅ Good
setCart((current) => [...current, newItem])

// ❌ Bad
setCart([...cart, newItem])
```

### 2. Memoize Expensive Calculations
```typescript
const filteredProducts = useMemo(() => {
  return products.filter(p => p.category === 'upholstered')
}, [products])
```

### 3. Avoid Unnecessary Re-renders
```typescript
const { products } = useProducts()

// Only runs when products change
useEffect(() => {
  console.log('Products updated')
}, [products])
```

---

## TypeScript Support

All hooks are fully typed. Import types as needed:

```typescript
import { Product, CartItem, Order, User } from '@/lib/types'
import { Discount, ProductVariant, AdminStats } from '@/lib/admin-types'
```

Enable strict type checking:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

## Debugging

### Check KV Data Directly
```javascript
// In browser console
await spark.kv.keys()                    // List all keys
await spark.kv.get('admin-products')     // View products
await spark.kv.get('current-user')       // View current user
await spark.kv.get('orders')             // View all orders
```

### Clear All Data (Reset App)
```javascript
// In browser console
const keys = await spark.kv.keys()
for (const key of keys) {
  await spark.kv.delete(key)
}
```

---

## Summary

This backend provides:
- ✅ Complete authentication system
- ✅ Product catalog management
- ✅ Shopping cart with persistence
- ✅ Wishlist functionality
- ✅ Order tracking with delivery estimates
- ✅ Comprehensive admin panel
- ✅ Type-safe APIs
- ✅ Real-time data sync

All powered by **Spark KV** with zero external dependencies.
