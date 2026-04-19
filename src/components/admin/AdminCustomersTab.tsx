import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User as UserIcon, Envelope, Phone, Calendar } from '@phosphor-icons/react'
import { useState } from 'react'
import { User } from '@/lib/types'

export function AdminCustomersTab() {
  const { users } = useAdmin()
  const [searchTerm, setSearchTerm] = useState('')

  const usersList: User[] = Object.values(users || {}).map((data: any) => data.user)

  const filteredUsers = usersList.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-semibold">Customer Management</h2>
          <p className="text-muted-foreground mt-1">View and manage customer accounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-semibold text-foreground">
              {usersList.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-semibold text-foreground">
              {usersList.filter(u => Date.now() - u.createdAt < 30 * 24 * 60 * 60 * 1000).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-semibold text-foreground">
              {usersList.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Customers</CardTitle>
              <CardDescription>Manage customer information and orders</CardDescription>
            </div>
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon size={20} className="text-primary" weight="fill" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-2">
                          <Envelope size={14} className="text-muted-foreground" />
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="text-sm flex items-center gap-2 text-muted-foreground">
                            <Phone size={14} />
                            {user.phone}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
