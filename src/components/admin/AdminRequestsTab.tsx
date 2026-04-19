import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UpdateRequest } from '@/lib/types'
import { Bell, ChatCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { toast } from 'sonner'

export function AdminRequestsTab() {
  const { updateRequests, respondToUpdateRequest, orders } = useAdmin()
  const [selectedRequest, setSelectedRequest] = useState<UpdateRequest | null>(null)
  const [response, setResponse] = useState('')

  const handleRespond = () => {
    if (!selectedRequest || !response.trim()) {
      toast.error('Please enter a response')
      return
    }

    respondToUpdateRequest(selectedRequest.id, response)
    toast.success('Response sent successfully')
    setSelectedRequest(null)
    setResponse('')
  }

  const getOrderDetails = (orderId: string) => {
    return orders.find(o => o.id === orderId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Update Requests</CardTitle>
        <CardDescription>View and respond to customer order update requests</CardDescription>
      </CardHeader>
      <CardContent>
        {updateRequests.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No update requests</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updateRequests.map((request) => {
                const order = getOrderDetails(request.orderId)
                return (
                  <TableRow key={request.id}>
                    <TableCell>{format(request.createdAt, 'MMM dd, yyyy HH:mm')}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {request.orderId.substring(0, 20)}...
                      {order && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Status: {order.status}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{request.message}</TableCell>
                    <TableCell>
                      <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request)
                          setResponse(request.response || '')
                        }}
                      >
                        <ChatCircle size={16} className="mr-2" />
                        {request.status === 'pending' ? 'Respond' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Update Request</DialogTitle>
              <DialogDescription>
                {selectedRequest && format(selectedRequest.createdAt, 'MMMM dd, yyyy at HH:mm')}
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Order ID</p>
                  <p className="text-sm font-mono">{selectedRequest.orderId}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Customer Message</p>
                  <p className="text-sm">{selectedRequest.message}</p>
                </div>
                {selectedRequest.status === 'responded' && selectedRequest.response ? (
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm font-medium mb-2">Your Response</p>
                    <p className="text-sm">{selectedRequest.response}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Responded on {selectedRequest.respondedAt && format(selectedRequest.respondedAt, 'MMM dd, yyyy at HH:mm')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Response</label>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Type your response here..."
                      rows={4}
                    />
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
              {selectedRequest?.status === 'pending' && (
                <Button onClick={handleRespond}>
                  Send Response
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
