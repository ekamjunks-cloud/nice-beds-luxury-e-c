import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Discount } from '@/lib/admin-types'
import { Plus, Pencil, Trash, Ticket } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function AdminDiscountsTab() {
  const { discounts, addDiscount, updateDiscount, deleteDiscount } = useAdmin()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    description: '',
    minPurchase: '',
    maxUses: '',
    expiresAt: '',
    isActive: true
  })

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      description: '',
      minPurchase: '',
      maxUses: '',
      expiresAt: '',
      isActive: true
    })
  }

  const handleAdd = () => {
    if (!formData.code || !formData.value) {
      toast.error('Please fill in required fields')
      return
    }

    addDiscount({
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      description: formData.description,
      minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : undefined,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).getTime() : undefined,
      isActive: formData.isActive
    })

    toast.success('Discount code created successfully')
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount)
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value.toString(),
      description: discount.description,
      minPurchase: discount.minPurchase?.toString() || '',
      maxUses: discount.maxUses?.toString() || '',
      expiresAt: discount.expiresAt ? format(discount.expiresAt, 'yyyy-MM-dd') : '',
      isActive: discount.isActive
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!editingDiscount) return

    updateDiscount(editingDiscount.id, {
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      description: formData.description,
      minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : undefined,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).getTime() : undefined,
      isActive: formData.isActive
    })

    toast.success('Discount updated successfully')
    setIsEditDialogOpen(false)
    setEditingDiscount(null)
    resetForm()
  }

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete discount code "${code}"?`)) {
      deleteDiscount(id)
      toast.success('Discount deleted successfully')
    }
  }

  const DiscountForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Discount Code *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="SUMMER2024"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as 'percentage' | 'fixed' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">
          Value * {formData.type === 'percentage' ? '(%)' : '(£)'}
        </Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          placeholder={formData.type === 'percentage' ? '10' : '50'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Summer sale discount"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minPurchase">Min Purchase (£)</Label>
          <Input
            id="minPurchase"
            type="number"
            value={formData.minPurchase}
            onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxUses">Max Uses</Label>
          <Input
            id="maxUses"
            type="number"
            value={formData.maxUses}
            onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
            placeholder="Unlimited"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expiration Date</Label>
        <Input
          id="expiresAt"
          type="date"
          value={formData.expiresAt}
          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4"
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Discount Codes Management</CardTitle>
            <CardDescription>Create and manage discount codes</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Add Discount
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Discount Code</DialogTitle>
                <DialogDescription>Add a new discount code for customers</DialogDescription>
              </DialogHeader>
              <DiscountForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Create Discount</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {discounts.length === 0 ? (
          <div className="text-center py-12">
            <Ticket size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No discount codes yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-mono font-semibold">{discount.code}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{discount.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {discount.type === 'percentage' ? `${discount.value}%` : `£${discount.value}`}
                  </TableCell>
                  <TableCell>
                    {discount.usedCount}
                    {discount.maxUses ? ` / ${discount.maxUses}` : ''}
                  </TableCell>
                  <TableCell>
                    <Badge variant={discount.isActive ? 'default' : 'secondary'}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(discount)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(discount.id, discount.code)}
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
              <DialogTitle>Edit Discount Code</DialogTitle>
              <DialogDescription>Update discount code information</DialogDescription>
            </DialogHeader>
            <DiscountForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Discount</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
