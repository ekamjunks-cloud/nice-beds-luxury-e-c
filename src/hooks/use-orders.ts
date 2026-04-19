import { useKV } from '@github/spark/hooks'
import { Order, UpdateRequest, CartItem } from '@/lib/types'

export function useOrders(userId?: string) {
  const [orders, setOrders] = useKV<Order[]>('orders', [])
  const [updateRequests, setUpdateRequests] = useKV<UpdateRequest[]>('update-requests', [])

  const userOrders = userId ? (orders || []).filter(o => o.userId === userId) : []

  const createOrder = (userId: string, items: CartItem[], totalAmount: number) => {
    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      items,
      totalAmount,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    setOrders(currentOrders => [...(currentOrders || []), newOrder])
    return newOrder
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
    requestUpdate,
    updateRequests: getUserUpdateRequests(userId || '')
  }
}
