# 🗄️ Nice Beds Backend API - Quick Reference

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy example env file
cp .env.example .env.local

# Add your Neon database URL and JWT secret
nano .env.local
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

Go to [Neon Console](https://console.neon.tech/) and run `schema.sql`

### 4. Start Development

```bash
npm run dev
```

API will be available at `http://localhost:5173/api/*`

---

## 📡 API Endpoints Reference

### Authentication

| Endpoint | Method | Body | Headers | Response |
|----------|--------|------|---------|----------|
| `/api/auth/signup` | POST | `{ email, password, firstName, lastName, phone? }` | - | `{ success, user, token }` |
| `/api/auth/login` | POST | `{ email, password }` | - | `{ success, user, token }` |
| `/api/auth/me` | GET | - | `Authorization: Bearer {token}` | `{ user }` |

### Example Usage

```typescript
// Signup
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'customer@example.com',
    password: 'securePassword123',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+441234567890'
  })
})
const { user, token } = await response.json()

// Save token
localStorage.setItem('auth_token', token)

// Use token in subsequent requests
const cartResponse = await fetch('/api/cart', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
```

---

## 🗂️ Database Schema Overview

### Core Tables

- **customers** - User accounts with authentication
- **products** - Product catalog
- **product_variants** - Size, fabric, color options
- **product_images** - Product images
- **carts** - Shopping carts
- **cart_items** - Items in carts
- **wishlist_items** - Saved products
- **orders** - Customer orders
- **order_items** - Order line items
- **reviews** - Product reviews
- **admin_users** - Admin panel users
- **coupons** - Discount codes

### Relationship Diagram

```
customers
  ├─→ carts → cart_items → products
  ├─→ wishlist_items → products
  ├─→ orders → order_items → products
  ├─→ reviews → products
  └─→ addresses

products
  ├─→ product_variants
  ├─→ product_images
  └─→ product_tags
```

---

## 🔐 Security Features

✅ **Password Hashing** - bcrypt with salt rounds  
✅ **JWT Authentication** - Secure token-based auth  
✅ **SQL Injection Prevention** - Parameterized queries  
✅ **HTTPS Only** - SSL/TLS encryption  
✅ **Environment Variables** - Secrets not in code  
✅ **Token Expiration** - 30-day JWT expiry  

---

## 🔄 Migrating from Spark KV

The app currently uses Spark KV. To migrate to Neon:

### 1. Update Authentication Hook (`src/hooks/use-auth.ts`)

Replace Spark KV calls with API calls:

```typescript
// OLD: Spark KV
const [user, setUser] = useKV('current-user', null)

// NEW: Neon API
const [user, setUser] = useState(null)
const [token, setToken] = useState(localStorage.getItem('auth_token'))

const login = async (email: string, password: string) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  if (res.ok) {
    const { user, token } = await res.json()
    localStorage.setItem('auth_token', token)
    setUser(user)
    setToken(token)
    return { success: true }
  }
  
  return { success: false, error: 'Login failed' }
}
```

### 2. Update Cart Hook (`src/hooks/use-cart.ts`)

```typescript
// OLD: Spark KV
const [cart, setCart] = useKV('cart', [])

// NEW: Neon API
const [cart, setCart] = useState([])

useEffect(() => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    fetch('/api/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setCart(data.items))
  }
}, [])

const addToCart = async (product, variant, customizations) => {
  const token = localStorage.getItem('auth_token')
  const res = await fetch('/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ product, variant, customizations })
  })
  
  if (res.ok) {
    // Refetch cart
    const data = await res.json()
    setCart(data.items)
  }
}
```

---

## 📦 Environment Variables

Required in `.env.local` (development) and Vercel (production):

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host.neon.tech/db?sslmode=require` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `super-secret-key-change-in-production` |

---

## 🚢 Deployment Checklist

### Pre-Deploy

- [ ] Database schema created in Neon
- [ ] `.env.local` configured locally
- [ ] All environment variables added to Vercel
- [ ] Code tested locally
- [ ] Migration from Spark KV completed (if applicable)

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Post-Deploy

- [ ] Test API endpoints on production
- [ ] Verify database connectivity
- [ ] Test authentication flow
- [ ] Check error logs in Vercel dashboard

---

## 🐛 Common Issues & Solutions

### "DATABASE_URL is not set"
**Solution:** Add to `.env.local` or Vercel environment variables

### "Cannot find module '@vercel/node'"
**Solution:** `npm install @vercel/node --save-dev`

### "CORS error when calling API"
**Solution:** Ensure API calls use relative paths (`/api/...`) not absolute URLs

### "JWT malformed"
**Solution:** Check token is being sent correctly in `Authorization: Bearer {token}` header

### "Password hash comparison failed"
**Solution:** Ensure you're using bcrypt consistently, check salt rounds match

---

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/) - Decode and verify JWT tokens

---

## 🎯 Next Steps

1. **Create remaining API endpoints** following patterns in created files
2. **Update frontend hooks** to call APIs instead of Spark KV
3. **Test authentication flow** end-to-end
4. **Deploy to Vercel** for production use
5. **Monitor database** in Neon console

---

**Need help?** Check `BACKEND_NEON_IMPLEMENTATION.md` for detailed implementation guide.
