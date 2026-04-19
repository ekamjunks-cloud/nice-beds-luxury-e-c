import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowUp,
  ShoppingCart,
  Package,
  Users,
  TrendUp,
  TrendDown
} from '@phosphor-icons/react'

export function AdminDashboardTab() {
  const { stats, orders } = useAdmin()
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <TrendUp size={20} className="text-accent" weight="bold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-semibold text-foreground">
              £{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUp size={14} className="text-accent" weight="bold" />
              12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart size={20} className="text-primary" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-semibold text-foreground">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.recentOrders} in the last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package size={20} className="text-secondary" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-semibold text-foreground">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users size={20} className="text-accent" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-semibold text-foreground">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Orders</CardTitle>
            <CardDescription>Require immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-semibold text-foreground">
              {stats.pendingOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Low Stock Items</CardTitle>
            <CardDescription>Items below 10 units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-semibold text-foreground">
              {stats.lowStockProducts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Discounts</CardTitle>
            <CardDescription>Currently available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-semibold text-foreground">
              {stats.activeDiscounts}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={
                      order.status === 'pending' ? 'secondary' :
                      order.status === 'delivered' ? 'default' : 'outline'
                    }>
                      {order.status}
                    </Badge>
                    <p className="font-semibold text-lg">
                      £{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
