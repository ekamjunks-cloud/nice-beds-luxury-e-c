import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductVariant } from '@/lib/admin-types'
import { Plus, Pencil, Trash, Shapes } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function AdminVariantsTab() {
  const { variants, products, addVariant, updateVariant, deleteVariant } = useAdmin()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [formData, setFormData] = useState({
    productId: '',
    sku: '',
    size: '',
    color: '',
    price: '',
    stock: ''
  })

  const resetForm = () => {
    setFormData({
      productId: '',
      sku: '',
      size: '',
      color: '',
      price: '',
      stock: ''
    })
  }

  const handleAdd = () => {
    if (!formData.productId || !formData.sku || !formData.size || !formData.color) {
      toast.error('Please fill in required fields')
      return
    }

    addVariant({
      productId: formData.productId,
      sku: formData.sku,
      size: formData.size,
      color: formData.color,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0
    })

    toast.success('Variant added successfully')
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant)
    setFormData({
      productId: variant.productId,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      price: variant.price.toString(),
      stock: variant.stock.toString()
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!editingVariant) return

    updateVariant(editingVariant.id, {
      productId: formData.productId,
      sku: formData.sku,
      size: formData.size,
      color: formData.color,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0
    })

    toast.success('Variant updated successfully')
    setIsEditDialogOpen(false)
    setEditingVariant(null)
    resetForm()
  }

  const handleDelete = (id: string, sku: string) => {
    if (confirm(`Are you sure you want to delete variant "${sku}"?`)) {
      deleteVariant(id)
      toast.success('Variant deleted successfully')
    }
  }

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || 'Unknown Product'
  }

  const VariantForm = () => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="productId">Product *</Label>
        <Select
          value={formData.productId}
          onValueChange={(value) => setFormData({ ...formData, productId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="MAY-FG-KG"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Size *</Label>
          <Select
            value={formData.size}
            onValueChange={(value) => setFormData({ ...formData, size: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Double">Double</SelectItem>
              <SelectItem value="King">King</SelectItem>
              <SelectItem value="Super King">Super King</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color *</Label>
        <Input
          id="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          placeholder="Forest Green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (£)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="1299"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="25"
          />
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Product Variants Management</CardTitle>
            <CardDescription>Manage product sizes, colors, and stock levels</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Add Variant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Product Variant</DialogTitle>
                <DialogDescription>Create a new variant for a product</DialogDescription>
              </DialogHeader>
              <VariantForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add Variant</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {variants.length === 0 ? (
          <div className="text-center py-12">
            <Shapes size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No product variants yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="font-medium">{getProductName(variant.productId)}</TableCell>
                  <TableCell className="font-mono text-sm">{variant.sku}</TableCell>
                  <TableCell>{variant.size}</TableCell>
                  <TableCell>{variant.color}</TableCell>
                  <TableCell>£{variant.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={variant.stock < 10 ? 'text-destructive font-semibold' : ''}>
                      {variant.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(variant)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(variant.id, variant.sku)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product Variant</DialogTitle>
              <DialogDescription>Update variant information</DialogDescription>
            </DialogHeader>
            <VariantForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Variant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
