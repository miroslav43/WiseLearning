
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Users, FileText, BarChart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'teacher') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tablou de bord profesor</h1>
          <p>Trebuie să fii autentificat ca profesor pentru a accesa această pagină.</p>
        </div>
      </div>
    );
  }

  // Mock data for teacher dashboard
  const coursesCount = 5;
  const studentsCount = 127;
  const assignmentsCount = 12;
  const reviewsCount = 32;
  
  const recentCoursesStats = [
    { 
      id: '1', 
      title: 'Informatică: Algoritmi', 
      students: 45,
      activeWeek: 8,
      totalWeeks: 12,
      completionRate: 66
    },
    { 
      id: '2', 
      title: 'Informatică: Baze de date', 
      students: 32,
      activeWeek: 4,
      totalWeeks: 10,
      completionRate: 40
    },
    { 
      id: '3', 
      title: 'Programare web', 
      students: 28,
      activeWeek: 3,
      totalWeeks: 8,
      completionRate: 37
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tablou de bord</h1>
        <Button asChild className="gap-2">
          <Link to="/teacher/course-builder">
            <Plus className="h-4 w-4" />
            <span>Curs nou</span>
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cursuri active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{coursesCount}</div>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Studenți înscriși</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{studentsCount}</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Teme active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{assignmentsCount}</div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recenzii primite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{reviewsCount}</div>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Statistici cursuri</CardTitle>
          <CardDescription>Progresul studenților pe cursurile tale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentCoursesStats.map(course => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">{course.title}</h3>
                    <div className="text-xs text-muted-foreground">
                      Săptămâna {course.activeWeek} din {course.totalWeeks} | {course.students} studenți
                    </div>
                  </div>
                  <span className="text-sm font-medium">{course.completionRate}%</span>
                </div>
                <Progress value={course.completionRate} className="h-2" />
              </div>
            ))}
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button asChild variant="outline">
                <Link to="/my-courses/manage">
                  Vezi toate cursurile
                </Link>
              </Button>
              <Button asChild>
                <Link to="/teacher/course-builder">
                  Adaugă curs nou
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Activitate recentă</CardTitle>
            <CardDescription>Ultimele activități din cursurile tale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium">Alexandru M. a finalizat tema "Algoritmi grafuri"</p>
                <p className="text-sm text-muted-foreground">Acum 2 ore, Curs: Informatică: Algoritmi</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-medium">3 studenți noi înscriși la "Programare web"</p>
                <p className="text-sm text-muted-foreground">Acum 5 ore</p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="font-medium">Maria P. a adăugat o întrebare nouă</p>
                <p className="text-sm text-muted-foreground">Acum 1 zi, Curs: Baze de date</p>
              </div>
              
              <Button asChild variant="link" className="px-0">
                <Link to="/my-students">Vezi toți studenții</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recenzii recente</CardTitle>
            <CardDescription>Feedback-ul primit de la studenți</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-sm font-medium">Informatică: Algoritmi</p>
                </div>
                <p className="text-sm">
                  "Excelent curs, m-a ajutat foarte mult să înțeleg conceptele pentru Bacalaureat!"
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  - Andrei S., acum 3 zile
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {'★'.repeat(4)}
                  </div>
                  <p className="text-sm font-medium">Programare web</p>
                </div>
                <p className="text-sm">
                  "Foarte bine structurat și explicat, dar ar fi util mai multe exemple practice."
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  - Elena M., acum 1 săptămână
                </p>
              </div>
              
              <Button asChild variant="link" className="px-0">
                <Link to="/my-courses/manage">Vezi toate recenziile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
