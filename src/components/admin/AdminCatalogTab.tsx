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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Product } from '@/lib/types'
import { Plus, Pencil, Trash, Package, Shapes, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function AdminCatalogTab() {
  const { products, addProduct, updateProduct, deleteProduct, variants, addVariant, updateVariant } = useAdmin()
  const [catalogView, setCatalogView] = useState<'products' | 'variants' | 'inventory'>('products')
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productFormData, setProductFormData] = useState({
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

  const resetProductForm = () => {
    setProductFormData({
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

  const handleAddProduct = () => {
    if (!productFormData.name || !productFormData.slug || !productFormData.price) {
      toast.error('Please fill in all required fields')
      return
    }

    const newProductData = {
      name: productFormData.name,
      slug: productFormData.slug,
      price: parseFloat(productFormData.price),
      description: productFormData.description,
      category: productFormData.category,
      dimensions: {
        width: parseFloat(productFormData.width) || 0,
        length: parseFloat(productFormData.length) || 0,
        height: parseFloat(productFormData.height) || 0
      },
      materials: productFormData.materials.split(',').map(m => m.trim()),
      colors: productFormData.colors.split(',').map(c => c.trim()),
      images: productFormData.images.split(',').map(i => i.trim()),
      features: productFormData.features.split('\n').filter(f => f.trim()),
      inStock: productFormData.inStock
    }

    addProduct(newProductData)
    toast.success('Product added successfully')
    setIsAddProductDialogOpen(false)
    resetProductForm()
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductFormData({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      width: product.dimensions.width.toString(),
      length: product.dimensions.length.toString(),
      height: product.dimensions.height.toString(),
      materials: product.materials?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      images: product.images.join(', '),
      features: product.features?.join('\n') || '',
      inStock: product.inStock
    })
    setIsEditProductDialogOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return

    const updates: Partial<Product> = {
      name: productFormData.name,
      slug: productFormData.slug,
      price: parseFloat(productFormData.price),
      description: productFormData.description,
      category: productFormData.category,
      dimensions: {
        width: parseFloat(productFormData.width) || 0,
        length: parseFloat(productFormData.length) || 0,
        height: parseFloat(productFormData.height) || 0
      },
      materials: productFormData.materials.split(',').map(m => m.trim()),
      colors: productFormData.colors.split(',').map(c => c.trim()),
      images: productFormData.images.split(',').map(i => i.trim()),
      features: productFormData.features.split('\n').filter(f => f.trim()),
      inStock: productFormData.inStock
    }

    updateProduct(editingProduct.id, updates)
    toast.success('Product updated successfully')
    setIsEditProductDialogOpen(false)
    resetProductForm()
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId)
      toast.success('Product deleted successfully')
    }
  }

  const lowStockVariants = variants.filter(v => v.stock < 10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-semibold">Catalog Management</h2>
          <p className="text-muted-foreground mt-1">Manage products, variants, and inventory</p>
        </div>
      </div>

      <Tabs value={catalogView} onValueChange={(v) => setCatalogView(v as any)}>
        <TabsList>
          <TabsTrigger value="products">
            <Package size={16} className="mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="variants">
            <Shapes size={16} className="mr-2" />
            Variants
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Warning size={16} className="mr-2" />
            Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{products.length} total products</p>
            <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={18} className="mr-2" weight="bold" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Create a new bed product</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name *</Label>
                      <Input
                        id="product-name"
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                        placeholder="Luxe Upholstered Bed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-slug">Slug *</Label>
                      <Input
                        id="product-slug"
                        value={productFormData.slug}
                        onChange={(e) => setProductFormData({ ...productFormData, slug: e.target.value })}
                        placeholder="luxe-upholstered-bed"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-price">Price (£) *</Label>
                      <Input
                        id="product-price"
                        type="number"
                        value={productFormData.price}
                        onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                        placeholder="1299"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-category">Category</Label>
                      <Select
                        value={productFormData.category}
                        onValueChange={(value) => setProductFormData({ ...productFormData, category: value as any })}
                      >
                        <SelectTrigger id="product-category">
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
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea
                      id="product-description"
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                      placeholder="Product description..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-width">Width (cm)</Label>
                      <Input
                        id="product-width"
                        type="number"
                        value={productFormData.width}
                        onChange={(e) => setProductFormData({ ...productFormData, width: e.target.value })}
                        placeholder="160"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-length">Length (cm)</Label>
                      <Input
                        id="product-length"
                        type="number"
                        value={productFormData.length}
                        onChange={(e) => setProductFormData({ ...productFormData, length: e.target.value })}
                        placeholder="200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-height">Height (cm)</Label>
                      <Input
                        id="product-height"
                        type="number"
                        value={productFormData.height}
                        onChange={(e) => setProductFormData({ ...productFormData, height: e.target.value })}
                        placeholder="120"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-materials">Materials (comma-separated)</Label>
                    <Input
                      id="product-materials"
                      value={productFormData.materials}
                      onChange={(e) => setProductFormData({ ...productFormData, materials: e.target.value })}
                      placeholder="Velvet, Solid Oak, High-Density Foam"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-colors">Colors (comma-separated)</Label>
                    <Input
                      id="product-colors"
                      value={productFormData.colors}
                      onChange={(e) => setProductFormData({ ...productFormData, colors: e.target.value })}
                      placeholder="Navy Blue, Grey, Cream"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-images">Image URLs (comma-separated)</Label>
                    <Textarea
                      id="product-images"
                      value={productFormData.images}
                      onChange={(e) => setProductFormData({ ...productFormData, images: e.target.value })}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-features">Features (one per line)</Label>
                    <Textarea
                      id="product-features"
                      value={productFormData.features}
                      onChange={(e) => setProductFormData({ ...productFormData, features: e.target.value })}
                      placeholder="Deep button tufting&#10;Premium velvet upholstery&#10;Solid oak legs"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddProduct}>Add Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">£{product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={product.inStock ? 'default' : 'secondary'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          <p className="text-sm text-muted-foreground">{variants.length} total variants across all products</p>
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>Manage sizes, colors, and fabric options</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>{variant.productId}</TableCell>
                      <TableCell>{variant.size}</TableCell>
                      <TableCell>{variant.color}</TableCell>
                      <TableCell>{variant.sku}</TableCell>
                      <TableCell>
                        <Badge variant={variant.stock < 10 ? 'destructive' : 'default'}>
                          {variant.stock} units
                        </Badge>
                      </TableCell>
                      <TableCell>
                        £{variant.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Products with less than 10 units in stock</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockVariants.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">All products are well stocked</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockVariants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>{variant.productId}</TableCell>
                        <TableCell>
                          {variant.size} / {variant.color} / {variant.sku}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{variant.stock} units</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Warning size={14} className="mr-1" weight="fill" />
                            Low Stock
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-product-name">Product Name *</Label>
                <Input
                  id="edit-product-name"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product-slug">Slug *</Label>
                <Input
                  id="edit-product-slug"
                  value={productFormData.slug}
                  onChange={(e) => setProductFormData({ ...productFormData, slug: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-product-price">Price (£) *</Label>
                <Input
                  id="edit-product-price"
                  type="number"
                  value={productFormData.price}
                  onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product-category">Category</Label>
                <Select
                  value={productFormData.category}
                  onValueChange={(value) => setProductFormData({ ...productFormData, category: value as any })}
                >
                  <SelectTrigger id="edit-product-category">
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
              <Label htmlFor="edit-product-description">Description</Label>
              <Textarea
                id="edit-product-description"
                value={productFormData.description}
                onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
