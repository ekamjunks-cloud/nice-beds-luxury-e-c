import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Gear, Bell, ShieldCheck, Palette, Globe } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function AdminSettingsTab() {
  const handleSaveSettings = () => {
    toast.success('Settings saved successfully')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage store configuration and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              <CardTitle>Store Information</CardTitle>
            </div>
            <CardDescription>Basic store details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input id="store-name" defaultValue="Nice Beds" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">Contact Email</Label>
                <Input id="store-email" type="email" defaultValue="hello@nicebeds.co.uk" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store-phone">Phone Number</Label>
                <Input id="store-phone" defaultValue="+44 (0) 113 123 4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-address">Address</Label>
                <Input id="store-address" defaultValue="45 Wellington Street, Leeds" />
              </div>
            </div>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette size={20} className="text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize how your store looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input id="primary-color" type="color" defaultValue="#2d2647" className="w-20" />
                <Input defaultValue="#2d2647" className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex gap-2">
                <Input id="accent-color" type="color" defaultValue="#d4934f" className="w-20" />
                <Input defaultValue="#d4934f" className="flex-1" />
              </div>
            </div>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Orders</Label>
                <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts when inventory is low</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Customer Messages</Label>
                <p className="text-sm text-muted-foreground">Notifications for customer inquiries</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage security and access settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button onClick={handleSaveSettings}>Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gear size={20} className="text-primary" />
              <CardTitle>Advanced Settings</CardTitle>
            </div>
            <CardDescription>Additional configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Temporarily disable the storefront</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Guest Checkout</Label>
                <p className="text-sm text-muted-foreground">Allow purchases without account creation</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Restock Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify customers when items are back in stock</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
