
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, Calendar } from 'lucide-react';

const StudentCoursesPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'student') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cursurile mele</h1>
          <p>Trebuie să fii autentificat ca student pentru a accesa această pagină.</p>
        </div>
      </div>
    );
  }

  // Mock data for student courses
  const activeCourses = [
    { 
      id: '1', 
      title: 'Informatică: Algoritmi', 
      description: 'Un curs complet despre algoritmi și structuri de date pentru Bacalaureat.',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1928&auto=format&fit=crop',
      progress: 65,
      teacher: 'Prof. Maria Popescu',
      lastAccessed: new Date(2025, 4, 1)
    },
    { 
      id: '2', 
      title: 'Limba Română: Bacalaureat', 
      description: 'Pregătire completă pentru proba scrisă la Limba Română.',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1928&auto=format&fit=crop',
      progress: 30,
      teacher: 'Prof. Ion Ionescu',
      lastAccessed: new Date(2025, 3, 28)
    },
    { 
      id: '3',

      title: 'Matematică: Analiză', 
      description: 'Derivate, integrale și tot ce trebuie să știi pentru examen.',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1928&auto=format&fit=crop',
      progress: 15,
      teacher: 'Prof. Dan Popescu',
      lastAccessed: new Date(2025, 3, 25)
    },
  ];
  
  const completedCourses = [
    { 
      id: '4', 
      title: 'Fizică: Mecanică', 
      description: 'Principiile fizicii clasice pentru Bacalaureat.',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1928&auto=format&fit=crop',
      progress: 100,
      teacher: 'Prof. Alexandru Georgescu',
      completedDate: new Date(2025, 2, 15)
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Cursurile mele</h1>
      
      <Tabs defaultValue="active" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="active">Cursuri active</TabsTrigger>
          <TabsTrigger value="completed">Cursuri finalizate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.teacher}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Progres</span>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    Accesat recent: {course.lastAccessed.toLocaleDateString()}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full gap-2">
                    <Link to={`/courses/${course.id}`}>
                      <PlayCircle className="h-4 w-4" />
                      <span>Continuă cursul</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {activeCourses.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Nu ești înscris la niciun curs</h3>
              <p className="text-muted-foreground mb-6">Înscrie-te la cursuri pentru a începe să înveți</p>
              <Button asChild>
                <Link to="/courses">Explorează cursuri</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.teacher}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Finalizat</span>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2 bg-green-100" />
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    Finalizat în: {course.completedDate.toLocaleDateString()}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full gap-2">
                    <Link to={`/courses/${course.id}`}>
                      <span>Revizuiește cursul</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {completedCourses.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Nu ai finalizat niciun curs încă</h3>
              <p className="text-muted-foreground mb-6">Continuă să înveți pentru a finaliza cursurile</p>
              <Button asChild variant="outline">
                <Link to="/my-courses">Vezi cursurile active</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentCoursesPage;
