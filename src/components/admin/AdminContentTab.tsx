import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash, Ticket, MegaphoneSimple, Bell } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function AdminContentTab() {
  const { discounts, addDiscount, updateDiscount, deleteDiscount, updateRequests } = useAdmin()
  const [isAddDiscountDialogOpen, setIsAddDiscountDialogOpen] = useState(false)
  const [discountFormData, setDiscountFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    description: '',
    minPurchase: '',
    maxUses: ''
  })

  const resetDiscountForm = () => {
    setDiscountFormData({
      code: '',
      type: 'percentage',
      value: '',
      description: '',
      minPurchase: '',
      maxUses: ''
    })
  }

  const handleAddDiscount = () => {
    if (!discountFormData.code || !discountFormData.value) {
      toast.error('Please fill in all required fields')
      return
    }

    const newDiscount = {
      id: `DISC-${Date.now()}`,
      code: discountFormData.code.toUpperCase(),
      type: discountFormData.type,
      value: parseFloat(discountFormData.value),
      description: discountFormData.description,
      minPurchase: discountFormData.minPurchase ? parseFloat(discountFormData.minPurchase) : undefined,
      maxUses: discountFormData.maxUses ? parseInt(discountFormData.maxUses) : undefined,
      usedCount: 0,
      isActive: true,
      createdAt: Date.now()
    }

    addDiscount(newDiscount)
    toast.success('Discount code created successfully')
    setIsAddDiscountDialogOpen(false)
    resetDiscountForm()
  }

  const handleToggleDiscount = (discountId: string) => {
    const discount = discounts.find(d => d.id === discountId)
    if (discount) {
      updateDiscount(discountId, { isActive: !discount.isActive })
      toast.success(discount.isActive ? 'Discount deactivated' : 'Discount activated')
    }
  }

  const handleDeleteDiscount = (discountId: string) => {
    if (confirm('Are you sure you want to delete this discount code?')) {
      deleteDiscount(discountId)
      toast.success('Discount deleted successfully')
    }
  }

  const pendingRequests = updateRequests.filter(r => r.status === 'pending')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-semibold">Content & Marketing</h2>
          <p className="text-muted-foreground mt-1">Manage discounts, promotions, and customer communications</p>
        </div>
      </div>

      <Tabs defaultValue="discounts">
        <TabsList>
          <TabsTrigger value="discounts">
            <Ticket size={16} className="mr-2" />
            Discount Codes
          </TabsTrigger>
          <TabsTrigger value="promotions">
            <MegaphoneSimple size={16} className="mr-2" />
            Promotions
          </TabsTrigger>
          <TabsTrigger value="requests">
            <Bell size={16} className="mr-2" />
            Customer Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discounts" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {discounts.length} total discount codes ({discounts.filter(d => d.isActive).length} active)
            </p>
            <Dialog open={isAddDiscountDialogOpen} onOpenChange={setIsAddDiscountDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={18} className="mr-2" weight="bold" />
                  Create Discount
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Discount Code</DialogTitle>
                  <DialogDescription>Set up a new promotional discount</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount-code">Discount Code *</Label>
                    <Input
                      id="discount-code"
                      value={discountFormData.code}
                      onChange={(e) => setDiscountFormData({ ...discountFormData, code: e.target.value.toUpperCase() })}
                      placeholder="SUMMER2024"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount-type">Discount Type</Label>
                      <Select
                        value={discountFormData.type}
                        onValueChange={(value) => setDiscountFormData({ ...discountFormData, type: value as any })}
                      >
                        <SelectTrigger id="discount-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount-value">
                        Value * {discountFormData.type === 'percentage' ? '(%)' : '(£)'}
                      </Label>
                      <Input
                        id="discount-value"
                        type="number"
                        value={discountFormData.value}
                        onChange={(e) => setDiscountFormData({ ...discountFormData, value: e.target.value })}
                        placeholder={discountFormData.type === 'percentage' ? '10' : '50'}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-description">Description</Label>
                    <Textarea
                      id="discount-description"
                      value={discountFormData.description}
                      onChange={(e) => setDiscountFormData({ ...discountFormData, description: e.target.value })}
                      placeholder="Summer sale discount"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount-min">Minimum Purchase (£)</Label>
                      <Input
                        id="discount-min"
                        type="number"
                        value={discountFormData.minPurchase}
                        onChange={(e) => setDiscountFormData({ ...discountFormData, minPurchase: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount-max">Max Uses</Label>
                      <Input
                        id="discount-max"
                        type="number"
                        value={discountFormData.maxUses}
                        onChange={(e) => setDiscountFormData({ ...discountFormData, maxUses: e.target.value })}
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDiscountDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddDiscount}>Create Discount</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No discount codes yet
                    </TableCell>
                  </TableRow>
                ) : (
                  discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold font-mono">{discount.code}</p>
                          {discount.description && (
                            <p className="text-sm text-muted-foreground">{discount.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {discount.type === 'percentage' ? 'Percentage' : 'Fixed'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {discount.type === 'percentage' ? `${discount.value}%` : `£${discount.value}`}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {discount.usedCount} used
                          {discount.maxUses && ` / ${discount.maxUses} max`}
                        </p>
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
                            onClick={() => handleToggleDiscount(discount.id)}
                          >
                            {discount.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDiscount(discount.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotional Campaigns</CardTitle>
              <CardDescription>Create and manage marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12 text-muted-foreground">
              <MegaphoneSimple size={48} className="mx-auto mb-4 opacity-50" />
              <p>Promotional campaign management coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Update Requests</CardTitle>
              <CardDescription>Messages from customers about their orders</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">Order: {request.orderId}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge>Pending</Badge>
                      </div>
                      <p className="text-sm mt-2">{request.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
