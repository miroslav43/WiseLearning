
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, CheckCircle2, Clock, FileText, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import AchievementBadge from '@/components/achievements/AchievementBadge';

const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'student') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tablou de bord student</h1>
          <p>Trebuie să fii autentificat ca student pentru a accesa această pagină.</p>
        </div>
      </div>
    );
  }

  // Mock data for student dashboard
  const enrolledCourses = 3;
  const completedLessons = 15;
  const totalLessons = 42;
  const completionRate = Math.round((completedLessons / totalLessons) * 100);
  
  const upcomingAssignments = [
    { id: '1', title: 'Algoritmi grafuri - tema 3', dueDate: new Date(2025, 4, 10), course: 'Informatică: Algoritmi' },
    { id: '2', title: 'Eseul argumentativ', dueDate: new Date(2025, 4, 15), course: 'Limba Română: Bacalaureat' },
  ];
  
  const recentCourses = [
    { id: '1', title: 'Informatică: Algoritmi', progress: 65 },
    { id: '2', title: 'Limba Română: Bacalaureat', progress: 30 },
    { id: '3', title: 'Matematică: Analiză', progress: 15 },
  ];

  // Get recent achievements
  const recentAchievements = user.achievements 
    ? user.achievements.filter(a => a.completed).sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      }).slice(0, 3)
    : [];

  // Get achievements in progress
  const inProgressAchievements = user.achievements 
    ? user.achievements
        .filter(a => !a.completed && (a.progress ?? 0) > 0)
        .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
        .slice(0, 2)
    : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Tablou de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cursuri înscrise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{enrolledCourses}</div>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lecții finalizate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{completedLessons}/{totalLessons}</div>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Teme în așteptare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progres general</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold">{completionRate}%</div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Progres cursuri recente</CardTitle>
              <CardDescription>Continuă de unde ai rămas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentCourses.map(course => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Link to={`/courses/${course.id}`} className="text-sm font-medium hover:underline">
                        {course.title}
                      </Link>
                      <span className="text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
                
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/my-courses">Vezi toate cursurile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Realizări recente
              </CardTitle>
              <CardDescription>Ultimele tale realizări deblocate</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAchievements.length > 0 ? (
                <div className="space-y-4">
                  {recentAchievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <AchievementBadge achievement={achievement} size="sm" showTooltip={false} />
                      <div>
                        <p className="font-medium text-sm">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {inProgressAchievements.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-medium mb-3">În progres</h4>
                      {inProgressAchievements.map(achievement => (
                        <div key={achievement.id} className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>{achievement.name}</span>
                            <span className="text-xs">{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button asChild variant="outline" className="w-full mt-2">
                    <Link to="/my-achievements">Vezi toate realizările</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Nu ai încă realizări deblocate</p>
                  <Button asChild variant="outline">
                    <Link to="/my-achievements">Explorează realizările</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Teme apropiate</CardTitle>
              <CardDescription>Teme cu scadență în curând</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssignments.map(assignment => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{assignment.course}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Scadent: {assignment.dueDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/my-assignments">Vezi toate temele</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
