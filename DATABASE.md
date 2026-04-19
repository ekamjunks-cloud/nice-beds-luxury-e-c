# Nice Beds Database Schema Documentation

## Overview

This PostgreSQL database schema is designed for the Nice Beds luxury ecommerce platform. It supports a complete ecommerce workflow including product management, customer accounts, shopping carts, orders, reviews, discounts, and a comprehensive admin panel.

## Database Structure

### Core Tables (11 Primary Entities)

1. **products** - Main product catalog
2. **product_variants** - Product variations (sizes, fabrics, colors)
3. **customers** - Customer accounts
4. **addresses** - Customer shipping/billing addresses
5. **carts** - Shopping carts
6. **cart_items** - Items within carts
7. **orders** - Customer orders
8. **order_items** - Line items for orders
9. **reviews** - Product reviews and ratings
10. **admin_users** - Admin panel users
11. **coupons** - Discount codes and promotions

### Supporting Tables (15 Additional)

- product_images
- product_tags
- wishlist_items
- order_addresses
- order_status_history
- review_images
- coupon_usage
- coupon_products
- notifications
- customer_messages
- message_replies
- product_views
- recently_viewed
- content_banners
- site_settings

## Key Features

### 1. Product Management

```sql
-- Products support:
- Base pricing with compare_at_price for sales
- Multiple variants (size, fabric, color, headboard style)
- Multiple images per product
- Stock status tracking (in_stock, low_stock, out_of_stock, made_to_order)
- Featured products
- Bespoke/custom order flag
- SEO metadata
- Tags for categorization
```

**Product Variants Example:**
```sql
-- A "Royal Velvet Bed" might have variants:
- King Size, Navy Velvet, Winged Headboard
- Queen Size, Grey Velvet, Classic Headboard
- Super King, Emerald Velvet, Studded Headboard
```

### 2. Customer System

```sql
-- Features:
- Secure authentication (password_hash)
- Email verification
- Multiple shipping/billing addresses
- Default address selection
- Marketing opt-in tracking
- Account activity tracking
```

### 3. Shopping & Checkout

**Cart System:**
- Guest carts (via session_id)
- Logged-in user carts (via customer_id)
- Cart expiration tracking
- Abandoned cart identification
- Customizations stored as JSONB

**Order Processing:**
- Complete order workflow
- Status tracking (pending → processing → confirmed → dispatched → delivered)
- Payment status tracking
- Fulfillment status tracking
- Estimated delivery dates
- Order history with status changes
- Snapshot of addresses at time of order

### 4. Reviews & Ratings

```sql
-- Features:
- 1-5 star ratings
- Title and comment
- Verified purchase badge
- Admin approval system
- Featured reviews
- Admin responses
- Review images
- Helpful count tracking
```

### 5. Discounts & Promotions

**Coupon System:**
```sql
-- Discount types:
- Percentage off (e.g., 15% off)
- Fixed amount (e.g., £50 off)
- Free shipping

-- Restrictions:
- Minimum purchase amount
- Maximum discount cap
- Usage limits (total and per customer)
- Time-based validity
- Product/category restrictions
```

### 6. Admin Panel Support

**Admin Users:**
- Role-based access (super_admin, admin, manager, staff)
- Activity tracking
- Account status management

**Admin Features:**
- Product management (CRUD)
- Variant management
- Order management
- Customer management
- Discount/coupon creation
- Review moderation
- Customer message handling
- Banner/content management
- Site settings

### 7. Notifications & Messaging

**Customer Notifications:**
- Order updates
- Shipping notifications
- Delivery confirmations
- Review requests
- Promotional messages
- System notifications

**Customer Messages:**
- Support inquiries
- Status tracking (new → in_progress → resolved)
- Priority levels
- Admin assignment
- Internal notes

### 8. Analytics & Tracking

```sql
-- Tracking features:
- Product view counts
- Recently viewed products per customer
- Cart abandonment tracking
- Referrer tracking
- Session tracking
```

## Database Views

### v_product_catalog
Comprehensive product listing with aggregated data:
```sql
SELECT * FROM v_product_catalog;
-- Returns: product details + variant count + review count + average rating
```

### v_order_summary
Order listing with customer information:
```sql
SELECT * FROM v_order_summary;
-- Returns: order details + customer name/email + item count
```

