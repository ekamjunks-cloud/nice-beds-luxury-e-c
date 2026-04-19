import { useKV } from '@github/spark/hooks'
import { Order, UpdateRequest, CartItem, OrderStatusUpdate } from '@/lib/types'
import { addDays } from 'date-fns'

export function useOrders(userId?: string) {
  const [orders, setOrders] = useKV<Order[]>('orders', [])
  const [updateRequests, setUpdateRequests] = useKV<UpdateRequest[]>('update-requests', [])

  const userOrders = userId ? (orders || []).filter(o => o.userId === userId) : []

  const calculateEstimatedDelivery = (createdAt: number): number => {
    return addDays(createdAt, 42).getTime()
  }

  const generateTrackingNumber = (): string => {
    const prefix = 'NB'
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    return `${prefix}${timestamp}${random}`
  }

  const createOrder = (userId: string, items: CartItem[], totalAmount: number) => {
    const createdAt = Date.now()
    const initialStatus: OrderStatusUpdate = {
      status: 'pending',
      timestamp: createdAt,
      note: 'Order received and awaiting confirmation'
    }

    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      items,
      totalAmount,
      status: 'pending',
      createdAt,
      updatedAt: createdAt,
      estimatedDeliveryDate: calculateEstimatedDelivery(createdAt),
      trackingNumber: generateTrackingNumber(),
      statusHistory: [initialStatus]
    }

    setOrders(currentOrders => [...(currentOrders || []), newOrder])
    return newOrder
  }

  const updateOrderStatus = (orderId: string, newStatus: Order['status'], note?: string) => {
    setOrders(currentOrders => {
      return (currentOrders || []).map(order => {
        if (order.id === orderId) {
          const statusUpdate: OrderStatusUpdate = {
            status: newStatus,
            timestamp: Date.now(),
            note
          }

          return {
            ...order,
            status: newStatus,
            updatedAt: Date.now(),
            statusHistory: [...(order.statusHistory || []), statusUpdate]
          }
        }
        return order
      })
    })
  }

  const requestUpdate = (orderId: string, userId: string, message: string) => {
    const newRequest: UpdateRequest = {
      id: `request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      userId,
      message,
      createdAt: Date.now(),
      status: 'pending'
    }

    setUpdateRequests(currentRequests => [...(currentRequests || []), newRequest])
    return newRequest
  }

  const getUserUpdateRequests = (userId: string) => {
    return (updateRequests || []).filter(r => r.userId === userId)
  }

  return {
    orders: userOrders,
    allOrders: orders,
    createOrder,
    updateOrderStatus,
    requestUpdate,
    updateRequests: getUserUpdateRequests(userId || '')
  }
}
