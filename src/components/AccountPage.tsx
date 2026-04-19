import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useOrders } from '@/hooks/use-orders'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { SignOut, Package, ChatCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function AccountPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { orders, updateRequests, requestUpdate } = useOrders(user?.id)

  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')
  const [updateMessage, setUpdateMessage] = useState('')

  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)

  if (!user) {
    navigate('/')
    return null
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleRequestUpdate = (orderId: string) => {
    setSelectedOrderId(orderId)
    setRequestDialogOpen(true)
  }

  const submitUpdateRequest = () => {
    if (!updateMessage.trim()) {
      toast.error('Please enter a message')
      return
    }

    requestUpdate(selectedOrderId, user.id, updateMessage)
    toast.success('Update request sent successfully')
    setRequestDialogOpen(false)
    setUpdateMessage('')
    setSelectedOrderId('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-muted text-muted-foreground'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'in-production':
        return 'bg-purple-100 text-purple-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-accent text-accent-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-production':
        return 'In Production'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        onNavigate={() => {}}
        currentSection=""
      />

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-2">
              My Account
            </h1>
            <p className="text-muted-foreground text-lg">Welcome back, {user.name}</p>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <SignOut size={20} />
            Log Out
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{format(user.createdAt, 'MMMM d, yyyy')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-medium text-primary mb-1">
                {orders.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Total {orders.length === 1 ? 'Order' : 'Orders'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-medium text-primary mb-1">
                {updateRequests.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Total Requests
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="space-y-6">
          <h2 className="font-heading text-3xl font-medium">Your Orders</h2>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package size={64} className="text-muted-foreground mb-4" />
                <h3 className="font-heading text-xl font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Start browsing our collection to place your first order
                </p>
                <Button onClick={() => navigate('/shop')} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Browse Beds
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                        <CardDescription>
                          Placed on {format(order.createdAt, 'MMMM d, yyyy')}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            {item.selectedColor && (
                              <p className="text-sm text-muted-foreground">Color: {item.selectedColor}</p>
                            )}
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">
                            £{((item.product.price + (item.customizationPrice || 0)) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}

                      <Separator />

                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-lg">Total</p>
                        <p className="font-semibold text-lg">£{order.totalAmount.toLocaleString()}</p>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => handleRequestUpdate(order.id)}
                      >
                        <ChatCircle size={20} />
                        Request Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {updateRequests.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="space-y-6">
              <h2 className="font-heading text-3xl font-medium">Update Requests</h2>
              <div className="space-y-4">
                {updateRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">Request for Order #{request.orderId.slice(-8)}</CardTitle>
                        <Badge className={request.status === 'pending' ? 'bg-muted' : 'bg-green-100 text-green-800'}>
                          {request.status === 'pending' ? 'Pending' : 'Responded'}
                        </Badge>
                      </div>
                      <CardDescription>
                        Sent on {format(request.createdAt, 'MMMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Your Message:</p>
                        <p className="text-sm">{request.message}</p>
                      </div>
                      {request.response && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Response:</p>
                          <p className="text-sm bg-muted p-3 rounded">{request.response}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Order Update</DialogTitle>
            <DialogDescription>
              Send a message to request an update about your order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="update-message">Your Message</Label>
              <Textarea
                id="update-message"
                placeholder="Please provide an update on my order status..."
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                rows={5}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setRequestDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitUpdateRequest}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
