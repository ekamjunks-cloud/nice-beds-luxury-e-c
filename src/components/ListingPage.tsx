import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/components/ProductCard'
import { ProductListItem } from '@/components/ProductListItem'
import { Navigation } from '@/components/Navigation'
import { CartDrawer } from '@/components/CartDrawer'
import { WishlistDrawer } from '@/components/WishlistDrawer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { products } from '@/lib/products'
import { Product } from '@/lib/types'
import { Faders, X, SortAscending, SquaresFour, List, FunnelSimple, CaretDown } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { useKV } from '@github/spark/hooks'

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-az' | 'name-za'
type ViewMode = 'grid' | 'list'

export function ListingPage() {
  const navigate = useNavigate()
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  
  const [viewMode, setViewMode] = useKV<ViewMode>('product-view-mode', 'grid')
  const [priceRange, setPriceRange] = useState([0, 2500])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('featured')

  const allColors = useMemo(() => {
    const colorSet = new Set<string>()
    products.forEach(p => p.colors.forEach(c => colorSet.add(c)))
    return Array.from(colorSet).sort()
  }, [])

  const allMaterials = useMemo(() => {
    const materialSet = new Set<string>()
    products.forEach(p => p.materials.forEach(m => materialSet.add(m)))
    return Array.from(materialSet).sort()
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false
      
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false
      
      if (selectedColors.length > 0) {
        const hasMatchingColor = product.colors.some(color => selectedColors.includes(color))
        if (!hasMatchingColor) return false
      }
      
      if (selectedMaterials.length > 0) {
        const hasMatchingMaterial = product.materials.some(material => selectedMaterials.includes(material))
        if (!hasMatchingMaterial) return false
      }
      
      if (inStockOnly && !product.inStock) return false
      
      return true
    })

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    return filtered
  }, [priceRange, selectedCategories, selectedColors, selectedMaterials, inStockOnly, sortBy])

  const handleViewDetails = (product: Product) => {
    navigate(`/product/${product.slug}`)
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    )
  }

  const clearAllFilters = () => {
    setPriceRange([0, 2500])
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedMaterials([])
    setInStockOnly(false)
  }

  const activeFiltersCount = 
    selectedCategories.length + 
    selectedColors.length + 
    selectedMaterials.length + 
    (inStockOnly ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 2500 ? 1 : 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
      />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-4">
              Our Bed Collection
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Explore our handcrafted luxury beds, each piece meticulously designed and made in Leeds
            </p>
          </motion.div>

          <div className="bg-card rounded-lg border border-border shadow-sm p-4 md:p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
              <div className="flex-1 flex flex-wrap items-center gap-2 sm:gap-3">
                {selectedCategories.map(category => (
                  <Button
                    key={category}
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleCategory(category)}
                    className="h-8 gap-1.5 text-xs sm:text-sm"
                  >
                    {category === 'upholstered' ? 'Upholstered' : 'Bespoke'}
                    <X size={14} weight="bold" />
                  </Button>
                ))}
                {selectedCategories.length === 0 && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCategory('upholstered')}
                      className="h-8 flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                      Upholstered Beds
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCategory('bespoke')}
                      className="h-8 flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                      Bespoke Collection
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Collapsible open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-2 text-xs sm:text-sm"
                    >
                      <FunnelSimple size={16} weight="regular" />
                      <span className="hidden sm:inline">Advanced </span>Filters
                      {activeFiltersCount > 0 && (
                        <span className="ml-1 text-xs bg-accent text-accent-foreground rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                          {activeFiltersCount}
                        </span>
                      )}
                      <CaretDown 
                        size={14} 
                        weight="bold" 
                        className={`transition-transform duration-200 ${advancedFiltersOpen ? 'rotate-180' : ''}`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <Collapsible open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
              <CollapsibleContent>
                <Separator className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Faders size={16} weight="regular" className="text-accent" />
                      Price Range
                    </h3>
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={2500}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>£{priceRange[0]}</span>
                        <span>£{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-3">Availability</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock"
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(!!checked)}
                      />
                      <Label
                        htmlFor="in-stock"
                        className="text-sm font-normal cursor-pointer"
                      >
                        In Stock Only
                      </Label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-3">Colors</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {allColors.map(color => (
                        <div key={color} className="flex items-center space-x-2">
                          <Checkbox
                            id={`color-${color}`}
                            checked={selectedColors.includes(color)}
                            onCheckedChange={() => toggleColor(color)}
                          />
                          <Label
                            htmlFor={`color-${color}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {color}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-3">Materials</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {allMaterials.map(material => (
                        <div key={material} className="flex items-center space-x-2">
                          <Checkbox
                            id={`material-${material}`}
                            checked={selectedMaterials.includes(material)}
                            onCheckedChange={() => toggleMaterial(material)}
                          />
                          <Label
                            htmlFor={`material-${material}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {material}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {activeFiltersCount > 0 && (selectedColors.length > 0 || selectedMaterials.length > 0 || inStockOnly || (priceRange[0] !== 0 || priceRange[1] !== 2500)) && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {selectedColors.map(color => (
                    <Button
                      key={color}
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleColor(color)}
                      className="h-7 gap-1"
                    >
                      {color}
                      <X size={14} weight="bold" />
                    </Button>
                  ))}
                  {selectedMaterials.map(material => (
                    <Button
                      key={material}
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleMaterial(material)}
                      className="h-7 gap-1"
                    >
                      {material}
                      <X size={14} weight="bold" />
                    </Button>
                  ))}
                  {inStockOnly && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setInStockOnly(false)}
                      className="h-7 gap-1"
                    >
                      In Stock Only
                      <X size={14} weight="bold" />
                    </Button>
                  )}
                  {(priceRange[0] !== 0 || priceRange[1] !== 2500) && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPriceRange([0, 2500])}
                      className="h-7 gap-1"
                    >
                      £{priceRange[0]} - £{priceRange[1]}
                      <X size={14} weight="bold" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6 flex-wrap gap-3 sm:gap-4">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'bed' : 'beds'} found
            </p>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode(() => 'grid')}
                  className="rounded-r-none border-r border-border h-8 px-2.5 sm:px-3"
                >
                  <SquaresFour size={18} weight={viewMode === 'grid' ? 'fill' : 'regular'} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode(() => 'list')}
                  className="rounded-l-none h-8 px-2.5 sm:px-3"
                >
                  <List size={18} weight={viewMode === 'list' ? 'fill' : 'regular'} />
                </Button>
              </div>
              <SortAscending size={20} weight="regular" className="text-muted-foreground hidden sm:block" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[140px] sm:w-[180px] h-8 text-xs sm:text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-az">Name: A to Z</SelectItem>
                  <SelectItem value="name-za">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <motion.div
            layout
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8' : 'flex flex-col gap-6'}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.05
                  }}
                >
                  {viewMode === 'grid' ? (
                    <ProductCard product={product} onViewDetails={handleViewDetails} />
                  ) : (
                    <ProductListItem product={product} onViewDetails={handleViewDetails} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <h3 className="font-heading text-2xl font-medium text-foreground mb-3">
                  No beds found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <WishlistDrawer open={wishlistOpen} onOpenChange={setWishlistOpen} />
      <Toaster />
    </div>
  )
}
