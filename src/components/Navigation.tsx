import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ShoppingBag, List, Heart, User, Package, Gear, SignOut, Bell, ShieldCheck } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useWishlist } from '@/hooks/use-wishlist'
import { useAuth } from '@/hooks/use-auth'
import { CartItem } from '@/lib/types'
import { AuthDialog } from './AuthDialog'
import { toast } from 'sonner'

interface NavigationProps {
  onCartOpen: () => void
  onWishlistOpen: () => void
  onNavigate?: (section: string) => void
  currentSection?: string
}

export function Navigation({ onCartOpen, onWishlistOpen, onNavigate, currentSection }: NavigationProps) {
  const [cart] = useKV<CartItem[]>('cart', [])
  const { wishlistCount } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const cartItemCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0)

  const handleNavClick = (id: string) => {
    if (id === 'home') {
      navigate('/')
    } else if (id === 'shop') {
      navigate('/shop')
    } else if (onNavigate) {
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const element = document.getElementById(id)
          element?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        onNavigate(id)
      }
    }
  }

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/account')
    } else {
      setAuthDialogOpen(true)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleOrders = () => {
    navigate('/account?tab=orders')
  }

  const handleSettings = () => {
    navigate('/account?tab=settings')
  }

  const handleNotifications = () => {
    navigate('/account?tab=notifications')
  }

  const handleAdmin = () => {
    navigate('/admin')
  }

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ]

  const isActive = (id: string) => {
    if (id === 'home' && location.pathname === '/') return currentSection === 'home'
    if (id === 'shop' && location.pathname === '/shop') return true
    if (location.pathname === '/' && currentSection === id) return true
    return false
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="font-heading text-2xl font-medium text-foreground hover:text-primary transition-colors"
          >
            Nice Beds
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.id) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                  >
                    <User size={20} weight="regular" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-accent rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleOrders} className="cursor-pointer">
                    <Package size={16} weight="regular" className="mr-2" />
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleNotifications} className="cursor-pointer">
                    <Bell size={16} weight="regular" className="mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                    <Gear size={16} weight="regular" className="mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAdmin} className="cursor-pointer">
                    <ShieldCheck size={16} weight="regular" className="mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <SignOut size={16} weight="regular" className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAccountClick}
                className="relative"
              >
                <User size={20} weight="regular" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onWishlistOpen}
              className="relative"
            >
              <Heart size={20} weight="regular" />
              {wishlistCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs"
                >
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onCartOpen}
              className="relative"
            >
              <ShoppingBag size={20} weight="regular" />
              {cartItemCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <List size={24} weight="regular" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => {
                        handleNavClick(link.id)
                        setMobileMenuOpen(false)
                      }}
                      className={`text-left text-lg font-medium transition-colors hover:text-primary ${
                        isActive(link.id) ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </nav>
  )
}
