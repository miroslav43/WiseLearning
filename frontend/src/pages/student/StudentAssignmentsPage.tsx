
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Clock, CheckCircle2 } from 'lucide-react';

const StudentAssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'student') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Teme și teste</h1>
          <p>Trebuie să fii autentificat ca student pentru a accesa această pagină.</p>
        </div>
      </div>
    );
  }

  // Mock data for assignments
  const pendingAssignments = [
    { 
      id: '1', 
      title: 'Algoritmi grafuri - tema 3', 
      description: 'Implementează algoritmii de parcurgere în grafuri (BFS, DFS) și rezolvă problemele din enunț.',
      dueDate: new Date(2025, 4, 10),
      course: 'Informatică: Algoritmi',
      type: 'assignment',
      maxScore: 100
    },
    { 
      id: '2', 
      title: 'Eseul argumentativ',
      description: 'Scrie un eseu argumentativ despre tema naturii în opera lui Mihai Eminescu.',
      dueDate: new Date(2025, 4, 15),
      course: 'Limba Română: Bacalaureat',
      type: 'assignment',
      maxScore: 100
    },
    { 
      id: '3', 
      title: 'Quiz: Derivate',
      description: 'Test de verificare a cunoștințelor despre derivate și aplicațiile lor.',
      dueDate: new Date(2025, 4, 8),
      course: 'Matematică: Analiză',
      type: 'quiz',
      timeLimit: 60, // in minutes
      questions: 20
    },
  ];
  
  const completedAssignments = [
    { 
      id: '4', 
      title: 'Algoritmi de sortare - tema 2',
      description: 'Implementarea și analiza algoritmilor de sortare (QuickSort, MergeSort, BubbleSort).',
      submittedDate: new Date(2025, 3, 25),
      course: 'Informatică: Algoritmi',
      type: 'assignment',
      score: 85,
      maxScore: 100
    },
    { 
      id: '5', 
      title: 'Quiz: Mecanica clasică',
      description: 'Test de verificare a cunoștințelor din mecanica clasică.',
      submittedDate: new Date(2025, 3, 20),
      course: 'Fizică: Mecanică',
      type: 'quiz',
      score: 90,
      maxScore: 100
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Teme și teste</h1>
      
      <Tabs defaultValue="pending" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="pending">În așteptare</TabsTrigger>
          <TabsTrigger value="completed">Finalizate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingAssignments.map(assignment => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="mr-2">{assignment.title}</CardTitle>
                    <Badge variant={assignment.type === 'quiz' ? 'secondary' : 'default'}>
                      {assignment.type === 'quiz' ? 'Test' : 'Temă'}
                    </Badge>
                  </div>
                  <CardDescription>{assignment.course}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{assignment.description}</p>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Scadent: {assignment.dueDate.toLocaleDateString()}</span>
                    </div>
                    
                    {assignment.type === 'quiz' ? (
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Timp: {assignment.timeLimit} minute, {assignment.questions} întrebări</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Punctaj maxim: {assignment.maxScore}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    {assignment.type === 'quiz' ? 'Începe testul' : 'Încarcă tema'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {pendingAssignments.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Nu ai teme în așteptare</h3>
              <p className="text-muted-foreground">Toate temele și testele au fost finalizate.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedAssignments.map(assignment => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="mr-2">{assignment.title}</CardTitle>
                    <Badge variant="outline">
                      {assignment.type === 'quiz' ? 'Test' : 'Temă'}
                    </Badge>
                  </div>
                  <CardDescription>{assignment.course}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{assignment.description}</p>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Trimis: {assignment.submittedDate.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                      <span>Scor: {assignment.score}/{assignment.maxScore} puncte</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Vezi feedback
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {completedAssignments.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Nu ai teme finalizate</h3>
              <p className="text-muted-foreground">Finalizează teme pentru a le vedea aici.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAssignmentsPage;
