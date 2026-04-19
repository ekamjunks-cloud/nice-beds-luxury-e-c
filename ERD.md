# Nice Beds Database - Entity Relationship Diagram

## Table Relationships Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          NICE BEDS DATABASE SCHEMA                      │
│                         Entity Relationship Overview                    │
└─────────────────────────────────────────────────────────────────────────┘

## Core Entities & Relationships

### 1. PRODUCT CATALOG DOMAIN
┌──────────────┐
│  PRODUCTS    │ (Main product catalog)
├──────────────┤
│ • id (PK)    │
│ • slug       │◄────────┐
│ • name       │         │
│ • category   │         │
│ • base_price │         │
└──────────────┘         │
       │                 │
       │ 1:N             │
       ▼                 │
┌──────────────┐         │
│ PRODUCT      │         │
│ VARIANTS     │         │
├──────────────┤         │
│ • id (PK)    │         │
│ • product_id │         │
│ • sku        │         │
│ • size       │         │
│ • fabric     │         │
│ • price_adj  │         │
└──────────────┘         │
                         │
┌──────────────┐         │
│ PRODUCT      │         │
│ IMAGES       │         │
├──────────────┤         │
│ • id (PK)    │         │
│ • product_id │─────────┤
│ • image_url  │         │
│ • is_primary │         │
└──────────────┘         │
                         │
┌──────────────┐         │
│ PRODUCT      │         │
│ TAGS         │         │
├──────────────┤         │
│ • id (PK)    │         │
│ • product_id │─────────┘
│ • tag        │
└──────────────┘


### 2. CUSTOMER & AUTH DOMAIN
┌──────────────┐
│  CUSTOMERS   │ (Customer accounts)
├──────────────┤
│ • id (PK)    │
│ • email      │◄────────┐
│ • password   │         │
│ • name       │         │
│ • phone      │         │
└──────────────┘         │
       │                 │
       │ 1:N             │
       ▼                 │
┌──────────────┐         │
│  ADDRESSES   │         │
├──────────────┤         │
│ • id (PK)    │         │
│ • customer_id│─────────┘
│ • type       │
│ • is_default │
│ • address    │
└──────────────┘

┌──────────────┐
│ ADMIN_USERS  │ (Admin panel users)
├──────────────┤
│ • id (PK)    │
│ • email      │
│ • password   │
│ • role       │
└──────────────┘


### 3. SHOPPING & CART DOMAIN
┌──────────────┐
│  CUSTOMERS   │
├──────────────┤
│ • id (PK)    │
└──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐         ┌──────────────┐
│    CARTS     │ 1:N     │ CART_ITEMS   │
├──────────────┤────────►├──────────────┤
│ • id (PK)    │         │ • id (PK)    │
│ • customer_id│         │ • cart_id    │
│ • session_id │         │ • product_id │──┐
│ • status     │         │ • variant_id │  │
│ • expires_at │         │ • quantity   │  │
└──────────────┘         │ • price      │  │
                         └──────────────┘  │
                                           │
                         ┌─────────────────┘
                         │
                         ▼
                    ┌──────────────┐
                    │  PRODUCTS    │
                    └──────────────┘


### 4. WISHLIST DOMAIN
┌──────────────┐         ┌──────────────┐
│  CUSTOMERS   │ 1:N     │ WISHLIST     │
├──────────────┤────────►│ ITEMS        │
│ • id (PK)    │         ├──────────────┤
└──────────────┘         │ • customer_id│
                         │ • product_id │──┐
                         │ • variant_id │  │
                         └──────────────┘  │
                                           ▼
                                      ┌──────────────┐
                                      │  PRODUCTS    │
                                      └──────────────┘


### 5. ORDER & FULFILLMENT DOMAIN
┌──────────────┐
│  CUSTOMERS   │
├──────────────┤
│ • id (PK)    │
└──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐         ┌──────────────┐
│   ORDERS     │ 1:N     │ ORDER_ITEMS  │
├──────────────┤────────►├──────────────┤
│ • id (PK)    │         │ • id (PK)    │
│ • order_num  │         │ • order_id   │
│ • customer_id│         │ • product_id │──┐
│ • status     │         │ • variant_id │  │
│ • payment    │         │ • quantity   │  │
│ • total      │         │ • price      │  │
│ • delivery   │         └──────────────┘  │
└──────────────┘                           │
       │                                   ▼
       │ 1:N                          ┌──────────────┐
       ▼                              │  PRODUCTS    │
┌──────────────┐                      └──────────────┘
│ ORDER        │
│ ADDRESSES    │
├──────────────┤
│ • id (PK)    │
│ • order_id   │
│ • type       │
│ • address    │
└──────────────┘

