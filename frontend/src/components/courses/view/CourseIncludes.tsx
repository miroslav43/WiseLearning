import { Award, BookOpen, Calendar, FileText, Video } from "lucide-react";
import React from "react";

interface CourseIncludesProps {
  totalLessons: number;
}

// We'll keep the props for now since CourseSidebar is already passing them
// In a full refactor, we would update CourseSidebar to not pass these props
const CourseIncludes: React.FC<CourseIncludesProps> = ({ totalLessons }) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Acest curs include:</h3>
      <ul className="space-y-1 text-sm">
        <li className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand-500" />
          <span>Acces nelimitat la toate materialele</span>
        </li>
        <li className="flex items-center gap-2">
          <Video className="h-4 w-4 text-brand-500" />
          <span>{totalLessons} lecții video</span>
        </li>
        <li className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand-500" />
          <span>Resurse descărcabile</span>
        </li>
        <li className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-brand-500" />
          <span>Exerciții practice</span>
        </li>
        <li className="flex items-center gap-2">
          <Award className="h-4 w-4 text-brand-500" />
          <span>Certificat de absolvire</span>
        </li>
      </ul>
    </div>
  );
};

export default CourseIncludes;
