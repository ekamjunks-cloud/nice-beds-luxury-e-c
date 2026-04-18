# Planning Guide

A luxury ecommerce platform for Nice Beds, a Leeds-based specialist brand offering upholstered and bespoke beds with an emphasis on craftsmanship, quality, and refined British design.

**Experience Qualities**:
1. **Refined**: Every element should communicate premium quality and attention to detail, reflecting the craftsmanship of the beds themselves
2. **Serene**: The browsing experience should feel calm and unrushed, allowing customers to thoughtfully consider their investment
3. **Trustworthy**: Clear product information, transparent pricing, and professional presentation that inspires confidence in a significant purchase

**Complexity Level**: Light Application (multiple features with basic state)
This is an ecommerce showcase with cart functionality, product browsing, and inquiry features - not a full checkout system, but more than a simple content page.

## Essential Features

**Product Catalogue**
- Functionality: Display collection of upholstered and bespoke beds with high-quality imagery, specifications, and pricing
- Purpose: Allow customers to browse the full range and understand product options
- Trigger: Landing on the site or navigating to "Shop" section
- Progression: View hero section → Browse product grid → Click product card → View detailed product page with specifications
- Success criteria: All products display with correct images, prices, dimensions, and descriptions

**Product Detail View**
- Functionality: Dedicated product page with comprehensive information including materials, dimensions, customization options, and interactive image carousel with multiple product views
- Purpose: Provide all information needed to make a purchase decision in a focused, distraction-free environment
- Trigger: Clicking on a product card or "View Details" button
- Progression: Click product → Navigate to dedicated product page → View image carousel → Read full specifications → Select color options → Add to cart or request consultation → View similar products
- Success criteria: Users can view all product details, navigate through image gallery, select options, and clearly understand what they're purchasing

**Shopping Cart**
- Functionality: Persist selected items with quantities and display running total
- Purpose: Allow customers to collect multiple items before proceeding
- Trigger: Adding a product to cart
- Progression: Add product → Cart updates → View cart → Adjust quantities → Proceed to inquiry
- Success criteria: Cart persists between sessions, totals calculate correctly, items can be removed

**Consultation Request**
- Functionality: Form for customers to request bespoke consultations or inquiries about products
- Purpose: Capture leads for high-value custom orders
- Trigger: Clicking "Request Consultation" or "Bespoke Service" CTA
- Progression: Click CTA → Fill form with contact details and requirements → Submit → See confirmation
- Success criteria: Form validates inputs, stores inquiries, shows success feedback

**About/Brand Story**
- Functionality: Present the Nice Beds story, craftsmanship approach, and Leeds heritage
- Purpose: Build trust and emotional connection with the brand
- Trigger: Navigating to About section
- Progression: Navigate to About → Read brand story → View craftsmanship details → Understand quality promise
- Success criteria: Content clearly communicates brand values and differentiators

## Edge Case Handling

- **Empty Cart**: Display elegant empty state with prompt to browse products and featured product suggestions
- **Out of Stock Items**: Show "Contact for Availability" instead of "Add to Cart" with option to request notification
- **Invalid Form Inputs**: Inline validation with helpful error messages for contact forms and consultation requests
- **Long Product Names**: Truncate gracefully with ellipsis in grid view, show full name in detail view
- **Mobile Navigation**: Collapsible hamburger menu with smooth transitions for smaller screens
- **Image Loading**: Show skeleton loaders with brand colors while product images load

## Design Direction

The design should evoke feelings of sophisticated comfort, British craftsmanship heritage, and confident luxury. It should feel like walking into a high-end furniture showroom - spacious, well-lit, with carefully curated displays that let the products breathe. The aesthetic should be contemporary luxury rather than traditional or stuffy, reflecting modern British design sensibilities.

## Color Selection

A sophisticated palette centered around warm neutrals with deep jewel-tone accents that reference luxury upholstery fabrics.

- **Primary Color**: Deep forest green (oklch(0.35 0.08 155)) - communicates luxury, nature, and British countryside heritage
- **Secondary Colors**: Warm cream (oklch(0.96 0.01 85)) for backgrounds - creates gallery-like spaciousness; Soft taupe (oklch(0.75 0.015 75)) for secondary elements - adds warmth and sophistication
- **Accent Color**: Rich brass/gold (oklch(0.70 0.12 75)) - draws attention to CTAs and important elements, references high-end furniture hardware
- **Foreground/Background Pairings**: 
  - Primary (Forest Green): Cream text (oklch(0.96 0.01 85)) - Ratio 7.2:1 ✓
  - Background (Warm Cream): Charcoal text (oklch(0.25 0.01 75)) - Ratio 12.5:1 ✓
  - Accent (Brass Gold): Forest Green text (oklch(0.35 0.08 155)) - Ratio 4.9:1 ✓
  - Card (White): Charcoal text (oklch(0.25 0.01 75)) - Ratio 13.8:1 ✓

