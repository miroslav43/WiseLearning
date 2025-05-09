
import React from 'react';
import { Link } from 'react-router-dom';
import { Subject } from '@/types/course';
import { getSubjectLabel, getSubjectIcon } from '@/utils/subjectUtils';

interface SubjectCardProps {
  subject: Subject;
  count: number;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, count }) => {
  const SubjectIcon = getSubjectIcon(subject);
  
  return (
    <Link to={`/courses/${subject}`}>
      <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-brand-300">
        <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-3">
          <SubjectIcon className="h-8 w-8 text-brand-600" />
        </div>
        <h3 className="font-medium text-gray-900 text-center">{getSubjectLabel(subject)}</h3>
        <p className="text-sm text-gray-500 mt-1">{count} cursuri</p>
      </div>
    </Link>
  );
};

export default SubjectCard;
