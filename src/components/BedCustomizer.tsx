import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Check, ShoppingCart, Ruler, Swatches, Palette, Package, Vault, HardDrives, Rows, Spinner } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface BedCustomization {
  size: 'Double' | 'King' | 'Super King'
  fabric: 'Naples' | 'Plush Velvet'
  color: string
  ottomanStorage: boolean
  gasLift: boolean
  metalBase: boolean
  baseType: 'Slats' | 'Board'
}

interface BedCustomizerProps {
  onCustomizationChange?: (customization: BedCustomization) => void
  basePrice?: number
  onBuyNow?: () => void
  className?: string
}

const sizeOptions = [
  { 
    name: 'Double', 
    dimensions: '135 × 190 cm',
    price: 0,
    description: 'Perfect for single sleepers or cozy couples'
  },
  { 
    name: 'King', 
    dimensions: '150 × 200 cm',
    price: 200,
    popular: true,
    description: 'Most popular choice for comfort'
  },
  { 
    name: 'Super King', 
    dimensions: '180 × 200 cm',
    price: 400,
    description: 'Ultimate luxury and space'
  },
]

const fabricColorOptions = [
  { 
    fabric: 'Naples',
    texture: 'Smooth, durable linen-like finish',
    price: 0,
    description: 'Classic and versatile',
    colors: [
      { name: 'Dove Grey', hex: '#A8A9AD' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Navy Blue', hex: '#1A2B47' },
      { name: 'Forest Green', hex: '#2C5530' },
      { name: 'Blush Pink', hex: '#DE9898' },
      { name: 'Cream', hex: '#FFFDD0' },
      { name: 'Stone Beige', hex: '#C9B99B' },
      { name: 'Deep Teal', hex: '#1B4D4D' },
      { name: 'Burgundy', hex: '#6B2F3E' },
      { name: 'Champagne', hex: '#F7E7CE' },
    ]
  },
  { 
    fabric: 'Plush Velvet',
    texture: 'Soft, luxurious tactile experience',
    price: 150,
    popular: true,
    description: 'Rich and opulent feel',
    colors: [
      { name: 'Dove Grey', hex: '#A8A9AD' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Navy Blue', hex: '#1A2B47' },
      { name: 'Forest Green', hex: '#2C5530' },
      { name: 'Blush Pink', hex: '#DE9898' },
      { name: 'Cream', hex: '#FFFDD0' },
      { name: 'Stone Beige', hex: '#C9B99B' },
      { name: 'Deep Teal', hex: '#1B4D4D' },
      { name: 'Burgundy', hex: '#6B2F3E' },
      { name: 'Champagne', hex: '#F7E7CE' },
    ]
  },
]

const storageOptions = [
  { 
    id: 'ottoman',
    name: 'Ottoman Storage',
    description: 'Hydraulic lift mechanism with spacious storage',
    price: 250,
    requiresGasLift: true
  },
  { 
    id: 'metalBase',
    name: 'Metal Base',
    description: 'Sturdy reinforced metal frame',
    price: 100
  },
]

const baseOptions = [
  { 
    name: 'Slats',
    description: 'Flexible wooden slats for better ventilation',
    price: 0,
    popular: true
  },
  { 
    name: 'Board',
    description: 'Solid base for firm support',
    price: 50
  },
]

export function BedCustomizer({ onCustomizationChange, basePrice = 0, onBuyNow, className }: BedCustomizerProps) {
  const [customization, setCustomization] = useState<BedCustomization>({
    size: 'King',
    fabric: 'Plush Velvet',
    color: 'Dove Grey',
    ottomanStorage: false,
    gasLift: false,
    metalBase: false,
    baseType: 'Slats'
  })

  const updateCustomization = (updates: Partial<BedCustomization>) => {
    const newCustomization = { ...customization, ...updates }
    
    if (updates.ottomanStorage === false) {
      newCustomization.gasLift = false
    }
    
    if (updates.ottomanStorage === true && !newCustomization.gasLift) {
      newCustomization.gasLift = true
    }
    
    setCustomization(newCustomization)
    onCustomizationChange?.(newCustomization)
  }

  const calculatePrice = () => {
    let total = 0
    
    const size = sizeOptions.find(s => s.name === customization.size)
    if (size) total += size.price
    
    const fabricOption = fabricColorOptions.find(f => f.fabric === customization.fabric)
    if (fabricOption) total += fabricOption.price
    
    if (customization.ottomanStorage) {
      const ottoman = storageOptions.find(s => s.id === 'ottoman')
      if (ottoman) total += ottoman.price
    }
    
    if (customization.metalBase) {
      const metal = storageOptions.find(s => s.id === 'metalBase')
      if (metal) total += metal.price
    }
    
    const base = baseOptions.find(b => b.name === customization.baseType)
    if (base) total += base.price
    
    return total
  }

  const selectedFabricOption = fabricColorOptions.find(f => f.fabric === customization.fabric)

  return (
    <div className={cn('space-y-4 md:space-y-5', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-2.5 md:mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Ruler size={16} weight="bold" className="text-accent md:w-[18px] md:h-[18px]" />
            </div>
            <h3 className="font-heading text-lg md:text-xl font-medium text-foreground">
              Size
            </h3>
          </div>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">Step 1</Badge>
        </div>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
          {sizeOptions.map((size) => (
            <motion.div
              key={size.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => updateCustomization({ size: size.name as BedCustomization['size'] })}
                className={cn(
                  'relative p-3 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg h-full',
                  customization.size === size.name
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border hover:border-accent/50'
                )}
              >
                {size.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-0.5">
                    Popular
                  </Badge>
                )}
                {customization.size === size.name && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Check size={14} weight="bold" className="text-accent-foreground" />
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-heading text-base md:text-lg font-medium pr-6">{size.name}</h4>
                  <p className="font-semibold text-sm text-primary whitespace-nowrap">
                    {size.price === 0 ? 'Base' : `+£${size.price}`}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{size.dimensions}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Separator className="my-4 md:my-5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2.5 md:mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Swatches size={16} weight="bold" className="text-accent md:w-[18px] md:h-[18px]" />
            </div>
            <h3 className="font-heading text-lg md:text-xl font-medium text-foreground">
              Fabric & Color
            </h3>
          </div>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">Step 2</Badge>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {fabricColorOptions.map((fabricOption) => (
              <motion.div
                key={fabricOption.fabric}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  onClick={() => updateCustomization({ fabric: fabricOption.fabric as BedCustomization['fabric'] })}
                  className={cn(
                    'relative p-3 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg h-full',
                    customization.fabric === fabricOption.fabric
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                      : 'border-border hover:border-accent/50'
                  )}
                >
                  {fabricOption.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-0.5">
                      Popular
                    </Badge>
                  )}
                  {customization.fabric === fabricOption.fabric && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                      <Check size={14} weight="bold" className="text-accent-foreground" />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-heading text-base md:text-lg font-medium pr-6">{fabricOption.fabric}</h4>
                    <p className="font-semibold text-sm text-primary whitespace-nowrap">
                      {fabricOption.price === 0 ? 'Base' : `+£${fabricOption.price}`}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground italic">{fabricOption.texture}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedFabricOption && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="pt-1"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <Palette size={14} weight="bold" className="text-accent" />
                <h4 className="font-heading text-base md:text-lg font-medium text-foreground">
                  Colors
                </h4>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {selectedFabricOption.colors.map((color) => (
                  <motion.div
                    key={color.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => updateCustomization({ color: color.name })}
                      className="w-full group relative transition-all duration-300"
                    >
                      <div
                        className={cn(
                          'aspect-square rounded-lg mb-1.5 border-3 transition-all duration-300',
                          customization.color === color.name
                            ? 'border-accent ring-4 ring-accent/20 shadow-lg scale-105'
                            : 'border-border group-hover:border-accent/50 group-hover:shadow-md'
                        )}
                        style={{ backgroundColor: color.hex }}
                      >
                        <AnimatePresence>
                          {customization.color === color.name && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-full h-full flex items-center justify-center"
                            >
                              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md">
                                <Check size={16} weight="bold" className="text-accent" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className={cn(
                        'text-xs font-medium transition-colors text-center leading-tight',
                        customization.color === color.name ? 'text-accent font-semibold' : 'text-foreground'
                      )}>
                        {color.name}
                      </p>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <Separator className="my-4 md:my-5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-2.5 md:mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Package size={16} weight="bold" className="text-accent md:w-[18px] md:h-[18px]" />
            </div>
            <h3 className="font-heading text-lg md:text-xl font-medium text-foreground">
              Storage & Base
            </h3>
          </div>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">Step 3</Badge>
        </div>
        <div className="space-y-2.5">
          {storageOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card
                onClick={() => {
                  if (option.id === 'ottoman') {
                    updateCustomization({ ottomanStorage: !customization.ottomanStorage })
                  } else if (option.id === 'metalBase') {
                    updateCustomization({ metalBase: !customization.metalBase })
                  }
                }}
                className={cn(
                  'p-3 cursor-pointer transition-all duration-300 border-2 hover:shadow-md',
                  (option.id === 'ottoman' && customization.ottomanStorage) ||
                  (option.id === 'metalBase' && customization.metalBase)
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      (option.id === 'ottoman' && customization.ottomanStorage) ||
                      (option.id === 'metalBase' && customization.metalBase)
                        ? 'bg-accent/20'
                        : 'bg-muted'
                    )}>
                      {option.id === 'ottoman' ? (
                        <Vault size={18} weight="duotone" className={cn(
                          "transition-colors",
                          customization.ottomanStorage ? "text-accent" : "text-muted-foreground"
                        )} />
                      ) : (
                        <Spinner size={18} weight="duotone" className={cn(
                          "transition-colors",
                          customization.metalBase ? "text-accent" : "text-muted-foreground"
                        )} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-base font-medium mb-0.5">{option.name}</h4>
                      <p className="text-xs text-muted-foreground leading-snug">{option.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <p className="font-semibold text-sm text-primary whitespace-nowrap">+£{option.price}</p>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0',
                        (option.id === 'ottoman' && customization.ottomanStorage) ||
                        (option.id === 'metalBase' && customization.metalBase)
                          ? 'bg-accent border-accent'
                          : 'border-border'
                      )}
                    >
                      {((option.id === 'ottoman' && customization.ottomanStorage) ||
                        (option.id === 'metalBase' && customization.metalBase)) && (
                        <Check size={14} weight="bold" className="text-accent-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Separator className="my-4 md:my-5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2.5 md:mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <HardDrives size={16} weight="bold" className="text-accent md:w-[18px] md:h-[18px]" />
            </div>
            <h3 className="font-heading text-lg md:text-xl font-medium text-foreground">
              Base Type
            </h3>
          </div>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">Step 4</Badge>
        </div>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {baseOptions.map((base) => (
            <motion.div
              key={base.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => updateCustomization({ baseType: base.name as BedCustomization['baseType'] })}
                className={cn(
                  'relative p-3 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg h-full',
                  customization.baseType === base.name
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border hover:border-accent/50'
                )}
              >
                {base.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-0.5">
                    Popular
                  </Badge>
                )}
                {customization.baseType === base.name && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Check size={14} weight="bold" className="text-accent-foreground" />
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-heading text-base md:text-lg font-medium pr-6">{base.name}</h4>
                  <p className="font-semibold text-sm text-primary whitespace-nowrap">
                    {base.price === 0 ? 'Base' : `+£${base.price}`}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{base.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Separator className="my-5 md:my-6" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-2 border-accent rounded-xl p-3.5 md:p-4 shadow-xl"
      >
        <div className="space-y-2.5 md:space-y-3">
          <div className="grid grid-cols-3 gap-2.5 md:gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-0.5">Base</p>
              <p className="font-heading text-base md:text-lg font-medium text-foreground">
                £{basePrice.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-0.5">Extras</p>
              <p className="font-heading text-base md:text-lg font-medium text-primary">
                +£{calculatePrice()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-0.5">Total</p>
              <p className="font-heading text-xl md:text-2xl font-semibold text-accent">
                £{(basePrice + calculatePrice()).toLocaleString()}
              </p>
            </div>
          </div>
          
          <Separator className="bg-border/50" />
          
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">{customization.size}</Badge>
            <Badge variant="secondary" className="text-xs px-2 py-0.5">{customization.fabric}</Badge>
            <Badge variant="secondary" className="text-xs px-2 py-0.5">{customization.color}</Badge>
            {customization.ottomanStorage && <Badge variant="secondary" className="text-xs px-2 py-0.5">Ottoman</Badge>}
            {customization.gasLift && <Badge variant="secondary" className="text-xs px-2 py-0.5">Gas Lift</Badge>}
            {customization.metalBase && <Badge variant="secondary" className="text-xs px-2 py-0.5">Metal Base</Badge>}
            <Badge variant="secondary" className="text-xs px-2 py-0.5">{customization.baseType}</Badge>
          </div>

          {onBuyNow && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onBuyNow}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 font-semibold text-base md:text-lg h-11 md:h-12"
                size="lg"
              >
                <ShoppingCart size={20} weight="bold" className="mr-2" />
                Buy Now - £{(basePrice + calculatePrice()).toLocaleString()}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