## Font Selection

Typography should convey refined elegance and contemporary luxury while maintaining excellent readability - a pairing of a sophisticated serif for headings with a clean geometric sans for body text.

- **Primary Typeface**: Cormorant Garamond (serif) - for headings, brand name, and key messaging. Elegant and refined with classical proportions
- **Secondary Typeface**: Inter (sans-serif) - for body text, UI elements, and product details. Highly readable with clean, modern lines

- **Typographic Hierarchy**:
  - H1 (Brand/Hero): Cormorant Garamond Medium/56px/tight tracking
  - H2 (Section Headers): Cormorant Garamond Medium/40px/normal tracking  
  - H3 (Product Names): Cormorant Garamond Medium/28px/normal tracking
  - H4 (Subsections): Inter Semibold/18px/normal tracking
  - Body (Descriptions): Inter Regular/16px/relaxed line-height (1.7)
  - Small (Metadata): Inter Regular/14px/normal tracking
  - Button Text: Inter Medium/15px/slight letter-spacing

## Animations

Animations should feel luxurious and considered - smooth, slightly slower than typical web animations to convey quality and refinement. Use subtle fade-ins and upward movements for content reveals on scroll, gentle hover scale effects (1.02x) on product images to invite interaction, smooth color transitions on buttons (300ms), and elegant slide-in animations for the cart drawer. Avoid anything bouncy or playful; everything should feel measured and sophisticated.

## Component Selection

- **Components**: 
  - Card: For product grid items with hover elevation effects
  - Dialog: For consultation forms and modals (legacy support)
  - Sheet: For sliding cart drawer from right side
  - Button: Multiple variants - primary (filled brass), secondary (outlined), ghost for navigation
  - Carousel: For product detail image galleries with thumbnail navigation and arrow controls
  - Form + Input + Textarea: For consultation request form with elegant validation
  - Badge: For "Bespoke Available" or "New" product tags in muted brass
  - Separator: For dividing sections with subtle lines
  - Scroll-area: For cart items when list becomes long
  - Avatar: For testimonials or team members in About section
  - Router (React Router): For navigating between home page and individual product pages

- **Customizations**: 
  - Product grid component with aspect ratio containers (4:3) for consistent imagery
  - Full-page product view with large carousel gallery and detailed specifications layout
  - Hero section with full-width background image and centered content overlay
  - Sticky navigation bar with subtle shadow on scroll
  - Footer with multi-column layout for navigation, contact, and location
  - Price display component with proper GBP formatting
  - Related products section with clickable cards on product pages
  - "Back to Shop" navigation button on product pages

- **States**: 
  - Buttons: Default (brass bg, white text) → Hover (darker brass with subtle shadow) → Active (pressed effect) → Disabled (muted with reduced opacity)
  - Product cards: Default (white bg) → Hover (subtle elevation, image scales slightly) → Focus (brass ring)
  - Form inputs: Default (light border) → Focus (brass ring, darker border) → Error (destructive red border with icon) → Success (green border with checkmark)
  - Cart icon: Animates with subtle bounce when item added, shows badge with item count

- **Icon Selection**: 
  - ShoppingBag for cart
  - Heart for wishlist/favorites
  - MapPin for location/contact
  - Phone for contact
  - Mail for email/inquiries  
  - Ruler for dimensions
  - Sparkle for bespoke/premium features
  - ChevronRight for navigation/breadcrumbs
  - X for close/remove items

- **Spacing**: 
  - Section padding: py-24 desktop, py-16 mobile
  - Container max-width: max-w-7xl with px-6
  - Grid gaps: gap-8 for product grid, gap-4 for form elements
  - Card padding: p-6 for product cards
  - Button padding: px-8 py-3 for primary, px-6 py-2 for secondary

- **Mobile**: 
  - Navigation collapses to hamburger menu (Sheet component) at <768px
  - Product grid: 2 columns on mobile (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)
  - Hero text sizing reduces from text-6xl to text-4xl
  - Product page layout stacks vertically with image gallery first on mobile
  - Image carousel thumbnail grid: 4 columns on all devices for consistency
  - Sticky "Add to Cart" section on product pages for easy access
  - Cart drawer takes full width on mobile
  - Forms stack vertically with full-width inputs
  - Footer columns stack vertically with centered text
  - Related products grid: single column on mobile, 3 columns on desktop
