
import React from 'react';
import { Button } from '@/components/ui/button';
import RatingStars from './RatingStars';
import ReviewCard from './ReviewCard';
import { Review } from '@/types/course';
import { TutoringReview } from '@/types/tutoring';

interface ReviewListProps {
  rating: number;
  reviews: (Review | TutoringReview)[];
  showAll?: boolean;
  onShowAll?: () => void;
  onDeleteReview?: (id: string) => void;
  isAdmin?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
  rating,
  reviews,
  showAll = false,
  onShowAll,
  onDeleteReview,
  isAdmin = false
}) => {
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="text-3xl sm:text-4xl font-bold">{rating.toFixed(1)}</div>
        <div className="flex items-center">
          <RatingStars rating={rating} size="md" />
        </div>
        <div className="text-gray-500">({reviews.length} recenzii)</div>
      </div>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">Nu există recenzii pentru moment.</p>
      ) : (
        <>
          <div className="space-y-4">
            {displayedReviews.map(review => {
              // Handle both Review and TutoringReview types
              const userName = 'userName' in review ? review.userName : 
                               'studentName' in review ? review.studentName : '';
              const userAvatar = 'userAvatar' in review ? review.userAvatar : 
                                'studentAvatar' in review ? review.studentAvatar : undefined;
                                
              return (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  userName={userName}
                  userAvatar={userAvatar}
                  rating={review.rating}
                  comment={review.comment}
                  createdAt={new Date(review.createdAt)}
                  onDelete={onDeleteReview}
                  isAdmin={isAdmin}
                />
              );
            })}
          </div>
          
          {!showAll && reviews.length > 3 && onShowAll && (
            <Button variant="outline" className="mt-4 w-full sm:w-auto" onClick={onShowAll}>
              Vezi toate recenziile ({reviews.length})
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
