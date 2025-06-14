import AddToCartButton from "@/components/courses/AddToCartButton";
import LessonContent from "@/components/courses/lessons/LessonContent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Course, Lesson } from "@/types/course";
import { apiClient } from "@/utils/apiClient";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  List,
  Loader2,
  Maximize,
  Minimize,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CourseLessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<{
    [key: string]: boolean;
  }>({});
  const [progressPercent, setProgressPercent] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch course details
        const courseData = await apiClient.get<Course>(`/courses/${courseId}`);
        setCourse(courseData);

        // Expand all topics by default
        const topicsState = courseData.topics.reduce((acc, topic) => {
          acc[topic.id] = true;
          return acc;
        }, {} as { [key: string]: boolean });
        setExpandedTopics(topicsState);

        // Fetch user's progress for this course
        try {
          const progressData = await apiClient.get<{
            completedLessons: string[];
            progressPercent: number;
          }>(`/courses/${courseId}/progress`);

          setCompletedLessons(progressData.completedLessons);
          setProgressPercent(progressData.progressPercent);
        } catch (progressErr) {
          console.error("Error fetching course progress:", progressErr);
          // Set default progress (empty completed lessons)
          setCompletedLessons([]);
          setProgressPercent(0);
        }

        // Find current lesson or default to first lesson
        if (lessonId) {
          for (const topic of courseData.topics) {
            const lesson = topic.lessons.find((l) => l.id === lessonId);
            if (lesson) {
              setCurrentLesson(lesson);
              break;
            }
          }
        } else if (
          courseData.topics.length > 0 &&
          courseData.topics[0].lessons.length > 0
        ) {
          setCurrentLesson(courseData.topics[0].lessons[0]);
          navigate(
            `/courses/${courseId}/lessons/${courseData.topics[0].lessons[0].id}`,
            { replace: true }
          );
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(
          "Nu am putut încărca datele cursului. Te rugăm să încerci din nou."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, lessonId, navigate]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setSidebarOpen(false);
    navigate(`/courses/${courseId}/lessons/${lesson.id}`);
  };

  const markAsCompleted = async () => {
    if (!currentLesson || !courseId) return;

    try {
      if (completedLessons.includes(currentLesson.id)) {
        // Mark as incomplete
        await apiClient.delete(
          `/courses/${courseId}/lessons/${currentLesson.id}/completion`
        );
        setCompletedLessons((prev) =>
          prev.filter((id) => id !== currentLesson.id)
        );
        toast({
          title: "Lecție marcată ca nefinalizată",
          description: "Progresul a fost actualizat.",
        });
      } else {
        // Mark as complete
        await apiClient.post(
          `/courses/${courseId}/lessons/${currentLesson.id}/completion`
        );
        setCompletedLessons((prev) => [...prev, currentLesson.id]);
        toast({
          title: "Lecție finalizată!",
          description: "Felicitări pentru progresul tău.",
        });
      }

      // Update progress percentage
      if (course) {
        const allLessonsCount = course.topics.flatMap(
          (topic) => topic.lessons
        ).length;
        const newProgressPercent = Math.round(
          ((completedLessons.includes(currentLesson.id)
            ? completedLessons.length - 1
            : completedLessons.length + 1) /
            allLessonsCount) *
            100
        );
        setProgressPercent(newProgressPercent);
      }
    } catch (err) {
      console.error("Error updating lesson completion status:", err);
      toast({
        title: "Eroare",
        description:
          "Nu am putut actualiza progresul. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    }
  };

  const resumeProgress = () => {
    if (!course) return;

    // Find first incomplete lesson
    const allLessons = course.topics.flatMap((topic) => topic.lessons);
    for (const lesson of allLessons) {
      if (!completedLessons.includes(lesson.id)) {
        selectLesson(lesson);
        break;
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <Card className="p-8 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Încărcăm cursul...</h2>
          <p>Te rugăm să aștepți un moment.</p>
        </Card>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">A apărut o eroare</h2>
          <p className="mb-6">
            {error || "Nu am putut găsi cursul solicitat."}
          </p>
          <Button onClick={() => navigate("/courses")}>
            Înapoi la cursuri
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Nu am găsit lecția</h2>
          <p className="mb-6">
            Lecția solicitată nu există sau nu este disponibilă.
          </p>
          <Button onClick={() => navigate(`/courses/${courseId}`)}>
            Înapoi la pagina cursului
          </Button>
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
              <h1 className="text-xl md:text-2xl font-bold line-clamp-2">
                {course.title}
              </h1>

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
                title={
                  isFullscreen ? "Ieșire din ecran complet" : "Ecran complet"
                }
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
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
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
                              currentLesson.id === lesson.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-gray-100"
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
                  variant={
                    completedLessons.includes(currentLesson.id)
                      ? "secondary"
                      : "outline"
                  }
                  size="sm"
                  onClick={markAsCompleted}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  {completedLessons.includes(currentLesson.id)
                    ? "Finalizată"
                    : "Marchează finalizat"}
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
