# 🚀 Neon Database Backend - Complete Implementation Guide

## ✅ What's Been Done

I've set up the foundational backend infrastructure to connect your Nice Beds application to a **Neon PostgreSQL database** on Vercel:

### 1. **Database Configuration** (`/api/config/database.ts`)
- Neon serverless database connection using `@neondatabase/serverless`
- Query function with error handling and logging
- Environment variable configuration for `DATABASE_URL`

### 2. **Authentication API Endpoints**
- `POST /api/auth/signup` - User registration with bcrypt password hashing
- `POST /api/auth/login` - User authentication with JWT token generation
- `GET /api/auth/me` - Get current user from JWT token

### 3. **Database Schema** (`schema.sql`)
- Complete PostgreSQL schema with 26 tables
- Indexes for performance optimization
- Triggers for auto-updating timestamps
- Views for common dashboard queries

### 4. **Vercel Configuration** (`vercel.json`)
- Serverless function routing
- Environment variable mapping

### 5. **Documentation** (`NEON_DATABASE_SETUP.md`)
- Step-by-step setup instructions
- Environment variable configuration
- Deployment guide

---

## 🔧 Complete Setup Instructions

### Step 1: Create Neon Database

1. Go to https://console.neon.tech/
2. Click "Create Project"
3. Name it "nice-beds-db"
4. Copy the connection string (starts with `postgresql://`)

### Step 2: Initialize Database Schema

#### Option A: Using psql
```bash
psql "your-neon-connection-string" < schema.sql
```

#### Option B: Using Neon Console
1. Go to your Neon project
2. Click "SQL Editor"
3. Paste the entire contents of `schema.sql`
4. Click "Run"

### Step 3: Set Environment Variables

#### Local Development
Create `.env.local` in project root:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=super-secret-random-string-change-this-32-characters-minimum
```

#### Vercel Production
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - Key: `DATABASE_URL`, Value: Your Neon connection string
   - Key: `JWT_SECRET`, Value: Generate a strong random string

### Step 4: Install Required Dependencies

Already installed:
- ✅ `@neondatabase/serverless` - Neon database driver
- ✅ `bcryptjs` - Password hashing
- ✅ `jsonwebtoken` - JWT authentication

### Step 5: Add Vercel Package

```bash
npm install @vercel/node --save-dev
```

---

## 📁 Backend API Structure

```
/api
├── /config
│   └── database.ts          # Database connection & query function
├── /auth
│   ├── signup.ts           # POST /api/auth/signup
│   ├── login.ts            # POST /api/auth/login
│   └── me.ts               # GET /api/auth/me
├── /products
│   ├── index.ts            # GET /api/products (list all)
│   ├── [id].ts             # GET /api/products/:id
│   └── create.ts           # POST /api/products (admin)
├── /cart
│   ├── index.ts            # GET /api/cart
│   ├── add.ts              # POST /api/cart/add
│   ├── update.ts           # PUT /api/cart/update
│   └── remove.ts           # DELETE /api/cart/remove
├── /wishlist
│   ├── index.ts            # GET /api/wishlist
│   ├── add.ts              # POST /api/wishlist/add
│   └── remove.ts           # DELETE /api/wishlist/remove
├── /orders
│   ├── index.ts            # GET /api/orders
│   ├── [id].ts             # GET /api/orders/:id
│   └── create.ts           # POST /api/orders
└── /admin
    ├── dashboard.ts        # GET /api/admin/dashboard
    ├── orders.ts           # GET /api/admin/orders
    └── products.ts         # GET/POST/PUT /api/admin/products
```

---

## 🔐 Authentication Flow

### Signup Process
```typescript
POST /api/auth/signup
Body: {
  email: "user@example.com",
  password: "securepassword",
  firstName: "John",
  lastName: "Doe",
  phone: "+44123456789"
}

Response: {
  success: true,
  user: { id, email, firstName, lastName, phone },
  token: "jwt-token-here"
}
```

### Login Process
```typescript
POST /api/auth/login
Body: {
  email: "user@example.com",
  password: "securepassword"
}

Response: {
  success: true,
  user: { id, email, firstName, lastName, phone },
  token: "jwt-token-here"
}
```

### Using JWT Token
```typescript
// Store token in localStorage
localStorage.setItem('auth_token', token)

