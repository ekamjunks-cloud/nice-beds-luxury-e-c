# Migration Guide: Spark KV to PostgreSQL

## Overview

This guide explains how to migrate your Nice Beds ecommerce app from the client-side `spark.kv` persistence to a PostgreSQL database with a proper backend API.

## Current Architecture (Spark KV)

```
┌─────────────┐
│   Browser   │
│  (React)    │
│             │
│ ┌─────────┐ │
│ │ spark.kv│ │ ← All data stored in browser
│ └─────────┘ │
└─────────────┘
```

**Limitations:**
- Data only stored in user's browser
- No data sharing between users
- No server-side validation
- Cart/wishlist not synced across devices
- Admin panel cannot manage real data
- No real authentication

## Target Architecture (PostgreSQL)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │         │   Backend   │         │  PostgreSQL │
│  (React)    │ ←API→   │  (Node.js)  │ ←SQL→   │  Database   │
│             │         │   Express   │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

**Benefits:**
- Centralized data storage
- Multi-user support
- Real authentication
- Cart/wishlist synced across devices
- Admin panel with real control
- Proper order management

## Migration Steps

### Phase 1: Backend Setup

#### 1.1 Create Backend Project

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express pg cors dotenv bcrypt jsonwebtoken
npm install -D @types/node @types/express @types/pg @types/bcrypt @types/jsonwebtoken typescript ts-node nodemon

# Create TypeScript config
npx tsc --init
```

#### 1.2 Database Setup

```bash
# Create PostgreSQL database
createdb nicebeds

# Run schema
psql nicebeds < ../schema.sql

# Verify
psql nicebeds -c "\dt"
```

#### 1.3 Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # PostgreSQL connection
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   └── errorHandler.ts     # Error handling
│   ├── routes/
│   │   ├── products.ts          # Product endpoints
│   │   ├── customers.ts         # Customer endpoints
│   │   ├── auth.ts              # Login/signup
│   │   ├── cart.ts              # Cart endpoints
│   │   ├── orders.ts            # Order endpoints
│   │   ├── reviews.ts           # Review endpoints
│   │   └── admin.ts             # Admin endpoints
│   ├── controllers/
│   │   └── ...                  # Business logic
│   ├── models/
│   │   └── ...                  # Database queries
│   └── server.ts                # Express app
├── .env                         # Environment variables
├── package.json
└── tsconfig.json
```

#### 1.4 Sample Backend Code

**database.ts**
```typescript
import { Pool } from 'pg'

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'nicebeds',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
})

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params)
}
```

**server.ts**
```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/products', require('./routes/products'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/admin', require('./routes/admin'))

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

**routes/products.ts**
```typescript
import { Router } from 'express'
import { query } from '../config/database'

const router = Router()

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM v_product_catalog 
      WHERE is_active = true 
      ORDER BY created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// Get single product
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const result = await query(
      'SELECT * FROM v_product_catalog WHERE slug = $1',
      [slug]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

export default router
```

**routes/auth.ts**
```typescript
import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query } from '../config/database'

