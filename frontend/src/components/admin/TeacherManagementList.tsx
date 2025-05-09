
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

// Mock data for teachers
const mockTeachers = [
  {
    id: '1',
    name: 'Alexandra Popescu',
    email: 'alexandra.p@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Alexandra+Popescu&background=3f7e4e&color=fff',
    specialization: ['Romanian', 'Literature'],
    courses: 5,
    students: 128,
    rating: 4.8,
    isActive: true,
    canPublish: true
  },
  {
    id: '2',
    name: 'Mihai Stanescu',
    email: 'mihai.s@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Mihai+Stanescu&background=3f7e4e&color=fff',
    specialization: ['Computer Science', 'Mathematics'],
    courses: 3,
    students: 87,
    rating: 4.6,
    isActive: true,
    canPublish: true
  },
  {
    id: '3',
    name: 'Elena Dumitrescu',
    email: 'elena.d@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Dumitrescu&background=3f7e4e&color=fff',
    specialization: ['Physics', 'Chemistry'],
    courses: 2,
    students: 56,
    rating: 4.5,
    isActive: true,
    canPublish: false
  },
  {
    id: '4',
    name: 'Andrei Ionescu',
    email: 'andrei.i@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Andrei+Ionescu&background=3f7e4e&color=fff',
    specialization: ['History', 'Geography'],
    courses: 1,
    students: 42,
    rating: 4.2,
    isActive: false,
    canPublish: false
  },
  {
    id: '5',
    name: 'Maria Constantinescu',
    email: 'maria.c@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Constantinescu&background=3f7e4e&color=fff',
    specialization: ['Biology'],
    courses: 4,
    students: 95,
    rating: 4.7,
    isActive: true,
    canPublish: true
  },
];

const TeacherManagementList: React.FC = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState(mockTeachers);

  const handleToggleActive = (id: string) => {
    setTeachers(teachers.map(teacher => {
      if (teacher.id === id) {
        const updated = { ...teacher, isActive: !teacher.isActive };
        
        toast({
          title: updated.isActive ? "Profesor activat" : "Profesor dezactivat",
          description: `Profesorul a fost ${updated.isActive ? 'activat' : 'dezactivat'} cu succes.`,
          variant: "default",
        });
        
        return updated;
      }
      return teacher;
    }));
  };

  const handleTogglePublish = (id: string) => {
    setTeachers(teachers.map(teacher => {
      if (teacher.id === id) {
        const updated = { ...teacher, canPublish: !teacher.canPublish };
        
        toast({
          title: updated.canPublish 
            ? "Permisiune de publicare acordată" 
            : "Permisiune de publicare revocată",
          description: updated.canPublish 
            ? "Profesorul poate acum să publice cursuri." 
            : "Profesorul nu mai poate publica cursuri.",
          variant: "default",
        });
        
        return updated;
      }
      return teacher;
    }));
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profesor</TableHead>
            <TableHead>Specializare</TableHead>
            <TableHead className="text-center">Cursuri</TableHead>
            <TableHead className="text-center">Studenți</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Publicare</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map(teacher => (
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
              <TableCell className="text-center">{teacher.courses}</TableCell>
              <TableCell className="text-center">{teacher.students}</TableCell>
              <TableCell className="text-center">{teacher.rating}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Switch 
                    checked={teacher.isActive} 
                    onCheckedChange={() => handleToggleActive(teacher.id)}
                  />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Switch 
                    checked={teacher.canPublish} 
                    onCheckedChange={() => handleTogglePublish(teacher.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeacherManagementList;
