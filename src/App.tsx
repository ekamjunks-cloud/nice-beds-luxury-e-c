import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Navigation } from '@/components/Navigation'
import { CartDrawer } from '@/components/CartDrawer'
import { WishlistDrawer } from '@/components/WishlistDrawer'
import { ProductCard } from '@/components/ProductCard'
import { ProductPage } from '@/components/ProductPage'
import { ListingPage } from '@/components/ListingPage'
import { AccountPage } from '@/components/AccountPage'
import { AdminPanel } from '@/components/AdminPanel'
import { StorageWarning } from '@/components/StorageWarning'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useProducts } from '@/hooks/use-products'
import { Product } from '@/lib/types'
import { MapPin, Phone, Envelope, Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function HomePage() {
  const navigate = useNavigate()
  const { products } = useProducts()
  const [currentSection, setCurrentSection] = useState('home')
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleViewDetails = (product: Product) => {
    navigate(`/product/${product.slug}`)
  }

  const scrollToSection = (section: string) => {
    setCurrentSection(section)
    const element = document.getElementById(section)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const parallaxOffset = scrollY * 0.5
  const fadeOpacity = Math.max(0, 1 - scrollY / 500)
  const scaleValue = 1 + scrollY * 0.0002

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        onNavigate={scrollToSection}
        currentSection={currentSection}
      />

      <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${parallaxOffset}px) scale(${scaleValue})`,
            willChange: 'transform',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background/95" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          style={{
            opacity: fadeOpacity,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <h1 className="font-heading text-5xl md:text-7xl font-medium text-card mb-6 leading-tight">
            Luxury Beds, <br />Crafted in Leeds
          </h1>
          <p className="text-lg md:text-xl text-card/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover our collection of exquisitely crafted upholstered and bespoke beds. 
            Each piece combines traditional British craftsmanship with contemporary design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/shop')}
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 text-lg px-8"
            >
              Shop Collection
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('contact')}
              className="bg-card/10 backdrop-blur text-card border-card/30 hover:bg-card/20 transition-all duration-300 text-lg px-8"
            >
              <Sparkle size={20} weight="fill" className="mr-2" />
              Bespoke Service
            </Button>
          </div>
        </motion.div>
      </section>

      <section id="shop" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-4">
              Our Collection
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handcrafted beds designed for lasting comfort and timeless elegance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-6">
                Craftsmanship <br />from the Heart of Leeds
              </h2>
              <div className="space-y-4 text-foreground leading-relaxed">
                <p>
                  Since our founding, Nice Beds has been dedicated to creating exceptional sleeping 
                  experiences through meticulous craftsmanship and premium materials. Based in Leeds, 
                  we combine traditional upholstery techniques with contemporary design sensibilities.
                </p>
                <p>
                  Every bed is handcrafted by skilled artisans who pour their expertise into each 
                  stitch, tuft, and detail. We believe that a bed should be more than furniture—it 
                  should be a sanctuary of comfort and a statement of refined taste.
                </p>
                <p>
                  Our bespoke service allows you to create a truly unique piece, customized to your 
                  exact specifications. From fabric selection to dimensions, we work closely with you 
                  to bring your vision to life.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div>
                  <p className="font-heading text-3xl font-medium text-primary mb-1">15+</p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-medium text-primary mb-1">100%</p>
                  <p className="text-sm text-muted-foreground">Handcrafted</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-medium text-primary mb-1">500+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[3/4] rounded-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have questions or ready to start your bespoke project? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} weight="regular" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Visit Our Showroom</h3>
                  <p className="text-muted-foreground">
                    45 Wellington Street<br />
                    Leeds, West Yorkshire<br />
                    LS1 4HZ, United Kingdom
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={24} weight="regular" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                  <p className="text-muted-foreground">
                    +44 (0) 113 123 4567<br />
                    Mon-Sat: 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Envelope size={24} weight="regular" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                  <p className="text-muted-foreground">
                    hello@nicebeds.co.uk<br />
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form className="space-y-4">
                <div>
                  <Input
                    id="contact-name"
                    placeholder="Your Name"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="Your Email"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell us about your project or inquiry..."
                    rows={6}
                    className="bg-card resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
                  size="lg"
                >
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-heading text-2xl font-medium mb-4">Nice Beds</h3>
              <p className="text-primary-foreground/80 text-sm">
                Handcrafted luxury beds from the heart of Leeds
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><button onClick={() => scrollToSection('shop')} className="hover:text-primary-foreground transition-colors">Upholstered Beds</button></li>
                <li><button onClick={() => scrollToSection('shop')} className="hover:text-primary-foreground transition-colors">Bespoke Service</button></li>
                <li><button onClick={() => scrollToSection('shop')} className="hover:text-primary-foreground transition-colors">New Arrivals</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-primary-foreground transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-primary-foreground transition-colors">Contact</button></li>
                <li><button className="hover:text-primary-foreground transition-colors">Showroom</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><button className="hover:text-primary-foreground transition-colors">Delivery Info</button></li>
                <li><button className="hover:text-primary-foreground transition-colors">Care Guide</button></li>
                <li><button className="hover:text-primary-foreground transition-colors">Warranty</button></li>
              </ul>
            </div>
          </div>

          <Separator className="bg-primary-foreground/20 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>© 2024 Nice Beds. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-primary-foreground transition-colors">Privacy Policy</button>
              <button className="hover:text-primary-foreground transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <WishlistDrawer open={wishlistOpen} onOpenChange={setWishlistOpen} />
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <StorageWarning />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ListingPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  )
}

export default App
