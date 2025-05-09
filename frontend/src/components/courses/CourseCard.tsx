
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users } from 'lucide-react';
import { Course } from '@/types/course';
import { getSubjectLabel, getSubjectIcon } from '@/utils/subjectUtils';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const SubjectIcon = getSubjectIcon(course.subject);
  
  return (
    <Link to={`/courses/${course.id}`} className="block h-full">
      <Card className="overflow-hidden h-full card-hover">
        <div className="relative">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-48 object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-brand-600">
            {getSubjectLabel(course.subject)}
          </Badge>
          {course.featured && (
            <Badge variant="secondary" className="absolute top-3 right-3">
              Popular
            </Badge>
          )}
        </div>
        <div className="p-5 space-y-4">
          <h3 className="font-semibold text-xl line-clamp-2">{course.title}</h3>
          
          <div className="flex items-center text-sm text-gray-500">
            <SubjectIcon className="h-4 w-4 mr-1" />
            <span>{getSubjectLabel(course.subject)}</span>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <img 
                src={course.teacherAvatar || `https://ui-avatars.com/api/?name=${course.teacherName.replace(' ', '+')}&background=3f7e4e&color=fff`} 
                alt={course.teacherName} 
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-700">{course.teacherName}</span>
            </div>
            <span className="font-bold text-brand-600">{course.price} RON</span>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500 ml-1">({course.reviews.length})</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm">{course.students} studenți</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CourseCard;