const router = Router()

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body
    
    // Check if user exists
    const existing = await query(
      'SELECT id FROM customers WHERE email = $1',
      [email]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' })
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    
    // Create customer
    const result = await query(
      `INSERT INTO customers (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, last_name`,
      [email, passwordHash, firstName, lastName]
    )
    
    // Generate JWT
    const token = jwt.sign(
      { userId: result.rows[0].id, email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    res.json({
      token,
      user: result.rows[0]
    })
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Get user
    const result = await query(
      'SELECT * FROM customers WHERE email = $1',
      [email]
    )
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const user = result.rows[0]
    
    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Update last login
    await query(
      'UPDATE customers SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    )
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router
```

### Phase 2: Frontend Updates

#### 2.1 Create API Client

**src/lib/api.ts**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

class ApiClient {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    const token = localStorage.getItem('auth_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint)
  }

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

export const api = new ApiClient()
```

#### 2.2 Update Hooks

**Before (use-products.ts)**
```typescript
import { useKV } from '@github/spark/hooks'

export function useProducts() {
  const [products] = useKV('products', [])
  return { products }
}
```

**After (use-products.ts)**
```typescript
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Product } from '@/lib/types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const data = await api.get<Product[]>('/products')
        setProducts(data)
      } catch (err) {
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  return { products, loading, error }
}
```

**Before (use-cart.ts)**
```typescript
import { useKV } from '@github/spark/hooks'

export function useCart() {
  const [items, setItems] = useKV('cart', [])
  
  const addToCart = (item) => {
    setItems(current => [...current, item])
  }
  
  return { items, addToCart }
}
```

**After (use-cart.ts)**
```typescript
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { CartItem } from '@/lib/types'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  async function fetchCart() {
    try {
      const data = await api.get<CartItem[]>('/cart')
      setItems(data)
    } catch (err) {
      console.error('Failed to load cart', err)
    } finally {
      setLoading(false)
    }
  }

  async function addToCart(productId: string, variantId?: string, quantity = 1) {
    try {
      const item = await api.post<CartItem>('/cart/items', {
        productId,
        variantId,
        quantity
      })
      setItems(current => [...current, item])
      return item
    } catch (err) {
      console.error('Failed to add to cart', err)
      throw err
    }
  }

  async function removeFromCart(itemId: string) {
    try {
      await api.delete(`/cart/items/${itemId}`)
      setItems(current => current.filter(item => item.id !== itemId))
    } catch (err) {
      console.error('Failed to remove from cart', err)
      throw err
    }
  }

  return { items, loading, addToCart, removeFromCart, refresh: fetchCart }
}
```

#### 2.3 Create Auth Context

**src/contexts/AuthContext.tsx**
```typescript
import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchUser() {
    try {
      const userData = await api.get<User>('/auth/me')
      setUser(userData)
    } catch (err) {
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const { token, user } = await api.post<{ token: string; user: User }>('/auth/login', {
      email,
      password
    })
    localStorage.setItem('auth_token', token)
    setUser(user)
  }

  async function signup(email: string, password: string, firstName: string, lastName: string) {
    const { token, user } = await api.post<{ token: string; user: User }>('/auth/signup', {
      email,
      password,
      firstName,
      lastName
    })
    localStorage.setItem('auth_token', token)
    setUser(user)
  }

  function logout() {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### Phase 3: Data Migration

#### 3.1 Export Current Data

```typescript
// Create a migration script
async function exportCurrentData() {
  const products = await spark.kv.get('products')
  const customers = await spark.kv.get('customers')
  const orders = await spark.kv.get('orders')
  
  const exportData = {
    products,
    customers,
    orders,
    exportedAt: new Date().toISOString()
  }
  
  // Download as JSON
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json' 
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'nicebeds-export.json'
  a.click()
}
```

#### 3.2 Import to PostgreSQL

```typescript
// Backend script: import-data.ts
import fs from 'fs'
import { query } from './config/database'

async function importData() {
  const data = JSON.parse(fs.readFileSync('nicebeds-export.json', 'utf-8'))
  
  // Import products
  for (const product of data.products || []) {
    await query(
      `INSERT INTO products (name, slug, description, category, base_price, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [product.name, product.slug, product.description, product.category, product.price, true]
    )
  }
  
  console.log('Data imported successfully')
}

importData()
```

### Phase 4: Environment Setup

#### 4.1 Backend .env

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nicebeds
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_change_this

# Server
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

#### 4.2 Frontend .env

```env
VITE_API_URL=http://localhost:3001/api
```

### Phase 5: Deployment

#### 5.1 Deploy Database

**Option A: Render (Free tier available)**
```yaml
# Create PostgreSQL database on Render
# Copy connection string
```

**Option B: Supabase (Free tier available)**
```yaml
# Create project on Supabase
# Use provided PostgreSQL connection
```

**Option C: Railway (Free tier available)**
```yaml
# Deploy PostgreSQL on Railway
# Get connection string
```

#### 5.2 Deploy Backend

**Render:**
```yaml
# render.yaml
services:
  - type: web
    name: nicebeds-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: nicebeds
          property: connectionString
```

**Railway:**
```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 5.3 Deploy Frontend

Update Vite config for production:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://your-backend.onrender.com/api'
    )
  }
})
```

## Comparison: Before & After

### Before (Spark KV)
```typescript
// All data in browser, no sync
const [cart] = useKV('cart', [])
const [products] = useKV('products', [])
```

### After (PostgreSQL)
```typescript
// Data in database, synced across devices
const { cart } = useCart() // Fetches from API
const { products } = useProducts() // Fetches from API
```

## Testing the Migration

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

3. **Test Endpoints**
   ```bash
   # Products
   curl http://localhost:3001/api/products
   
   # Login
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

## Rollback Plan

If issues occur:
1. Keep `spark.kv` implementation as fallback
2. Use feature flags to toggle between systems
3. Gradual migration (products first, then cart, then orders)

## Timeline Estimate

- **Phase 1 (Backend Setup)**: 2-3 days
- **Phase 2 (Frontend Updates)**: 3-4 days
- **Phase 3 (Data Migration)**: 1 day
- **Phase 4 (Environment Setup)**: 1 day
- **Phase 5 (Deployment)**: 1-2 days
- **Total**: ~2 weeks

## Support Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Authentication](https://jwt.io/)
- [Render Deployment](https://render.com/docs)

---

**Need Help?** Contact the development team for assistance with migration.
