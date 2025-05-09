
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  ChevronDown, 
  ChevronRight, 
  List,
  Maximize,
  Minimize,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { mockCourses } from '@/data/mockData';
import { Course, Lesson, Topic } from '@/types/course';
import LessonContent from '@/components/courses/lessons/LessonContent';
import AddToCartButton from '@/components/courses/AddToCartButton';
import { cn } from '@/lib/utils';

const CourseLessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: boolean}>({});
  const [progressPercent, setProgressPercent] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    // Find course by ID
    const foundCourse = mockCourses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      
      // Default: expand all topics
      const topicsState = foundCourse.topics.reduce((acc, topic) => {
        acc[topic.id] = true;
        return acc;
      }, {} as {[key: string]: boolean});
      setExpandedTopics(topicsState);
      
      // Find current lesson (if lessonId provided) or get first lesson
      if (lessonId) {
        for (const topic of foundCourse.topics) {
          const lesson = topic.lessons.find(l => l.id === lessonId);
          if (lesson) {
            setCurrentLesson(lesson);
            break;
          }
        }
      } else if (foundCourse.topics.length > 0 && foundCourse.topics[0].lessons.length > 0) {
        setCurrentLesson(foundCourse.topics[0].lessons[0]);
        navigate(`/courses/${courseId}/lessons/${foundCourse.topics[0].lessons[0].id}`, { replace: true });
      }
      
      // Mock progress (random for demo)
      const mockCompletedCount = Math.floor(Math.random() * 5) + 1;
      const allLessons = foundCourse.topics.flatMap(topic => topic.lessons);
      const randomCompletedLessons = allLessons
        .slice(0, mockCompletedCount)
        .map(lesson => lesson.id);
      
      setCompletedLessons(randomCompletedLessons);
      setProgressPercent(Math.round((randomCompletedLessons.length / allLessons.length) * 100));
    }
  }, [courseId, lessonId, navigate]);
  
  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };
  
  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setSidebarOpen(false);
    navigate(`/courses/${courseId}/lessons/${lesson.id}`);
  };
  
  const markAsCompleted = () => {
    if (!currentLesson) return;
    
    if (completedLessons.includes(currentLesson.id)) {
      // Remove from completed
      setCompletedLessons(prev => prev.filter(id => id !== currentLesson.id));
      toast({
        title: "Lecție marcată ca nefinalizată",
        description: "Progresul a fost actualizat.",
      });
    } else {
      // Add to completed
      setCompletedLessons(prev => [...prev, currentLesson.id]);
      toast({
        title: "Lecție finalizată!",
        description: "Felicitări pentru progresul tău.",
      });
    }
    
    // Update progress percentage
    if (course) {
      const allLessonsCount = course.topics.flatMap(topic => topic.lessons).length;
      const newProgressPercent = Math.round(((completedLessons.includes(currentLesson.id) 
        ? completedLessons.length - 1 
        : completedLessons.length + 1) / allLessonsCount) * 100);
      setProgressPercent(newProgressPercent);
    }
  };
  
  const resumeProgress = () => {
    if (!course) return;
    
    // Find first incomplete lesson
    const allLessons = course.topics.flatMap(topic => topic.lessons);
    for (const lesson of allLessons) {
      if (!completedLessons.includes(lesson.id)) {
        selectLesson(lesson);
        break;
      }
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  if (!course || !currentLesson) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Încărcăm cursul...</h2>
          <p>Te rugăm să aștepți un moment.</p>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col">
      {/* Course Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/courses/${courseId}`)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Înapoi la curs</span>
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold line-clamp-2">{course.title}</h1>
              
              <div className="flex items-center mt-2 gap-4">
                <div className="flex-1 max-w-md">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progres</span>
                    <span className="font-medium">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resumeProgress}
                  className="hidden md:flex items-center gap-1"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Continuă</span>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Ieșire din ecran complet" : "Ecran complet"}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
              
              <AddToCartButton course={course} variant="outline" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Sidebar Toggle (Mobile) */}
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-20 rounded-full h-12 w-12 shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <List className="h-6 w-6" />
        </Button>
        
        {/* Sidebar */}
        <div 
          className={cn(
            "bg-white border-r w-full md:w-80 flex-shrink-0 transition-all duration-300 ease-in-out",
            "fixed inset-0 z-30 md:z-10 md:relative",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            isFullscreen && !sidebarOpen ? "md:-translate-x-full" : ""
          )}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Conținutul cursului</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-60px)]">
            <div className="p-2">
              {course.topics.map((topic) => (
                <div key={topic.id} className="mb-2">
                  <Collapsible open={expandedTopics[topic.id]}>
                    <div 
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => toggleTopic(topic.id)}
                    >
                      <div className="font-medium text-sm">{topic.title}</div>
                      {expandedTopics[topic.id] ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    
                    <CollapsibleContent>
                      <div className="pl-4 border-l border-gray-200 ml-3 mt-1">
                        {topic.lessons.map((lesson) => (
                          <div 
                            key={lesson.id}
                            onClick={() => selectLesson(lesson)}
                            className={cn(
                              "p-2 text-sm rounded-md my-1 cursor-pointer flex items-center gap-2",
                              currentLesson.id === lesson.id ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                            )}
                          >
                            {completedLessons.includes(lesson.id) && (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                            <span className="line-clamp-2">{lesson.title}</span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Overlay for Mobile Sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-20 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <div 
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 ease-in-out",
            sidebarOpen ? "md:pl-0" : "md:pl-0"
          )}
        >
          <div className="p-4 md:p-6 max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
                
                <Button
                  variant={completedLessons.includes(currentLesson.id) ? "secondary" : "outline"}
                  size="sm"
                  onClick={markAsCompleted}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  {completedLessons.includes(currentLesson.id) ? "Finalizată" : "Marchează finalizat"}
                </Button>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
                <LessonContent lesson={currentLesson} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLessonPage;
