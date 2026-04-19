import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Product } from '@/lib/types'
import { Plus, Pencil, Trash, Package } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function AdminProductsTab() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    description: '',
    category: 'upholstered' as 'upholstered' | 'bespoke',
    width: '',
    length: '',
    height: '',
    materials: '',
    colors: '',
    images: '',
    features: '',
    inStock: true
  })

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      price: '',
      description: '',
      category: 'upholstered',
      width: '',
      length: '',
      height: '',
      materials: '',
      colors: '',
      images: '',
      features: '',
      inStock: true
    })
  }

  const handleAdd = () => {
    if (!formData.name || !formData.slug || !formData.price) {
      toast.error('Please fill in required fields')
      return
    }

    addProduct({
      name: formData.name,
      slug: formData.slug,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      dimensions: {
        width: parseFloat(formData.width) || 0,
        length: parseFloat(formData.length) || 0,
        height: parseFloat(formData.height) || 0
      },
      materials: formData.materials.split(',').map(m => m.trim()),
      colors: formData.colors.split(',').map(c => c.trim()),
      images: formData.images.split(',').map(i => i.trim()),
      features: formData.features.split(',').map(f => f.trim()),
      inStock: formData.inStock
    })

    toast.success('Product added successfully')
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      width: product.dimensions.width.toString(),
      length: product.dimensions.length.toString(),
      height: product.dimensions.height.toString(),
      materials: product.materials.join(', '),
      colors: product.colors.join(', '),
      images: product.images.join(', '),
      features: product.features.join(', '),
      inStock: product.inStock
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!editingProduct) return

    updateProduct(editingProduct.id, {
      name: formData.name,
      slug: formData.slug,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      dimensions: {
        width: parseFloat(formData.width) || 0,
        length: parseFloat(formData.length) || 0,
        height: parseFloat(formData.height) || 0
      },
      materials: formData.materials.split(',').map(m => m.trim()),
      colors: formData.colors.split(',').map(c => c.trim()),
      images: formData.images.split(',').map(i => i.trim()),
      features: formData.features.split(',').map(f => f.trim()),
      inStock: formData.inStock
    })

    toast.success('Product updated successfully')
    setIsEditDialogOpen(false)
    setEditingProduct(null)
    resetForm()
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id)
      toast.success('Product deleted successfully')
    }
  }

  const ProductForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (£) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as 'upholstered' | 'bespoke' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upholstered">Upholstered</SelectItem>
              <SelectItem value="bespoke">Bespoke</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">Width (cm)</Label>
          <Input
            id="width"
            type="number"
            value={formData.width}
            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="length">Length (cm)</Label>
          <Input
            id="length"
            type="number"
            value={formData.length}
            onChange={(e) => setFormData({ ...formData, length: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="materials">Materials (comma-separated)</Label>
        <Input
          id="materials"
          value={formData.materials}
          onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
          placeholder="Premium velvet, Solid pine frame, High-density foam"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="colors">Colors (comma-separated)</Label>
        <Input
          id="colors"
          value={formData.colors}
          onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
          placeholder="Forest Green, Navy Blue, Charcoal Grey"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Image URLs (comma-separated)</Label>
        <Textarea
          id="images"
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          rows={2}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Input
          id="features"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          placeholder="Deep button tufting, Wingback headboard, Made in Leeds"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="inStock"
          checked={formData.inStock}
          onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
          className="w-4 h-4"
        />
        <Label htmlFor="inStock">In Stock</Label>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products Management</CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Create a new product in your catalog</DialogDescription>
              </DialogHeader>
              <ProductForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products yet. Add your first product to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>£{product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={product.inStock ? 'default' : 'destructive'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id, product.name)}
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product information</DialogDescription>
            </DialogHeader>
            <ProductForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