┌──────────────┐
│ ORDER_STATUS │
│ HISTORY      │
├──────────────┤
│ • id (PK)    │
│ • order_id   │──┐
│ • from       │  │
│ • to_status  │  │
│ • created_by │  │
└──────────────┘  │
                  │
            ┌─────┴─────┐
            ▼           ▼
       ┌──────────┐  ┌──────────┐
       │  ORDERS  │  │  ADMIN   │
       └──────────┘  │  USERS   │
                     └──────────┘


### 6. REVIEWS & RATINGS DOMAIN
┌──────────────┐
│  PRODUCTS    │
├──────────────┤
│ • id (PK)    │
└──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐         ┌──────────────┐
│   REVIEWS    │ 1:N     │ REVIEW       │
├──────────────┤────────►│ IMAGES       │
│ • id (PK)    │         ├──────────────┤
│ • product_id │         │ • id (PK)    │
│ • customer_id│──┐      │ • review_id  │
│ • order_id   │  │      │ • image_url  │
│ • rating     │  │      └──────────────┘
│ • comment    │  │
│ • verified   │  │
│ • approved   │  │
└──────────────┘  │
                  │
            ┌─────┴─────┐
            ▼           ▼
       ┌──────────┐  ┌──────────┐
       │ CUSTOMERS│  │  ORDERS  │
       └──────────┘  └──────────┘


### 7. COUPONS & DISCOUNTS DOMAIN
┌──────────────┐
│   COUPONS    │
├──────────────┤
│ • id (PK)    │
│ • code       │
│ • type       │
│ • value      │
│ • usage_limit│
└──────────────┘
       │
       │ 1:N
       ├─────────────┐
       │             │
       ▼             ▼
┌──────────────┐  ┌──────────────┐
│ COUPON_USAGE │  │ COUPON       │
├──────────────┤  │ PRODUCTS     │
│ • id (PK)    │  ├──────────────┤
│ • coupon_id  │  │ • coupon_id  │
│ • order_id   │  │ • product_id │──┐
│ • customer_id│  └──────────────┘  │
└──────────────┘                    │
       │                            ▼
       │                       ┌──────────┐
       ▼                       │ PRODUCTS │
  ┌──────────┐                └──────────┘
  │  ORDERS  │
  └──────────┘


### 8. NOTIFICATIONS & MESSAGING DOMAIN
┌──────────────┐
│  CUSTOMERS   │
├──────────────┤
│ • id (PK)    │
└──────────────┘
       │
       │ 1:N
       ├─────────────┐
       │             │
       ▼             ▼
┌──────────────┐  ┌──────────────┐
│ NOTIFICATIONS│  │ CUSTOMER     │
├──────────────┤  │ MESSAGES     │
│ • id (PK)    │  ├──────────────┤
│ • customer_id│  │ • id (PK)    │
│ • type       │  │ • customer_id│
│ • message    │  │ • subject    │
│ • is_read    │  │ • message    │
└──────────────┘  │ • status     │
                  │ • assigned_to│──┐
                  └──────────────┘  │
                         │          │
                         │ 1:N      │
                         ▼          ▼
                  ┌──────────────┐  ┌──────────┐
                  │ MESSAGE      │  │  ADMIN   │
                  │ REPLIES      │  │  USERS   │
                  ├──────────────┤  └──────────┘
                  │ • id (PK)    │
                  │ • message_id │
                  │ • admin_id   │
                  │ • reply_text │
                  └──────────────┘


### 9. ANALYTICS DOMAIN
┌──────────────┐
│  CUSTOMERS   │
├──────────────┤
│ • id (PK)    │
└──────────────┘
       │
       │ 1:N
       ├─────────────┐
       │             │
       ▼             ▼
┌──────────────┐  ┌──────────────┐
│ RECENTLY     │  │ PRODUCT      │
│ VIEWED       │  │ VIEWS        │
├──────────────┤  ├──────────────┤
│ • customer_id│  │ • product_id │
│ • product_id │  │ • customer_id│
│ • viewed_at  │  │ • session_id │
└──────────────┘  │ • ip_address │
       │          └──────────────┘
       │                 │
       └────────┬────────┘
                ▼
         ┌──────────────┐
         │  PRODUCTS    │
         └──────────────┘


### 10. CONTENT MANAGEMENT DOMAIN
┌──────────────┐
│ CONTENT      │
│ BANNERS      │
├──────────────┤
│ • id (PK)    │
│ • title      │
│ • image      │
│ • cta_link   │
│ • is_active  │
└──────────────┘

