
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock courses (in a real app, this would come from an API)
const mockCourses = [
  {
    id: '1',
    title: 'Matematică - Algebră pentru BAC',
    subject: 'mathematics',
    teacher: 'Prof. Maria Popescu',
    status: 'published',
    students: 120,
    price: 199,
    createdAt: '15/01/2023'
  },
  {
    id: '2',
    title: 'Limba Română - Comentarii Literare',
    subject: 'romanian',
    teacher: 'Prof. Ion Ionescu',
    status: 'published',
    students: 85,
    price: 149,
    createdAt: '20/02/2023'
  },
  {
    id: '3',
    title: 'Istorie - România în Perioada Interbelică',
    subject: 'history',
    teacher: 'Prof. Andrei Vasilescu',
    status: 'pending',
    students: 0,
    price: 179,
    createdAt: '10/03/2023'
  },
  {
    id: '4',
    title: 'Biologie - Anatomie și Genetică',
    subject: 'biology',
    teacher: 'Prof. Elena Dumitrescu',
    status: 'draft',
    students: 0,
    price: 199,
    createdAt: '05/04/2023'
  },
  {
    id: '5',
    title: 'Informatică - Algoritmi și Structuri de Date',
    subject: 'computer-science',
    teacher: 'Prof. Mihai Georgescu',
    status: 'rejected',
    students: 0,
    price: 229,
    createdAt: '25/04/2023'
  }
];

const CourseManagement: React.FC = () => {
  const handleViewCourse = (courseId: string) => {
    console.log(`View course: ${courseId}`);
    // In a real app, this would navigate to the course details page
  };

  const handleToggleStatus = (courseId: string) => {
    console.log(`Toggle status for course: ${courseId}`);
    // In a real app, this would call an API to update the course's status
  };

  const handleDeleteCourse = (courseId: string) => {
    console.log(`Delete course: ${courseId}`);
    // In a real app, this would call an API to delete the course
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titlu</TableHead>
            <TableHead>Materie</TableHead>
            <TableHead>Profesor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Studenți</TableHead>
            <TableHead>Preț (RON)</TableHead>
            <TableHead>Data creării</TableHead>
            <TableHead>Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCourses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>{course.subject}</TableCell>
              <TableCell>{course.teacher}</TableCell>
              <TableCell>
                <Badge variant={
                  course.status === 'published' 
                    ? 'default' 
                    : course.status === 'pending' 
                      ? 'secondary' 
                      : course.status === 'draft'
                        ? 'outline'
                        : 'destructive'
                }>
                  {course.status === 'published' 
                    ? 'Publicat' 
                    : course.status === 'pending' 
                      ? 'În așteptare' 
                      : course.status === 'draft'
                        ? 'Ciornă'
                        : 'Respins'}
                </Badge>
              </TableCell>
              <TableCell>{course.students}</TableCell>
              <TableCell>{course.price}</TableCell>
              <TableCell>{course.createdAt}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewCourse(course.id)}
                  >
                    Vizualizează
                  </Button>
                  <Button 
                    variant={course.status === 'published' ? 'destructive' : 'default'} 
                    size="sm"
                    onClick={() => handleToggleStatus(course.id)}
                  >
                    {course.status === 'published' ? 'Suspendă' : 'Publică'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
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

export default CourseManagement;