### v_dashboard_stats
Real-time dashboard statistics:
```sql
SELECT * FROM v_dashboard_stats;
-- Returns: today's orders/sales, pending orders, paid orders, abandoned carts, pending reviews
```

## Installation & Setup

### 1. Create Database
```bash
createdb nicebeds
```

### 2. Run Schema
```bash
psql nicebeds < schema.sql
```

### 3. Verify Installation
```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';
```

## Common Queries

### Product Queries

```sql
-- Get all active products with their primary image
SELECT 
    p.id,
    p.name,
    p.slug,
    p.base_price,
    p.stock_status,
    pi.image_url
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
WHERE p.is_active = true
ORDER BY p.created_at DESC;

-- Get product with all variants
SELECT 
    p.name as product_name,
    pv.variant_name,
    pv.size,
    pv.fabric_type,
    pv.fabric_color,
    pv.price_adjustment,
    (p.base_price + pv.price_adjustment) as final_price,
    pv.stock_quantity
FROM products p
JOIN product_variants pv ON p.id = pv.product_id
WHERE p.slug = 'royal-velvet-bed' AND pv.is_active = true;

-- Get featured products with reviews
SELECT 
    p.id,
    p.name,
    p.base_price,
    COUNT(r.id) as review_count,
    AVG(r.rating) as avg_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = true
WHERE p.is_featured = true AND p.is_active = true
GROUP BY p.id
ORDER BY avg_rating DESC NULLS LAST;
```

### Order Queries

```sql
-- Get today's orders
SELECT 
    o.order_number,
    c.first_name || ' ' || c.last_name as customer,
    o.status,
    o.total_amount,
    o.created_at
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
WHERE o.created_at::date = CURRENT_DATE
ORDER BY o.created_at DESC;

-- Get orders pending dispatch (paid but not shipped)
SELECT 
    o.order_number,
    o.customer_email,
    o.total_amount,
    o.created_at,
    o.estimated_delivery_date
FROM orders o
WHERE o.payment_status = 'paid' 
  AND o.fulfillment_status = 'unfulfilled'
  AND o.status NOT IN ('cancelled', 'refunded')
ORDER BY o.created_at ASC;

-- Get order details with items
SELECT 
    o.order_number,
    o.status,
    o.total_amount,
    oi.product_name,
    oi.variant_name,
    oi.quantity,
    oi.unit_price,
    oi.total_price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.order_number = 'NB-2024-00001';
```

### Customer Queries

```sql
-- Get customer with order history
SELECT 
    c.email,
    c.first_name,
    c.last_name,
    COUNT(o.id) as order_count,
    SUM(o.total_amount) as lifetime_value
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id
ORDER BY lifetime_value DESC NULLS LAST;

-- Get abandoned carts (updated in last 7 days)
SELECT 
    c.id,
    cust.email,
    c.updated_at as last_updated,
    COUNT(ci.id) as item_count,
    SUM(ci.price_at_addition * ci.quantity) as cart_value
FROM carts c
LEFT JOIN customers cust ON c.customer_id = cust.id
JOIN cart_items ci ON c.id = ci.cart_id
WHERE c.status = 'abandoned'
  AND c.updated_at > CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY c.id, cust.email
ORDER BY cart_value DESC;
```

### Review Queries

```sql
-- Get pending reviews for moderation
SELECT 
    r.id,
    r.rating,
    r.title,
    r.comment,
    r.customer_name,
    p.name as product_name,
    r.verified_purchase,
    r.created_at
FROM reviews r
JOIN products p ON r.product_id = p.id
WHERE r.is_approved = false
ORDER BY r.created_at ASC;

-- Get top-rated products
SELECT 
    p.name,
    COUNT(r.id) as review_count,
    AVG(r.rating) as avg_rating,
    COUNT(CASE WHEN r.rating = 5 THEN 1 END) as five_star_count
FROM products p
JOIN reviews r ON p.id = r.product_id
WHERE r.is_approved = true
GROUP BY p.id
HAVING COUNT(r.id) >= 5
ORDER BY avg_rating DESC, review_count DESC
LIMIT 10;
```

### Coupon Queries