┌──────────────┐
│ SITE         │
│ SETTINGS     │
├──────────────┤
│ • id (PK)    │
│ • key        │
│ • value      │
│ • type       │
│ • updated_by │──┐
└──────────────┘  │
                  ▼
              ┌──────────┐
              │  ADMIN   │
              │  USERS   │
              └──────────┘
```

## Relationship Types

### One-to-Many (1:N)
- One product → many variants
- One product → many images
- One customer → many addresses
- One customer → many orders
- One order → many order items
- One cart → many cart items
- One product → many reviews
- One coupon → many usage records

### Many-to-Many (N:M)
- Products ↔ Tags (via product_tags)
- Customers ↔ Products (via wishlist_items)
- Coupons ↔ Products (via coupon_products)

### Self-Referencing
- None in current schema

## Foreign Key Constraints

### CASCADE Deletes
When parent is deleted, children are also deleted:
- `products` → `product_variants`
- `products` → `product_images`
- `products` → `product_tags`
- `customers` → `addresses`
- `carts` → `cart_items`
- `orders` → `order_items`
- `orders` → `order_addresses`
- `reviews` → `review_images`

### SET NULL Deletes
When parent is deleted, foreign key is set to NULL:
- `customers` → `orders` (keep order even if customer deleted)
- `products` → `order_items` (snapshot preserved)
- `admin_users` → `customer_messages.assigned_to`

## Data Flow Examples

### 1. Customer Places Order
```
1. Customer browses products
   ↓
2. Adds items to cart (cart_items)
   ↓
3. Applies coupon (coupon_usage)
   ↓
4. Enters shipping address
   ↓
5. Order created (orders)
   ├─ Order items created (order_items)
   ├─ Order addresses snapshotted (order_addresses)
   └─ Cart status → 'converted'
   ↓
6. Payment processed
   ├─ order.payment_status → 'paid'
   └─ Notification sent (notifications)
   ↓
7. Admin fulfills order
   ├─ order.fulfillment_status → 'fulfilled'
   ├─ order.dispatched_at set
   └─ Status history logged (order_status_history)
   ↓
8. Customer receives order
   ├─ order.status → 'delivered'
   └─ Review request sent (notifications)
```

### 2. Product Catalog Update
```
1. Admin creates product (products)
   ↓
2. Uploads images (product_images)
   ↓
3. Creates variants (product_variants)
   ├─ Size: King, Queen, Super King
   ├─ Fabric: Velvet, Linen, Cotton
   └─ Color: Navy, Grey, Beige
   ↓
4. Adds tags (product_tags)
   ├─ 'luxury'
   ├─ 'bestseller'
   └─ 'new-arrival'
   ↓
5. Product goes live
   ├─ is_active → true
   └─ is_featured → true
```

### 3. Customer Support Flow
```
1. Customer sends message (customer_messages)
   ├─ status: 'new'
   └─ priority: 'normal'
   ↓
2. Admin reviews and assigns
   ├─ assigned_to → admin_user_id
   └─ status → 'in_progress'
   ↓
3. Admin replies (message_replies)
   ├─ is_internal: false
   └─ Notification sent to customer
   ↓
4. Issue resolved
   ├─ status → 'resolved'
   └─ resolved_at set
```

## Database Statistics

### Table Counts (Approximate Production)
```
products:             50-500
product_variants:     200-2000
product_images:       100-1000
customers:            1000-100000
addresses:            1500-150000
orders:               2000-200000
order_items:          5000-500000
reviews:              500-50000
coupons:              10-100
cart_items:           1000-50000
```

## Performance Notes

### High-Traffic Tables
- `product_views` - Grows rapidly, consider partitioning
- `cart_items` - High churn, regular cleanup needed
- `order_items` - Read-heavy, good indexing critical

### Archive Candidates
- `carts` with status 'expired' older than 90 days
- `product_views` older than 1 year
- `notifications` read and older than 6 months

### Partitioning Recommendations
- `orders` - Partition by created_at (monthly/quarterly)
- `product_views` - Partition by created_at (monthly)
- `order_status_history` - Partition by created_at (quarterly)

## Next Steps

1. Review schema with development team
2. Set up staging PostgreSQL instance
3. Create seed data scripts
4. Build REST/GraphQL API layer
5. Implement authentication middleware
6. Update frontend hooks to use API
7. Data migration from spark.kv
8. Load testing and optimization
9. Security audit
10. Production deployment

---

**Schema Version:** 1.0  
**Last Updated:** 2024  
**Maintained By:** Nice Beds Development Team
