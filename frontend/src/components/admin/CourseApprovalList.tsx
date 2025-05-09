
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, X, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Subject } from '@/types/course';
import { getSubjectLabel } from '@/utils/subjectUtils';

// Mock data for demonstration
const pendingCourses = [
  {
    id: '1',
    title: 'Limba Română pentru Bacalaureat 2023',
    teacherName: 'Alexandra Popescu',
    subject: 'romanian' as Subject,
    price: 299,
    createdAt: '2023-04-10T14:20:00Z',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Informatică: Structuri de Date și Algoritmi',
    teacherName: 'Mihai Stanescu',
    subject: 'computer-science' as Subject,
    price: 349,
    createdAt: '2023-04-08T09:15:00Z',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Fizică: Mecanică și Termodinamică',
    teacherName: 'Elena Dumitrescu',
    subject: 'physics' as Subject,
    price: 279,
    createdAt: '2023-04-05T16:30:00Z',
    status: 'pending'
  },
  {
    id: '4',
    title: 'Istorie: România în Perioada Interbelică',
    teacherName: 'Andrei Ionescu',
    subject: 'history' as Subject,
    price: 249,
    createdAt: '2023-04-03T11:45:00Z',
    status: 'pending'
  },
];

const CourseApprovalList: React.FC = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState(pendingCourses);

  const handleApprove = (id: string) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, status: 'approved' } : course
    ));
    
    toast({
      title: "Curs aprobat",
      description: "Cursul a fost aprobat și publicat cu succes.",
      variant: "default",
    });
  };

  const handleReject = (id: string) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, status: 'rejected' } : course
    ));
    
    toast({
      title: "Curs respins",
      description: "Cursul a fost respins.",
      variant: "destructive",
    });
  };

  // Filter only pending courses
  const pendingCoursesList = courses.filter(course => course.status === 'pending');

  return (
    <div>
      {pendingCoursesList.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nu există cursuri în așteptare pentru aprobare</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Curs</TableHead>
              <TableHead>Profesor</TableHead>
              <TableHead>Materie</TableHead>
              <TableHead>Preț</TableHead>
              <TableHead>Data cererii</TableHead>
              <TableHead className="text-right">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingCoursesList.map(course => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="font-medium">{course.title}</div>
                </TableCell>
                <TableCell>{course.teacherName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getSubjectLabel(course.subject)}</Badge>
                </TableCell>
                <TableCell>{course.price} lei</TableCell>
                <TableCell>
                  {new Date(course.createdAt).toLocaleDateString('ro-RO')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      asChild
                    >
                      <a href={`/courses/${course.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Vezi curs</span>
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleApprove(course.id)}
                    >
                      <CheckIcon className="h-4 w-4" />
                      Aprobă
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(course.id)}
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

export default CourseApprovalList;
