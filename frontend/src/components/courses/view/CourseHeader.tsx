import { useCourseContext } from "@/contexts/CourseContext";
import { Clock, StarIcon, Users } from "lucide-react";
import React from "react";

const CourseHeader: React.FC = () => {
  const { course, formatDuration, totalLessons, totalDuration } =
    useCourseContext();

  if (!course) return null;

  // Calculate rating and review count safely
  const rating = course.rating ?? 0;
  const reviewCount = course.reviews?.length ?? 0;

  // Format the updated date
  const updatedDate = new Date(course.updatedAt).toLocaleDateString();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-lg text-gray-600 mb-4">{course.description}</p>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-1">
          <StarIcon className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <span className="text-gray-500">({reviewCount} recenzii)</span>
        </div>

        <div className="flex items-center gap-1">
          <Users className="h-5 w-5 text-primary" />
          <span>{course.students} studenți înscriși</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="h-5 w-5 text-primary" />
          <span>
            {formatDuration(totalDuration)} ({totalLessons} lecții)
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {course.subject}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
          Actualizat {updatedDate}
        </span>
      </div>
    </div>
  );
};

export default CourseHeader;
