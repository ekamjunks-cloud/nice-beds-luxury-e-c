# Neon Database Integration Guide

## Overview

This application now connects to a **Neon PostgreSQL database** hosted on Vercel. All data persistence uses PostgreSQL instead of Spark KV.

## Setup Instructions

### 1. Create a Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy your connection string (it looks like: `postgresql://user:pass@host/dbname?sslmode=require`)

### 2. Initialize Database Schema

Run the schema creation script:

```bash
# Connect to your Neon database
psql "your-connection-string-here"

# Run the schema file
\i schema.sql
```

Or upload the `schema.sql` file directly in the Neon console SQL editor.

### 3. Configure Environment Variables

#### Local Development

Create a `.env.local` file in the root:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Vercel Deployment

Add environment variables in Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add:
   - `DATABASE_URL` = Your Neon connection string
   - `JWT_SECRET` = A secure random string

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## API Endpoints

All API endpoints are serverless functions in the `/api` directory.

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove cart item
- `DELETE /api/cart/clear` - Clear entire cart

### Wishlist

- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/:itemId` - Remove from wishlist

### Orders

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Reviews

- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id/approve` - Approve review (admin only)

### Admin

- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id` - Update order
- `GET /api/admin/customers` - All customers
- `GET /api/admin/analytics` - Analytics data

## Database Connection

The app uses `@neondatabase/serverless` for optimal Vercel serverless function performance:

```typescript
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
})

const result = await pool.query('SELECT * FROM products')
```

## Migration from Spark KV

All existing hooks (`useAuth`, `useCart`, `useWishlist`, etc.) remain the same. They now call the API endpoints instead of using Spark KV:

**Before (Spark KV):**
```typescript
const [cart, setCart] = useKV('cart', [])
```

**After (Neon PostgreSQL):**
```typescript
const { data: cart } = await fetch('/api/cart')
```

## Security

- All passwords are hashed with bcrypt
- JWT tokens for authentication
- SQL injection prevention via parameterized queries
- CORS configured for Vercel domain
- Environment variables for sensitive data

## Testing Locally

1. Install dependencies: `npm install`
2. Set up `.env.local` with your DATABASE_URL
3. Run dev server: `npm run dev`
4. API available at `http://localhost:5173/api/*`

## Production Checklist

- ✅ Database schema created in Neon
- ✅ Environment variables set in Vercel
- ✅ JWT_SECRET is a strong random string
- ✅ All API endpoints tested
- ✅ CORS configured
- ✅ Error handling implemented
- ✅ Database connection pooling configured

## Support

For issues with:
- **Neon**: Check [Neon docs](https://neon.tech/docs)
- **Vercel**: Check [Vercel docs](https://vercel.com/docs)
- **PostgreSQL**: Check [PostgreSQL docs](https://www.postgresql.org/docs/)
