
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Review } from '@/types/course';
import ReviewList from '@/components/reviews/ReviewList';
import CourseReviewForm from './CourseReviewForm';
import { useAuth } from '@/contexts/AuthContext';

interface CourseReviewsProps {
  courseId: string;
  rating: number;
  reviews: Review[];
  onRefreshReviews?: () => void;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ 
  courseId,
  rating, 
  reviews,
  onRefreshReviews
}) => {
  const { user } = useAuth();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  const handleReviewAdded = () => {
    if (onRefreshReviews) {
      onRefreshReviews();
    }
  };

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Recenzii</h2>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="p-6">
          <ReviewList 
            rating={rating} 
            reviews={reviews}
            showAll={showAllReviews}
            onShowAll={handleShowAllReviews}
          />
        </Card>
        
        <CourseReviewForm 
          courseId={courseId}
          onReviewAdded={handleReviewAdded}
        />
      </div>
    </section>
  );
};

export default CourseReviews;
