import { CourseModuleList } from "@/components/courses/builder/CourseModuleList";
import { CoursePreview } from "@/components/courses/builder/CoursePreview";
import { CoursePreviewFrame } from "@/components/courses/builder/CoursePreviewFrame";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { fetchCourse, saveCourse } from "@/services/courseService";
import { CourseFormData, Subject } from "@/types/course";
import { ArrowRight, Eye, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

const CourseBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courseId } = useParams();
  const [isLoading, setIsLoading] = useState(courseId ? true : false);
  const [activeTab, setActiveTab] = useState("edit");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [courseData, setCourseData] = useState<CourseFormData>({
    title: "",
    description: "",
    subject: "computer-science",
    image: "https://placehold.co/600x400",
    price: 99.99,
    topics: [] as CourseFormData["topics"],
  });

  // Load existing course data if editing
  useEffect(() => {
    if (courseId) {
      const loadCourse = async () => {
        try {
          setIsLoading(true);
          const course = await fetchCourse(courseId);
          setCourseData(course);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Eroare la încărcarea cursului",
            description:
              "Nu s-a putut încărca cursul. Te rugăm să încerci din nou.",
          });
        } finally {
          setIsLoading(false);
        }
      };

      loadCourse();
    }
  }, [courseId, toast]);

  // Auto-save feature
  useEffect(() => {
    let autosaveTimer: NodeJS.Timeout;

    // Only start auto-save if required fields are completed
    if (courseData.title.trim() && courseData.subject) {
      autosaveTimer = setTimeout(() => {
        handleSaveCourse("draft", true);
      }, AUTO_SAVE_INTERVAL);
    }

    return () => {
      if (autosaveTimer) clearTimeout(autosaveTimer);
    };
  }, [courseData]);

  const handleSaveCourse = async (
    status: "draft" | "published",
    isAutoSave = false
  ) => {
    try {
      // Validation before saving
      if (!courseData.title.trim()) {
        toast({
          variant: "destructive",
          title: "Câmp obligatoriu lipsește",
          description: "Te rugăm să introduci un titlu pentru curs.",
        });
        return;
      }

      if (!courseData.subject) {
        toast({
          variant: "destructive",
          title: "Câmp obligatoriu lipsește",
          description: "Te rugăm să selectezi o materie pentru curs.",
        });
        return;
      }

      const savedCourse = await saveCourse({ ...courseData, status });
      setLastSaved(new Date());

      if (!isAutoSave) {
        toast({
          title: "Curs salvat cu succes!",
          description: `Cursul a fost salvat ca ${
            status === "draft" ? "ciornă" : "publicat"
          }.`,
        });

        if (status === "published") {
          navigate(`/courses/${savedCourse.id}`);
        }
      } else {
        // For auto-save, show a more subtle notification
        toast({
          title: "Salvare automată",
          description: "Progresul tău a fost salvat automat.",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Eroare la salvare",
        description:
          "A fost o eroare la salvarea cursului. Te rugăm să încerci din nou.",
      });
    }
  };

  const subjects: { label: string; value: Subject }[] = [
    { label: "Informatică", value: "computer-science" },
    { label: "Română", value: "romanian" },
    { label: "Matematică", value: "mathematics" },
    { label: "Istorie", value: "history" },
    { label: "Biologie", value: "biology" },
    { label: "Geografie", value: "geography" },
    { label: "Fizică", value: "physics" },
    { label: "Chimie", value: "chemistry" },
    { label: "Engleză", value: "english" },
    { label: "Franceză", value: "french" },
    { label: "Altele", value: "other" },
  ];

  if (isLoading) {
    return <LoadingScreen message="Se încarcă cursul..." />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {courseId ? "Editează cursul" : "Crează un curs nou"}
        </h1>
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-sm text-muted-foreground">
              Salvat la {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" onClick={() => handleSaveCourse("draft")}>
            <Save className="h-4 w-4 mr-2" />
            Salvează ca ciornă
          </Button>
          <Button
            onClick={() => handleSaveCourse("published")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Publică cursul
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Editor curs</TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Previzualizare
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[calc(100vh-14rem)] rounded-lg border"
          >
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="flex h-full flex-col">
                <div className="flex-1 overflow-auto p-4">
                  <CoursePreview
                    courseData={courseData}
                    setCourseData={setCourseData}
                    subjects={subjects}
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={75}>
              <div className="flex h-full flex-col">
                <div className="flex-1 overflow-auto p-4">
                  <CourseModuleList
                    courseData={courseData}
                    setCourseData={setCourseData}
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>

        <TabsContent value="preview">
          <CoursePreviewFrame courseData={courseData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseBuilderPage;
