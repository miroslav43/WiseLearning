
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Link, 
  Pencil, 
  Eye, 
  BarChart, 
  Users, 
  Clock, 
  Calendar,
  Plus,
  FileText,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link as RouterLink } from 'react-router-dom';

const TeacherCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  
  if (!user || user.role !== 'teacher') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cursurile mele</h1>
          <p>Trebuie să fii autentificat ca profesor pentru a accesa această pagină.</p>
        </div>
      </div>
    );
  }

  // Mock data for teacher courses
  const publishedCourses = [
    { 
      id: '1', 
      title: 'Informatică: Algoritmi', 
      students: 45,
      modules: 8,
      lessons: 24,
      lastUpdated: new Date(2025, 3, 15),
      status: 'published',
      rating: 4.8,
      reviews: 18
    },
    { 
      id: '2', 
      title: 'Informatică: Baze de date', 
      students: 32,
      modules: 6,
      lessons: 18,
      lastUpdated: new Date(2025, 3, 2),
      status: 'published',
      rating: 4.5,
      reviews: 12
    },
    { 
      id: '3', 
      title: 'Programare web', 
      students: 28,
      modules: 5,
      lessons: 15,
      lastUpdated: new Date(2025, 2, 20),
      status: 'published',
      rating: 4.2,
      reviews: 8
    },
  ];
  
  const draftCourses = [
    { 
      id: '4', 
      title: 'Python pentru începători', 
      modules: 2,
      lessons: 6,
      lastUpdated: new Date(2025, 4, 1),
      status: 'draft'
    },
    { 
      id: '5', 
      title: 'Inteligență artificială: Introducere', 
      modules: 1,
      lessons: 3,
      lastUpdated: new Date(2025, 3, 25),
      status: 'draft'
    },
  ];

  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the course
    console.log(`Deleting course: ${courseToDelete}`);
    // After deletion, close dialog and potentially refresh data
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cursurile mele</h1>
        <Button asChild className="gap-2">
          <RouterLink to="/my-courses/create">
            <Plus className="h-4 w-4" />
            <span>Curs nou</span>
          </RouterLink>
        </Button>
      </div>
      
      <Tabs defaultValue="published" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="published">Publicate</TabsTrigger>
          <TabsTrigger value="drafts">Ciorne</TabsTrigger>
        </TabsList>
        
        <TabsContent value="published">
          <div className="space-y-6">
            {publishedCourses.map(course => (
              <Card key={course.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">{course.title}</CardTitle>
                      <Badge className="bg-green-500">{course.status === 'published' ? 'Publicat' : 'Ciornă'}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <RouterLink to={`/courses/${course.id}`} className="flex items-center cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Vizualizează</span>
                          </RouterLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <RouterLink to={`/my-courses/edit/${course.id}`} className="flex items-center cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editează</span>
                          </RouterLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(course.id)} className="text-red-500">
                          <span className="flex items-center cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Arhivează</span>
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Studenți</span>
                      <div className="flex items-center mt-1">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{course.students}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Conținut</span>
                      <div className="flex items-center mt-1">
                        <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{course.modules} module, {course.lessons} lecții</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center mt-1">
                        <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{course.rating} ({course.reviews} recenzii)</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Actualizat</span>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{course.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <RouterLink to={`/courses/${course.id}`}>
                      Vizualizează
                    </RouterLink>
                  </Button>
                  <Button asChild size="sm">
                    <RouterLink to={`/my-courses/edit/${course.id}`}>
                      Editează
                    </RouterLink>
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {publishedCourses.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Nu ai niciun curs publicat</h3>
                <p className="text-muted-foreground mb-6">Publică ciornele tale sau creează un curs nou</p>
                <Button asChild>
                  <RouterLink to="/my-courses/create">Creează un curs</RouterLink>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="drafts">
          <div className="space-y-6">
            {draftCourses.map(course => (
              <Card key={course.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">{course.title}</CardTitle>
                      <Badge variant="outline">{course.status === 'published' ? 'Publicat' : 'Ciornă'}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <RouterLink to={`/my-courses/edit/${course.id}`} className="flex items-center cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editează</span>
                          </RouterLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(course.id)} className="text-red-500">
                          <span className="flex items-center cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Șterge</span>
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Conținut</span>
                      <div className="flex items-center mt-1">
                        <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{course.modules} module, {course.lessons} lecții</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Actualizat</span>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{course.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button asChild size="sm">
                    <RouterLink to={`/my-courses/edit/${course.id}`}>
                      Continuă editarea
                    </RouterLink>
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {draftCourses.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Nu ai nicio ciornă</h3>
                <p className="text-muted-foreground mb-6">Începe să creezi un nou curs</p>
                <Button asChild>
                  <RouterLink to="/my-courses/create">Creează un curs</RouterLink>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ești sigur că vrei să ștergi acest curs?</DialogTitle>
            <DialogDescription>
              Această acțiune nu poate fi anulată. Cursul va fi șters definitiv din contul tău.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Anulează
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Șterge cursul
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherCoursesPage;
