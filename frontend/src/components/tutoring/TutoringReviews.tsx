
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TutoringReview } from '@/types/tutoring';
import ReviewList from '@/components/reviews/ReviewList';
import TutoringReviewForm from './TutoringReviewForm';

interface TutoringReviewsProps {
  sessionId: string;
  teacherName?: string; // Added teacherName prop
  rating: number;
  reviews: TutoringReview[];
  onRefreshReviews?: () => void;
}

const TutoringReviews: React.FC<TutoringReviewsProps> = ({ 
  sessionId,
  teacherName,
  rating, 
  reviews,
  onRefreshReviews
}) => {
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
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Recenzii</h2>
      
      <Card className="p-6">
        <ReviewList 
          rating={rating} 
          reviews={reviews}
          showAll={showAllReviews}
          onShowAll={handleShowAllReviews}
        />
      </Card>
      
      <TutoringReviewForm 
        sessionId={sessionId}
        teacherName={teacherName}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  );
};

export default TutoringReviews;
