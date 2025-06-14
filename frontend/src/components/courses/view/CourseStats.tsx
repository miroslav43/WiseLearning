import { Badge } from "@/components/ui/badge";
import { useCourseContext } from "@/contexts/CourseContext";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import React from "react";

interface CourseStatsProps {
  subject: string;
  totalTopics: number;
  totalLessons: number;
  totalDuration: number;
  updatedAt: string;
}

// We'll keep the props for now since CourseSidebar is already passing them
// In a full refactor, we would update CourseSidebar to not pass these props
const CourseStats: React.FC<CourseStatsProps> = ({
  subject,
  totalTopics,
  totalLessons,
  totalDuration,
  updatedAt,
}) => {
  const { formatDuration } = useCourseContext();

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Nivel:</span>
        <Badge variant="outline">{subject || "Începător"}</Badge>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">Topice:</span>
        <span className="font-medium">{totalTopics}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">Lecții:</span>
        <span className="font-medium">{totalLessons}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">Durată totală:</span>
        <span className="font-medium">{formatDuration(totalDuration)}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-600">Acces:</span>
        <span className="font-medium">Nelimitat</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-600">Ultima actualizare:</span>
        <span className="text-sm">
          {format(new Date(updatedAt), "PPP", { locale: ro })}
        </span>
      </div>
    </div>
  );
};

export default CourseStats;
