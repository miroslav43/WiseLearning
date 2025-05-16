import CourseCard from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedCourses } from "@/contexts/SavedCoursesContext";
import { fetchCourse } from "@/services/courseService";
import { Course } from "@/types/course";
import { Bookmark, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SavedCoursesPage: React.FC = () => {
  const { savedCourses, likedCourses } = useSavedCourses();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [savedCoursesList, setSavedCoursesList] = useState<Course[]>([]);
  const [likedCoursesList, setLikedCoursesList] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchSavedCourses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch saved courses
        const savedPromises = savedCourses.map((id) => fetchCourse(id));
        const savedResults = await Promise.allSettled(savedPromises);
        const savedCoursesData = savedResults
          .filter(
            (result): result is PromiseFulfilledResult<Course> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);
        setSavedCoursesList(savedCoursesData);

        // Fetch liked courses
        const likedPromises = likedCourses.map((id) => fetchCourse(id));
        const likedResults = await Promise.allSettled(likedPromises);
        const likedCoursesData = likedResults
          .filter(
            (result): result is PromiseFulfilledResult<Course> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);
        setLikedCoursesList(likedCoursesData);
      } catch (err) {
        console.error("Failed to fetch saved courses:", err);
        setError(
          "Nu am putut încărca cursurile salvate. Te rugăm să încerci din nou."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedCourses();
  }, [savedCourses, likedCourses, isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cursurile mele salvate</h1>

      <Tabs defaultValue="saved" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Cursuri salvate ({savedCoursesList.length})
          </TabsTrigger>
          <TabsTrigger value="liked" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Cursuri apreciate ({likedCoursesList.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          {savedCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCoursesList.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Bookmark className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-xl font-semibold">Nu ai cursuri salvate</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Salvează cursurile care te interesează pentru a le accesa mai
                ușor mai târziu.
              </p>
              <Button onClick={() => navigate("/courses")} className="mt-4">
                Explorează cursuri
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked">
          {likedCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedCoursesList.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Heart className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-xl font-semibold">Nu ai cursuri apreciate</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Apreciază cursurile care ți-au plăcut pentru a le accesa mai
                ușor mai târziu.
              </p>
              <Button onClick={() => navigate("/courses")} className="mt-4">
                Explorează cursuri
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedCoursesPage;
