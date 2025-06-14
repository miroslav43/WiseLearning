import CourseHeader from "@/components/courses/view/CourseHeader";
import CourseLearningPoints from "@/components/courses/view/CourseLearningPoints";
import CourseLoadingState from "@/components/courses/view/CourseLoadingState";
import CourseNotFound from "@/components/courses/view/CourseNotFound";
import CourseReviews from "@/components/courses/view/CourseReviews";
import CourseSidebar from "@/components/courses/view/CourseSidebar";
import CourseTopics from "@/components/courses/view/CourseTopics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CourseProvider, useCourseContext } from "@/contexts/CourseContext";
import { useReviewService } from "@/services/reviewService";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

// Sample learning points (in a real app, these would come from the course data)
const LEARNING_POINTS = [
  "Fundamentele teoretice ale materiei",
  "Aplicații practice și studii de caz",
  "Tehnici de rezolvare a subiectelor de examen",
  "Metode eficiente de învățare și memorare",
];

const CourseViewContent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { course, isLoading, error } = useCourseContext();
  const { getCourseReviewsByCourseId, getAverageCourseRating } =
    useReviewService();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshReviews = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (isLoading) {
    return <CourseLoadingState />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load course. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!course || !courseId) {
    return <CourseNotFound />;
  }

  // Get reviews for this course
  const reviews = getCourseReviewsByCourseId(courseId);
  const averageRating = getAverageCourseRating(courseId);

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4">
      <CourseHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6 lg:mb-8">
            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          <div className="space-y-6 lg:space-y-8">
            <CourseLearningPoints learningPoints={LEARNING_POINTS} />

            <Separator />

            <CourseTopics />

            <Separator />

            <CourseReviews
              courseId={courseId}
              rating={averageRating || 0}
              reviews={reviews}
              onRefreshReviews={handleRefreshReviews}
            />
          </div>
        </div>

        <div className="lg:col-span-1 order-1 lg:order-2 mb-6 lg:mb-0">
          <div className="sticky top-4">
            <CourseSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseViewPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <CourseProvider courseId={courseId}>
      <CourseViewContent />
    </CourseProvider>
  );
};

export default CourseViewPage;
