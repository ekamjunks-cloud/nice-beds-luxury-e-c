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

const fabricOptions = [
  { 
    name: 'Naples',
    texture: 'Smooth, durable linen-like finish',
    price: 0,
    description: 'Classic and versatile'
  },
  { 
    name: 'Plush Velvet',
    texture: 'Soft, luxurious tactile experience',
    price: 150,
    popular: true,
    description: 'Rich and opulent feel'
  },
]

const colorOptions = [
  { name: 'Dove Grey', hex: '#A8A9AD', family: 'neutral' },
  { name: 'Charcoal', hex: '#36454F', family: 'dark' },
  { name: 'Navy Blue', hex: '#1A2B47', family: 'dark' },
  { name: 'Forest Green', hex: '#2C5530', family: 'dark' },
  { name: 'Blush Pink', hex: '#DE9898', family: 'warm' },
  { name: 'Cream', hex: '#FFFDD0', family: 'neutral' },
  { name: 'Stone Beige', hex: '#C9B99B', family: 'neutral' },
  { name: 'Deep Teal', hex: '#1B4D4D', family: 'dark' },
  { name: 'Burgundy', hex: '#6B2F3E', family: 'dark' },
  { name: 'Champagne', hex: '#F7E7CE', family: 'warm' },
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
    
    const fabric = fabricOptions.find(f => f.name === customization.fabric)
    if (fabric) total += fabric.price
    
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

  return (
    <div className={cn('space-y-8', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-2xl font-medium text-foreground">
            Select Size
          </h3>
          <Badge variant="secondary" className="text-sm">Step 1</Badge>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {sizeOptions.map((size) => (
            <motion.div
              key={size.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => updateCustomization({ size: size.name as BedCustomization['size'] })}
                className={cn(
                  'relative p-5 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg',
                  customization.size === size.name
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border hover:border-accent/50'
                )}
              >
                {size.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                    Popular
                  </Badge>
                )}
                {customization.size === size.name && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <Check size={16} weight="bold" className="text-accent-foreground" />
                  </div>
                )}
                <h4 className="font-heading text-xl font-medium mb-1">{size.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{size.dimensions}</p>
                <p className="text-xs text-muted-foreground mb-3">{size.description}</p>
                <p className="font-semibold text-primary">
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-2xl font-medium text-foreground">
            Choose Fabric
          </h3>
          <Badge variant="secondary" className="text-sm">Step 2</Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {fabricOptions.map((fabric) => (
            <motion.div
              key={fabric.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => updateCustomization({ fabric: fabric.name as BedCustomization['fabric'] })}
                className={cn(
                  'relative p-6 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg',
                  customization.fabric === fabric.name
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border hover:border-accent/50'
                )}
              >
                {fabric.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                    Popular
                  </Badge>
                )}
                {customization.fabric === fabric.name && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <Check size={16} weight="bold" className="text-accent-foreground" />
                  </div>
                )}
                <h4 className="font-heading text-xl font-medium mb-1">{fabric.name}</h4>
                <p className="text-sm text-muted-foreground italic mb-2">{fabric.texture}</p>
                <p className="text-xs text-muted-foreground mb-3">{fabric.description}</p>
                <p className="font-semibold text-primary">
                  {fabric.price === 0 ? 'Included' : `+£${fabric.price}`}
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
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-2xl font-medium text-foreground">
            Pick Your Color
          </h3>
          <Badge variant="secondary" className="text-sm">Step 3</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {colorOptions.map((color) => (
            <motion.div
              key={color.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => updateCustomization({ color: color.name })}
                className={cn(
                  'w-full group relative transition-all duration-300',
                  customization.color === color.name && 'scale-105'
                )}
              >
                <div
                  className={cn(
                    'aspect-square rounded-lg mb-2 border-4 transition-all duration-300',
                    customization.color === color.name
                      ? 'border-accent ring-4 ring-accent/20 shadow-lg'
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
                        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center">
                          <Check size={20} weight="bold" className="text-accent" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className={cn(
                  'text-sm font-medium transition-colors',
                  customization.color === color.name ? 'text-accent' : 'text-foreground'
                )}>
                  {color.name}
                </p>
              </button>
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-2xl font-medium text-foreground">
            Storage & Base Options
          </h3>
          <Badge variant="secondary" className="text-sm">Step 4</Badge>
        </div>
        <div className="space-y-4">
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
                  'p-5 cursor-pointer transition-all duration-300 border-2 hover:shadow-md',
                  (option.id === 'ottoman' && customization.ottomanStorage) ||
                  (option.id === 'metalBase' && customization.metalBase)
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-heading text-lg font-medium mb-1">{option.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                    {option.requiresGasLift && customization.ottomanStorage && (
                      <Badge variant="outline" className="text-xs">
                        Includes gas lift mechanism
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-primary">+£{option.price}</p>
                    <div
                      className={cn(
                        'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300',
                        (option.id === 'ottoman' && customization.ottomanStorage) ||
                        (option.id === 'metalBase' && customization.metalBase)
                          ? 'bg-accent border-accent'
                          : 'border-border'
                      )}
                    >
                      {((option.id === 'ottoman' && customization.ottomanStorage) ||
                        (option.id === 'metalBase' && customization.metalBase)) && (
                        <Check size={16} weight="bold" className="text-accent-foreground" />
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
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-2xl font-medium text-foreground">
            Base Type
          </h3>
          <Badge variant="secondary" className="text-sm">Step 5</Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {baseOptions.map((base) => (
            <motion.div
              key={base.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => updateCustomization({ baseType: base.name as BedCustomization['baseType'] })}
                className={cn(
                  'relative p-5 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg',
                  customization.baseType === base.name
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border hover:border-accent/50'
                )}
              >
                {base.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                    Popular
                  </Badge>
                )}
                {customization.baseType === base.name && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <Check size={16} weight="bold" className="text-accent-foreground" />
                  </div>
                )}
                <h4 className="font-heading text-xl font-medium mb-1">{base.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{base.description}</p>
                <p className="font-semibold text-primary">
                  {base.price === 0 ? 'Included' : `+£${base.price}`}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Separator className="my-8" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-2 border-accent rounded-lg p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-heading text-xl font-medium">Customization Extras</h4>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Additional cost</p>
            <p className="font-heading text-3xl font-medium text-primary">
              +£{calculatePrice()}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{customization.size}</Badge>
          <Badge variant="secondary">{customization.fabric}</Badge>
          <Badge variant="secondary">{customization.color}</Badge>
          {customization.ottomanStorage && <Badge variant="secondary">Ottoman Storage</Badge>}
          {customization.gasLift && <Badge variant="secondary">Gas Lift</Badge>}
          {customization.metalBase && <Badge variant="secondary">Metal Base</Badge>}
          <Badge variant="secondary">{customization.baseType} Base</Badge>
        </div>
      </motion.div>
    </div>
  )
}
