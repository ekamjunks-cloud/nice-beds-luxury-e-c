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
import { products } from '@/lib/products'
import { Product } from '@/lib/types'
import { Faders, X, SortAscending, SquaresFour, List } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { useKV } from '@github/spark/hooks'

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-az' | 'name-za'
type ViewMode = 'grid' | 'list'

export function ListingPage() {
  const navigate = useNavigate()
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(true)
  
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
            className="mb-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-4">
              Our Bed Collection
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Explore our handcrafted luxury beds, each piece meticulously designed and made in Leeds
            </p>
          </motion.div>

          <div className="flex gap-8">
            <AnimatePresence mode="wait">
              {filtersOpen && (
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-72 flex-shrink-0 hidden lg:block"
                >
                  <div className="sticky top-24 bg-card rounded-lg p-6 border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Faders size={20} weight="regular" className="text-accent" />
                        <h2 className="font-semibold text-lg">Filters</h2>
                        {activeFiltersCount > 0 && (
                          <span className="text-xs bg-accent text-accent-foreground rounded-full px-2 py-0.5">
                            {activeFiltersCount}
                          </span>
                        )}
                      </div>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="h-auto py-1 px-2 text-xs"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
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

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-sm mb-3">Category</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="category-upholstered"
                              checked={selectedCategories.includes('upholstered')}
                              onCheckedChange={() => toggleCategory('upholstered')}
                            />
                            <Label
                              htmlFor="category-upholstered"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Upholstered Beds
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="category-bespoke"
                              checked={selectedCategories.includes('bespoke')}
                              onCheckedChange={() => toggleCategory('bespoke')}
                            />
                            <Label
                              htmlFor="category-bespoke"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Bespoke Collection
                            </Label>
                          </div>
                        </div>
                      </div>

                      <Separator />

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

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-sm mb-3">Colors</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
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

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-sm mb-3">Materials</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
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
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="lg:hidden"
                  >
                    <Faders size={16} weight="regular" className="mr-2" />
                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'bed' : 'beds'} found
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none border-r border-border"
                    >
                      <SquaresFour size={18} weight={viewMode === 'grid' ? 'fill' : 'regular'} />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List size={18} weight={viewMode === 'list' ? 'fill' : 'regular'} />
                    </Button>
                  </div>
                  <SortAscending size={20} weight="regular" className="text-muted-foreground" />
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-[180px]">
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

              {activeFiltersCount > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {selectedCategories.map(category => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleCategory(category)}
                        className="h-7 gap-1"
                      >
                        {category === 'upholstered' ? 'Upholstered' : 'Bespoke'}
                        <X size={14} weight="bold" />
                      </Button>
                    </motion.div>
                  ))}
                  {selectedColors.map(color => (
                    <motion.div
                      key={color}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleColor(color)}
                        className="h-7 gap-1"
                      >
                        {color}
                        <X size={14} weight="bold" />
                      </Button>
                    </motion.div>
                  ))}
                  {selectedMaterials.map(material => (
                    <motion.div
                      key={material}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleMaterial(material)}
                        className="h-7 gap-1"
                      >
                        {material}
                        <X size={14} weight="bold" />
                      </Button>
                    </motion.div>
                  ))}
                  {inStockOnly && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setInStockOnly(false)}
                        className="h-7 gap-1"
                      >
                        In Stock Only
                        <X size={14} weight="bold" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}

              <motion.div
                layout
                className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8' : 'flex flex-col gap-6'}
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
        </div>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <WishlistDrawer open={wishlistOpen} onOpenChange={setWishlistOpen} />
      <Toaster />
    </div>
  )
}
