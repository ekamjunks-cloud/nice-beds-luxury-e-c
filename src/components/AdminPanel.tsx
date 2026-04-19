import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChartBar, 
  Package, 
  ShoppingCart, 
  Users, 
  Ticket, 
  Shapes,
  Bell,
  ArrowUp,
  ArrowDown
} from '@phosphor-icons/react'
import { AdminProductsTab } from '@/components/admin/AdminProductsTab'
import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab'
import { AdminDiscountsTab } from '@/components/admin/AdminDiscountsTab'
import { AdminUsersTab } from '@/components/admin/AdminUsersTab'
import { AdminVariantsTab } from '@/components/admin/AdminVariantsTab'
import { AdminRequestsTab } from '@/components/admin/AdminRequestsTab'
import { useNavigate } from 'react-router-dom'

export function AdminPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { stats, notifications, orders } = useAdmin()
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please log in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/account')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const unreadNotifications = notifications.filter(n => !n.read).length
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-medium text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your Nice Beds store</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Store
              </Button>
              {unreadNotifications > 0 && (
                <Button variant="outline" size="icon" className="relative">
                  <Bell size={20} />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
                    {unreadNotifications}
                  </Badge>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="overview">
              <ChartBar size={18} className="mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package size={18} className="mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart size={18} className="mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users size={18} className="mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="discounts">
              <Ticket size={18} className="mr-2" />
              Discounts
            </TabsTrigger>
            <TabsTrigger value="variants">
              <Shapes size={18} className="mr-2" />
              Variants
            </TabsTrigger>
            <TabsTrigger value="requests">
              <Bell size={18} className="mr-2" />
              Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </CardTitle>
                  <ArrowUp size={20} className="text-accent" weight="bold" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-heading font-semibold text-foreground">
                    £{stats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {stats.totalOrders} orders
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
                    Total Users
                  </CardTitle>
                  <Users size={20} className="text-accent" weight="fill" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-heading font-semibold text-foreground">
                    {stats.totalUsers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registered customers
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-heading font-semibold text-foreground">
                    {stats.pendingOrders}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Require immediate attention
                  </p>
                  {stats.pendingOrders > 0 && (
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={() => setActiveTab('orders')}
                    >
                      View Orders
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-heading font-semibold text-foreground">
                    {stats.lowStockProducts}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Items with stock below 10
                  </p>
                  {stats.lowStockProducts > 0 && (
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={() => setActiveTab('variants')}
                    >
                      Manage Stock
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Discounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-heading font-semibold text-foreground">
                    {stats.activeDiscounts}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Currently available codes
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full"
                    onClick={() => setActiveTab('discounts')}
                  >
                    Manage Discounts
                  </Button>
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
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} item(s)
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
          </TabsContent>

          <TabsContent value="products">
            <AdminProductsTab />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrdersTab />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="discounts">
            <AdminDiscountsTab />
          </TabsContent>

          <TabsContent value="variants">
            <AdminVariantsTab />
          </TabsContent>

          <TabsContent value="requests">
            <AdminRequestsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
