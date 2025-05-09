
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

// Mock users (in a real app, this would come from an API)
const mockUsers = [
  {
    id: '1',
    name: 'Student Demo',
    email: 'student@example.com',
    role: 'student',
    status: 'active',
    registeredDate: '12/03/2023'
  },
  {
    id: '2',
    name: 'Teacher Demo',
    email: 'teacher@example.com',
    role: 'teacher',
    status: 'active',
    registeredDate: '05/01/2023'
  },
  {
    id: '3',
    name: 'Admin Demo',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    registeredDate: '01/01/2023'
  },
  {
    id: '4',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    status: 'inactive',
    registeredDate: '15/04/2023'
  },
  {
    id: '5',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'teacher',
    status: 'pending',
    registeredDate: '20/05/2023'
  }
];

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  
  const handleToggleStatus = (userId: string) => {
    console.log(`Toggle status for user: ${userId}`);
    // In a real app, this would call an API to update the user's status
  };

  const handleDeleteUser = (userId: string) => {
    console.log(`Delete user: ${userId}`);
    // In a real app, this would call an API to delete the user
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nume</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data înregistrării</TableHead>
            <TableHead>Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={
                  user.role === 'admin' 
                    ? 'destructive' 
                    : user.role === 'teacher' 
                      ? 'secondary' 
                      : 'default'
                }>
                  {user.role === 'admin' 
                    ? 'Admin' 
                    : user.role === 'teacher' 
                      ? 'Profesor' 
                      : 'Student'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={
                  user.status === 'active' 
                    ? 'default' 
                    : user.status === 'inactive' 
                      ? 'destructive' 
                      : 'outline'
                }>
                  {user.status === 'active' 
                    ? 'Activ' 
                    : user.status === 'inactive' 
                      ? 'Inactiv' 
                      : 'În așteptare'}
                </Badge>
              </TableCell>
              <TableCell>{user.registeredDate}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleStatus(user.id)}
                    disabled={user.email === currentUser?.email}
                  >
                    {user.status === 'active' ? 'Dezactivează' : 'Activează'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.email === currentUser?.email}
                  >
                    Șterge
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagement;
