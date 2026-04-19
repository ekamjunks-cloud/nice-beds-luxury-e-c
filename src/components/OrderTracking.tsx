import { Order, OrderStatusUpdate } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Package, CheckCircle, Wrench, ClipboardText, Truck, House } from '@phosphor-icons/react'
import { format, addDays, differenceInDays } from 'date-fns'
import { cn } from '@/lib/utils'

interface OrderTrackingProps {
  order: Order
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const statusSteps: { status: Order['status']; label: string; icon: React.ReactNode }[] = [
    { status: 'pending', label: 'Order Placed', icon: <ClipboardText size={24} /> },
    { status: 'confirmed', label: 'Confirmed', icon: <CheckCircle size={24} /> },
    { status: 'in-production', label: 'In Production', icon: <Wrench size={24} /> },
    { status: 'quality-check', label: 'Quality Check', icon: <CheckCircle size={24} /> },
    { status: 'ready-for-delivery', label: 'Ready for Delivery', icon: <Package size={24} /> },
    { status: 'out-for-delivery', label: 'Out for Delivery', icon: <Truck size={24} /> },
    { status: 'delivered', label: 'Delivered', icon: <House size={24} /> },
  ]

  const currentStatusIndex = statusSteps.findIndex(step => step.status === order.status)

  const estimatedDelivery = order.estimatedDeliveryDate || addDays(order.createdAt, 42).getTime()
  const daysUntilDelivery = differenceInDays(estimatedDelivery, Date.now())

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-muted text-muted-foreground'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'in-production':
        return 'bg-purple-100 text-purple-800'
      case 'quality-check':
        return 'bg-indigo-100 text-indigo-800'
      case 'ready-for-delivery':
        return 'bg-green-100 text-green-800'
      case 'out-for-delivery':
        return 'bg-accent/80 text-accent-foreground'
      case 'delivered':
        return 'bg-accent text-accent-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: Order['status']) => {
    const step = statusSteps.find(s => s.status === status)
    return step?.label || status
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">Order Tracking</CardTitle>
            <CardDescription className="mt-2">
              Track your order progress and estimated delivery
            </CardDescription>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {getStatusLabel(order.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {order.trackingNumber && (
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Tracking Number</p>
            <p className="text-lg font-mono font-semibold">{order.trackingNumber}</p>
          </div>
        )}

        <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-6 rounded-lg border border-accent/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Estimated Delivery</p>
            {order.status !== 'delivered' && (
              <Badge variant="outline" className="border-accent/30 text-accent-foreground/80">
                {daysUntilDelivery > 0 ? `${daysUntilDelivery} days` : 'Soon'}
              </Badge>
            )}
          </div>
          <p className="text-2xl font-heading font-semibold text-foreground">
            {format(estimatedDelivery, 'EEEE, MMMM d, yyyy')}
          </p>
          {order.status === 'delivered' && (
            <p className="text-sm text-green-700 mt-2 flex items-center gap-2">
              <CheckCircle size={16} weight="fill" />
              Delivered successfully
            </p>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="font-semibold text-lg">Order Progress</h3>
          <div className="relative">
            <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-border" />
            
            <div className="space-y-8">
              {statusSteps.map((step, index) => {
                const isComplete = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const statusUpdate = order.statusHistory?.find(h => h.status === step.status)

                return (
                  <div key={step.status} className="relative flex gap-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors',
                        isComplete
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className={cn(
                            'font-medium',
                            isComplete ? 'text-foreground' : 'text-muted-foreground'
                          )}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      {statusUpdate && (
                        <div className="text-sm text-muted-foreground">
                          <p>{format(statusUpdate.timestamp, 'MMM d, yyyy h:mm a')}</p>
                          {statusUpdate.note && (
                            <p className="mt-1 text-foreground/80">{statusUpdate.note}</p>
                          )}
                        </div>
                      )}
                      {!statusUpdate && isComplete && (
                        <p className="text-sm text-muted-foreground">
                          {format(order.createdAt, 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {order.shippingAddress && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-3">Delivery Address</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}<br />
                  {order.shippingAddress.postcode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
