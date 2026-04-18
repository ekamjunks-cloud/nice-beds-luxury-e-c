import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Check } from '@phosphor-icons/react'
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

export function BedCustomizer({ onCustomizationChange, className }: BedCustomizerProps) {
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
    <div className={cn('space-y-6', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground">
            Select Size
          </h3>
          <Badge variant="secondary" className="text-xs">Step 1</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sizeOptions.map((size) => (
            <motion.div
              key={size.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => updateCustomization({ size: size.name as BedCustomization['size'] })}
                className={cn(
                  'relative p-4 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg h-full',
                  customization.size === size.name
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border hover:border-accent/50'
                )}
              >
                {size.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs">
                    Popular
                  </Badge>
                )}
                {customization.size === size.name && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Check size={14} weight="bold" className="text-accent-foreground" />
                  </div>
                )}
                <h4 className="font-heading text-lg md:text-xl font-medium mb-1 pr-8">{size.name}</h4>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">{size.dimensions}</p>
                <p className="text-xs text-muted-foreground mb-2 leading-snug">{size.description}</p>
                <p className="font-semibold text-sm md:text-base text-primary">
                  {size.price === 0 ? 'Base price' : `+£${size.price}`}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Separator />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground">
            Choose Fabric & Color
          </h3>
          <Badge variant="secondary" className="text-xs">Step 2</Badge>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fabricColorOptions.map((fabricOption) => (
              <motion.div
                key={fabricOption.fabric}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  onClick={() => updateCustomization({ fabric: fabricOption.fabric as BedCustomization['fabric'] })}
                  className={cn(
                    'relative p-4 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg h-full',
                    customization.fabric === fabricOption.fabric
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                      : 'border-border hover:border-accent/50'
                  )}
                >
                  {fabricOption.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs">
                      Popular
                    </Badge>
                  )}
                  {customization.fabric === fabricOption.fabric && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                      <Check size={14} weight="bold" className="text-accent-foreground" />
                    </div>
                  )}
                  <h4 className="font-heading text-lg md:text-xl font-medium mb-1 pr-8">{fabricOption.fabric}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground italic mb-1">{fabricOption.texture}</p>
                  <p className="text-xs text-muted-foreground mb-2 leading-snug">{fabricOption.description}</p>
                  <p className="font-semibold text-sm md:text-base text-primary">
                    {fabricOption.price === 0 ? 'Included' : `+£${fabricOption.price}`}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedFabricOption && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-heading text-lg md:text-xl font-medium text-foreground mb-4">
                Available Colors for {customization.fabric}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
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
                          'aspect-square rounded-lg mb-2 border-3 transition-all duration-300',
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
                                <Check size={18} weight="bold" className="text-accent" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className={cn(
                        'text-xs md:text-sm font-medium transition-colors text-center leading-tight',
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

      <Separator />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground">
            Storage & Base Options
          </h3>
          <Badge variant="secondary" className="text-xs">Step 3</Badge>
        </div>
        <div className="space-y-3">
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
                  'p-4 cursor-pointer transition-all duration-300 border-2 hover:shadow-md',
                  (option.id === 'ottoman' && customization.ottomanStorage) ||
                  (option.id === 'metalBase' && customization.metalBase)
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading text-base md:text-lg font-medium mb-1">{option.name}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 leading-snug">{option.description}</p>
                    {option.requiresGasLift && customization.ottomanStorage && (
                      <Badge variant="outline" className="text-xs">
                        Includes gas lift mechanism
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="font-semibold text-sm md:text-base text-primary whitespace-nowrap">+£{option.price}</p>
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

      <Separator />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground">
            Base Type
          </h3>
          <Badge variant="secondary" className="text-xs">Step 4</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {baseOptions.map((base) => (
            <motion.div
              key={base.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => updateCustomization({ baseType: base.name as BedCustomization['baseType'] })}
                className={cn(
                  'relative p-4 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg h-full',
                  customization.baseType === base.name
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border hover:border-accent/50'
                )}
              >
                {base.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs">
                    Popular
                  </Badge>
                )}
                {customization.baseType === base.name && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Check size={14} weight="bold" className="text-accent-foreground" />
                  </div>
                )}
                <h4 className="font-heading text-lg md:text-xl font-medium mb-1 pr-8">{base.name}</h4>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 leading-snug">{base.description}</p>
                <p className="font-semibold text-sm md:text-base text-primary">
                  {base.price === 0 ? 'Included' : `+£${base.price}`}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Separator className="my-6" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-2 border-accent rounded-lg p-5 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
          <h4 className="font-heading text-lg md:text-xl font-medium">Customization Extras</h4>
          <div className="text-left sm:text-right">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Additional cost</p>
            <p className="font-heading text-2xl md:text-3xl font-medium text-primary">
              +£{calculatePrice()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">{customization.size}</Badge>
          <Badge variant="secondary" className="text-xs">{customization.fabric}</Badge>
          <Badge variant="secondary" className="text-xs">{customization.color}</Badge>
          {customization.ottomanStorage && <Badge variant="secondary" className="text-xs">Ottoman Storage</Badge>}
          {customization.gasLift && <Badge variant="secondary" className="text-xs">Gas Lift</Badge>}
          {customization.metalBase && <Badge variant="secondary" className="text-xs">Metal Base</Badge>}
          <Badge variant="secondary" className="text-xs">{customization.baseType} Base</Badge>
        </div>
      </motion.div>
    </div>
  )
}
