
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MailIcon, 
  ArrowUpDown, 
  BookOpen, 
  Clock 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const TeacherStudentsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!user || user.role !== 'teacher') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Studenții mei</h1>
          <p>Trebuie să fii autentificat ca profesor pentru a accesa această pagină.</p>
        </div>
      </div>
    );
  }

  // Mock data for students
  const students = [
    { 
      id: '1', 
      name: 'Alexandru Marinescu', 
      email: 'alex.marinescu@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Alexandru+Marinescu&background=3f7e4e&color=fff',
      enrolledDate: new Date(2025, 2, 10),
      lastActive: new Date(2025, 4, 2),
      coursesEnrolled: [
        { id: '1', title: 'Informatică: Algoritmi', progress: 75 },
        { id: '2', title: 'Informatică: Baze de date', progress: 45 }
      ]
    },
    { 
      id: '2', 
      name: 'Maria Popescu', 
      email: 'maria.popescu@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Popescu&background=3f7e4e&color=fff',
      enrolledDate: new Date(2025, 1, 15),
      lastActive: new Date(2025, 4, 3),
      coursesEnrolled: [
        { id: '1', title: 'Informatică: Algoritmi', progress: 85 },
        { id: '3', title: 'Programare web', progress: 50 }
      ]
    },
    { 
      id: '3', 
      name: 'Ion Ionescu', 
      email: 'ion.ionescu@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Ion+Ionescu&background=3f7e4e&color=fff',
      enrolledDate: new Date(2025, 2, 5),
      lastActive: new Date(2025, 3, 28),
      coursesEnrolled: [
        { id: '2', title: 'Informatică: Baze de date', progress: 60 }
      ]
    },
    { 
      id: '4', 
      name: 'Elena Dumitrescu', 
      email: 'elena.dumitrescu@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Elena+Dumitrescu&background=3f7e4e&color=fff',
      enrolledDate: new Date(2025, 3, 1),
      lastActive: new Date(2025, 4, 1),
      coursesEnrolled: [
        { id: '1', title: 'Informatică: Algoritmi', progress: 40 },
        { id: '2', title: 'Informatică: Baze de date', progress: 35 },
        { id: '3', title: 'Programare web', progress: 25 }
      ]
    },
  ];

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Studenții mei</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Informații studenți</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Caută după nume sau email..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="justify-center md:w-auto">
              Filtrează
            </Button>
            <Button variant="outline" className="justify-center md:w-auto" onClick={() => setSearchQuery('')}>
              Resetează
            </Button>
          </div>

          <Tabs defaultValue="table" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="table">Tabel</TabsTrigger>
              <TabsTrigger value="cards">Carduri</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <div className="flex items-center space-x-1">
                          <span>Student</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Cursuri înscris</TableHead>
                      <TableHead>Înscris din</TableHead>
                      <TableHead>Ultima activitate</TableHead>
                      <TableHead className="text-right">Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          Nu a fost găsit niciun student care să corespundă căutării.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map(student => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback>
                                  {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{student.coursesEnrolled.length} cursuri</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {student.enrolledDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{student.lastActive.toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <MailIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    Nu a fost găsit niciun student care să corespundă căutării.
                  </div>
                ) : (
                  filteredStudents.map(student => (
                    <Card key={student.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                            <div className="flex items-center text-sm mt-1">
                              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>Activ: {student.lastActive.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mt-4">
                          <h4 className="text-sm font-medium">Cursuri înscris:</h4>
                          {student.coursesEnrolled.map(course => (
                            <div key={course.id} className="bg-muted p-2 rounded-md">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">{course.title}</span>
                                <Badge variant="outline">{course.progress}%</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button size="sm" variant="outline" className="gap-2">
                            <MailIcon className="h-4 w-4" />
                            <span>Contactează</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherStudentsPage;