// Add to API requests
fetch('/api/cart', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 🛠️ Next Steps: Creating Remaining API Endpoints

### Products API (`/api/products/index.ts`)
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { query } from '../config/database'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const products = await query(`
      SELECT 
        p.id, p.slug, p.name, p.description, p.base_price,
        p.category, p.is_featured, p.stock_status,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
    `)

    res.status(200).json({ products })
  } catch (error) {
    console.error('Products fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}
```

### Cart API (`/api/cart/index.ts`)
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { query } from '../config/database'

const JWT_SECRET = process.env.JWT_SECRET!

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    // Get or create cart for user
    let carts = await query(
      'SELECT id FROM carts WHERE customer_id = $1 AND status = $2',
      [decoded.userId, 'active']
    )

    let cartId
    if (carts.length === 0) {
      const newCart = await query(
        'INSERT INTO carts (customer_id, status) VALUES ($1, $2) RETURNING id',
        [decoded.userId, 'active']
      )
      cartId = newCart[0].id
    } else {
      cartId = carts[0].id
    }

    // Get cart items
    const items = await query(`
      SELECT 
        ci.id, ci.quantity, ci.price_at_addition, ci.customizations,
        p.name as product_name, p.slug,
        pv.variant_name, pv.size, pv.fabric_type, pv.fabric_color
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE ci.cart_id = $1
    `, [cartId])

    res.status(200).json({ items })
  } catch (error) {
    console.error('Cart fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
}
```

---

## 🔄 Migration from Spark KV to Neon PostgreSQL

### Update Frontend Hooks

#### Before (Spark KV):
```typescript
const [user, setUser] = useKV('current-user', null)
```

#### After (Neon PostgreSQL):
```typescript
const [user, setUser] = useState(null)
const [token, setToken] = useState(localStorage.getItem('auth_token'))

useEffect(() => {
  if (token) {
    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setUser(data.user))
  }
}, [token])
```

### Data Migration Script
```typescript
// migrate-data.ts
import { kv } from '@github/spark/kv'

async function migrateUsers() {
  const users = await kv.get('users')
  
  for (const [email, userData] of Object.entries(users)) {
    await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'temp-password-reset-required',
        firstName: userData.name.split(' ')[0],
        lastName: userData.name.split(' ')[1] || '',
        phone: userData.phone
      })
    })
  }
}
```

---

## 🚀 Deployment to Vercel

### 1. Connect GitHub Repository
```bash
# Push your code to GitHub
git add .
git commit -m "Add Neon database backend"
git push origin main
```

### 2. Import to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables (DATABASE_URL, JWT_SECRET)
4. Click "Deploy"

### 3. Test API Endpoints
```bash
# Test signup
curl -X POST https://your-app.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User"}'

# Test login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 📊 Database Management

### View Data in Neon Console
1. Go to Neon Console → SQL Editor
2. Run queries:
```sql
-- View all customers
SELECT * FROM customers ORDER BY created_at DESC;

-- View all products
SELECT * FROM products WHERE is_active = true;

-- View recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Dashboard stats
SELECT * FROM v_dashboard_stats;
```

### Backup Database
```bash
# Using pg_dump (connect with your Neon connection string)
pg_dump "postgresql://..." > backup.sql
```

---

## 🎯 Benefits of Neon + Vercel

✅ **Serverless** - No server management, scales automatically  
✅ **Fast** - Neon's edge network for low latency  
✅ **Cost-effective** - Pay only for what you use  
✅ **PostgreSQL** - Full SQL capabilities, ACID compliance  
✅ **Branching** - Database branches for development/staging  
✅ **Auto-scaling** - Handles traffic spikes automatically  
✅ **Backups** - Automatic daily backups  
✅ **SSL/TLS** - Encrypted connections by default  

---

## 🐛 Troubleshooting

### Error: "DATABASE_URL is not set"
- Check `.env.local` file exists
- Verify Vercel environment variables are set
- Restart dev server after adding .env.local

### Error: "JWT Secret not configured"
- Add `JWT_SECRET` to environment variables
- Must be at least 32 characters

### Error: "Connection refused"
- Verify Neon connection string is correct
- Check if `?sslmode=require` is in connection string
- Ensure Neon project is active (not paused)

### Error: "Table does not exist"
- Run the schema.sql file in Neon console
- Verify all tables were created successfully

---

## 📝 Summary

Your Nice Beds application now has:

1. ✅ **Database connection** to Neon PostgreSQL
2. ✅ **Authentication system** with signup/login/JWT
3. ✅ **Complete database schema** (26 tables)
4. ✅ **Vercel configuration** for serverless deployment
5. ✅ **Documentation** for setup and deployment

### Ready to Deploy!

Follow the setup steps above, and your application will be connected to a production-ready Neon database on Vercel.

For additional API endpoints (products, cart, wishlist, orders, admin), use the patterns shown in this guide.
