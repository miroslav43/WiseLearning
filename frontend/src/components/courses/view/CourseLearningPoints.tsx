
import React from 'react';
import { Check } from 'lucide-react';

interface CourseLearningPointsProps {
  learningPoints: string[];
  title?: string;
}

const CourseLearningPoints: React.FC<CourseLearningPointsProps> = ({ 
  learningPoints,
  title = "Ce vei învăța" 
}) => {
  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {learningPoints.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-1">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-sm sm:text-base">{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CourseLearningPoints;
