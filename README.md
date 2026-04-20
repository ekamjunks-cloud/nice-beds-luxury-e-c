# 🛏️ Nice Beds - Luxury Upholstered & Bespoke Beds

**Version 1.0.0** | Production Ready ✅

A premium ecommerce platform for Nice Beds, a Leeds-based luxury bed retailer specializing in handcrafted upholstered and bespoke beds.

> **🚀 Status**: Ready for public launch! All features tested and production-optimized.

### 👋 First time here? Start with [WELCOME.md](./WELCOME.md)

---

## ⚡ Ready to Deploy?

**[👉 QUICK START - Deploy Now!](./QUICK_START.md)**

Your site is 100% ready. Build and deploy in 3 simple steps.

---

## 📚 Documentation

- **[⚡ Quick Start](./QUICK_START.md)** - Deploy in 3 steps (Start here!)
- **[🔐 Firebase Authentication Setup](./FIREBASE_AUTH_SETUP.md)** - Configure Firebase auth (Required!)
- **[🚀 Launch Guide](./LAUNCH_GUIDE.md)** - Complete guide to going public
- **[✅ Production Readiness](./PRODUCTION_READY.md)** - Full verification checklist
- **[📦 Deployment Checklist](./DEPLOYMENT.md)** - Technical deployment details
- **[📋 Product Requirements](./PRD.md)** - Design and feature specifications

## ✨ Features

### Customer Experience
- **Product Catalog** - Browse collection of luxury upholstered and bespoke beds
- **Advanced Filtering** - Filter by price, category, color, material, and availability
- **Product Customization** - Full bed customization with size, fabric, color, and storage options
- **Firebase Authentication** - Secure email/password authentication with enterprise-grade security
- **Shopping Cart** - Save items with full customization details
- **Wishlist** - Save favorite products for later
- **Order Tracking** - Real-time order status with estimated delivery dates
- **Order Updates** - Request updates on your orders directly through the platform

### Admin Panel
- **Dashboard** - Overview of sales, orders, and key metrics
- **Orders Management** - View and update order status
- **Catalog Management** - Add, edit, and manage products
- **Customer Management** - View customer accounts and activity
- **Content & Marketing** - Manage site content and promotional materials
- **Settings** - Configure store settings and preferences

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

- **Primary Color**: Deep navy (trust & sophistication)
- **Accent Color**: Warm gold (luxury & premium quality)
- **Typography**: Playfair Display (headings) + Montserrat (body)
- **Theme**: Luxury British craftsmanship with modern sensibilities

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin panel components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utilities, types, and data
└── styles/             # CSS and theme files
```

## 🔑 Key Technologies

- **React 19** with TypeScript
- **React Router** for navigation
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Spark SDK** for persistence and LLM features
- **Vite** for build tooling

## 💾 Data Persistence

All data is persisted using the Spark KV store:
- User accounts and authentication
- Shopping cart items
- Wishlist items
- Orders and order tracking
- Admin settings and content

## 🧹 Development Notes

The application is production-ready with:
- ✅ Error boundaries for graceful error handling
- ✅ TypeScript for type safety
- ✅ Responsive design (mobile-first)
- ✅ Optimized build configuration
- ✅ Persistent state management
- ✅ Clean code architecture

## 🌟 Going Public

This application is ready to launch! See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete deployment checklist and launch guide.

### Quick Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
