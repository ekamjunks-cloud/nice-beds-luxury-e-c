import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChartBar, 
  ShoppingCart, 
  Users, 
  BookOpen,
  Gear,
  Cube,
  Bell,
  ArrowUp,
  Package
} from '@phosphor-icons/react'
import { AdminDashboardTab } from '@/components/admin/AdminDashboardTab'
import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab'
import { AdminCatalogTab } from '@/components/admin/AdminCatalogTab'
import { AdminCustomersTab } from '@/components/admin/AdminCustomersTab'
import { AdminContentTab } from '@/components/admin/AdminContentTab'
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab'
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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-medium text-foreground">Admin Panel</h1>
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

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard">
              <ChartBar size={18} className="mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart size={18} className="mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="catalog">
              <Cube size={18} className="mr-2" />
              Catalog
            </TabsTrigger>
            <TabsTrigger value="customers">
              <Users size={18} className="mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="content">
              <BookOpen size={18} className="mr-2" />
              Content & Marketing
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Gear size={18} className="mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboardTab />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrdersTab />
          </TabsContent>

          <TabsContent value="catalog">
            <AdminCatalogTab />
          </TabsContent>

          <TabsContent value="customers">
            <AdminCustomersTab />
          </TabsContent>

          <TabsContent value="content">
            <AdminContentTab />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
