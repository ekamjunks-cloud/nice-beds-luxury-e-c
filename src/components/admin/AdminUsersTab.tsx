import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users } from '@phosphor-icons/react'
import { format } from 'date-fns'

export function AdminUsersTab() {
  const { users } = useAdmin()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>View all registered customers</CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users registered yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>{format(user.createdAt, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
