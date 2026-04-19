import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Order } from '@/lib/types'
import { format } from 'date-fns'
import { ShoppingCart } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function AdminOrdersTab() {
  const { orders, updateOrder } = useAdmin()

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'confirmed': return 'default'
      case 'in-production': return 'outline'
      case 'quality-check': return 'outline'
      case 'ready-for-delivery': return 'default'
      case 'out-for-delivery': return 'default'
      case 'delivered': return 'default'
      default: return 'secondary'
    }
  }

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrder(orderId, { status: newStatus })
    toast.success('Order status updated')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Management</CardTitle>
        <CardDescription>View and manage all customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium font-mono text-sm">
                    {order.id.substring(0, 20)}...
                  </TableCell>
                  <TableCell>{format(order.createdAt, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell className="font-semibold">£{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status.replace(/-/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                    >
                      <SelectTrigger className="w-[180px] ml-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in-production">In Production</SelectItem>
                        <SelectItem value="quality-check">Quality Check</SelectItem>
                        <SelectItem value="ready-for-delivery">Ready for Delivery</SelectItem>
                        <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
