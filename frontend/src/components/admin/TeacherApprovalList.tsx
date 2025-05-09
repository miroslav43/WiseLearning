
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data for demonstration
const pendingTeachers = [
  {
    id: '1',
    name: 'Alexandra Popescu',
    email: 'alexandra.p@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Alexandra+Popescu&background=3f7e4e&color=fff',
    specialization: ['Romanian', 'Literature'],
    appliedAt: '2023-04-12T14:20:00Z',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Mihai Stanescu',
    email: 'mihai.s@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Mihai+Stanescu&background=3f7e4e&color=fff',
    specialization: ['Computer Science', 'Mathematics'],
    appliedAt: '2023-04-10T09:15:00Z',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Elena Dumitrescu',
    email: 'elena.d@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Dumitrescu&background=3f7e4e&color=fff',
    specialization: ['Physics', 'Chemistry'],
    appliedAt: '2023-04-08T16:30:00Z',
    status: 'pending'
  },
  {
    id: '4',
    name: 'Andrei Ionescu',
    email: 'andrei.i@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Andrei+Ionescu&background=3f7e4e&color=fff',
    specialization: ['History', 'Geography'],
    appliedAt: '2023-04-07T11:45:00Z',
    status: 'pending'
  },
];

const TeacherApprovalList: React.FC = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState(pendingTeachers);

  const handleApprove = (id: string) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === id ? { ...teacher, status: 'approved' } : teacher
    ));
    
    toast({
      title: "Profesor aprobat",
      description: "Profesorul a fost aprobat cu succes.",
      variant: "default",
    });
  };

  const handleReject = (id: string) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === id ? { ...teacher, status: 'rejected' } : teacher
    ));
    
    toast({
      title: "Profesor respins",
      description: "Profesorul a fost respins.",
      variant: "destructive",
    });
  };

  // Filter only pending teachers
  const pendingTeachersList = teachers.filter(teacher => teacher.status === 'pending');

  return (
    <div>
      {pendingTeachersList.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nu există cereri de aprobare în așteptare</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profesor</TableHead>
              <TableHead>Specializare</TableHead>
              <TableHead>Data cererii</TableHead>
              <TableHead className="text-right">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingTeachersList.map(teacher => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={teacher.avatar} alt={teacher.name} />
                      <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-sm text-muted-foreground">{teacher.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.specialization.map(spec => (
                      <Badge key={spec} variant="outline">{spec}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(teacher.appliedAt).toLocaleDateString('ro-RO')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleApprove(teacher.id)}
                    >
                      <CheckIcon className="h-4 w-4" />
                      Aprobă
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(teacher.id)}
                    >
                      <X className="h-4 w-4" />
                      Respinge
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TeacherApprovalList;
