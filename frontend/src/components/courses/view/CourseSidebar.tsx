import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCourseContext } from "@/contexts/CourseContext";
import React from "react";
import CourseActions from "./CourseActions";
import CourseButtons from "./CourseButtons";
import CourseIncludes from "./CourseIncludes";
import CoursePrice from "./CoursePrice";
import CourseStats from "./CourseStats";

const CourseSidebar: React.FC = () => {
  const { course, totalLessons, totalDuration } = useCourseContext();

  if (!course) return null;

  // Calculate total topics
  const totalTopics = course.topics?.length ?? 0;

  return (
    <Card className="shadow-lg border-t-4 border-t-brand-500">
      <CardContent className="p-6">
        <div className="space-y-5">
          {/* Price Component */}
          <CoursePrice />

          {/* Buttons Component */}
          <CourseButtons />

          <Separator />

          {/* Stats Component */}
          <CourseStats
            subject={course.subject}
            totalTopics={totalTopics}
            totalLessons={totalLessons}
            totalDuration={totalDuration}
            updatedAt={course.updatedAt}
          />

          <Separator />

          {/* Course Includes Component */}
          <CourseIncludes totalLessons={totalLessons} />

          <Separator />

          {/* Course Actions Component */}
          <CourseActions />
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseSidebar;