```sql
-- Get active coupons
SELECT 
    code,
    description,
    discount_type,
    discount_value,
    minimum_purchase,
    usage_count,
    usage_limit,
    valid_until
FROM coupons
WHERE is_active = true
  AND (valid_from IS NULL OR valid_from <= CURRENT_TIMESTAMP)
  AND (valid_until IS NULL OR valid_until >= CURRENT_TIMESTAMP)
  AND (usage_limit IS NULL OR usage_count < usage_limit)
ORDER BY created_at DESC;

-- Validate coupon for customer
SELECT 
    c.code,
    c.discount_type,
    c.discount_value,
    COUNT(cu.id) as customer_usage
FROM coupons c
LEFT JOIN coupon_usage cu ON c.id = cu.coupon_id 
    AND cu.customer_id = '123e4567-e89b-12d3-a456-426614174000'
WHERE c.code = 'SUMMER2024'
  AND c.is_active = true
  AND (c.valid_from IS NULL OR c.valid_from <= CURRENT_TIMESTAMP)
  AND (c.valid_until IS NULL OR c.valid_until >= CURRENT_TIMESTAMP)
GROUP BY c.id
HAVING COUNT(cu.id) < c.per_customer_limit;
```

## Status Enumerations

### Order Status
- `pending` - Order created, awaiting payment
- `processing` - Payment received, preparing order
- `confirmed` - Order confirmed, ready for fulfillment
- `dispatched` - Order shipped
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled
- `refunded` - Order refunded

### Payment Status
- `pending` - Payment not yet received
- `authorized` - Payment authorized but not captured
- `paid` - Payment received
- `partially_refunded` - Partial refund issued
- `refunded` - Full refund issued
- `failed` - Payment failed

### Fulfillment Status
- `unfulfilled` - Not yet shipped
- `partially_fulfilled` - Some items shipped
- `fulfilled` - All items shipped
- `cancelled` - Fulfillment cancelled

### Stock Status
- `in_stock` - Available immediately
- `low_stock` - Low inventory
- `out_of_stock` - Not available
- `made_to_order` - Custom production required
- `discontinued` - No longer available

## Performance Considerations

### Indexes
The schema includes comprehensive indexes on:
- Foreign keys
- Frequently queried columns (email, status fields, dates)
- Composite indexes for common query patterns

### Triggers
Automatic `updated_at` timestamp updates on all relevant tables.

### Views
Materialized views can be created for heavy dashboard queries:
```sql
CREATE MATERIALIZED VIEW mv_daily_sales AS
SELECT 
    created_at::date as sale_date,
    COUNT(*) as order_count,
    SUM(total_amount) as total_sales
FROM orders
WHERE status NOT IN ('cancelled', 'refunded')
GROUP BY created_at::date
ORDER BY sale_date DESC;

-- Refresh daily via cron
REFRESH MATERIALIZED VIEW mv_daily_sales;
```

## Security Recommendations

1. **Password Storage**: Use bcrypt or Argon2 for password hashing
2. **API Keys**: Store in `site_settings` with `is_public = false`
3. **PII Protection**: Encrypt sensitive customer data at rest
4. **Access Control**: Implement row-level security for multi-tenant scenarios
5. **Audit Logging**: Add audit tables for sensitive operations
6. **Data Retention**: Implement policies for GDPR compliance

## Backup & Maintenance

### Daily Backup
```bash
pg_dump nicebeds > nicebeds_$(date +%Y%m%d).sql
```

### Analyze Tables
```sql
ANALYZE;
```

### Vacuum
```sql
VACUUM ANALYZE;
```

## Migration Path

To integrate with your existing Spark app:

1. **Backend API**: Create a Node.js/Express backend with PostgreSQL connection
2. **API Endpoints**: Build REST/GraphQL API matching your current data structure
3. **Authentication**: Implement JWT or session-based auth
4. **Data Migration**: Migrate data from `spark.kv` to PostgreSQL
5. **Update Frontend**: Update hooks to call API instead of `spark.kv`

## Example API Integration

```typescript
// Example: Updating use-products.ts to use PostgreSQL backend
import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  return { products, loading }
}
```

## Support

For questions or issues with this schema, please contact the development team.

## License

Proprietary - Nice Beds Ltd.
