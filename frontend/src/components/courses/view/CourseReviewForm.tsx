
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReviewForm from '@/components/reviews/ReviewForm';
import { useReviewService } from '@/services/reviewService';

interface CourseReviewFormProps {
  courseId: string;
  onReviewAdded: () => void;
}

const CourseReviewForm: React.FC<CourseReviewFormProps> = ({ courseId, onReviewAdded }) => {
  const { user } = useAuth();
  const { hasUserReviewedCourse, submitCourseReview } = useReviewService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  if (!user) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-center text-gray-500">
            Trebuie să fii autentificat pentru a lăsa o recenzie.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasReviewed = hasUserReviewedCourse(user.id, courseId);

  if (hasReviewed) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-center text-gray-500">
            Ai adăugat deja o recenzie pentru acest curs.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (data: { rating: number; comment: string }) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      await submitCourseReview({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        courseId,
        rating: data.rating,
        comment: data.comment
      });
      
      setIsFormVisible(false);
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Adaugă o recenzie</CardTitle>
      </CardHeader>
      <CardContent>
        {isFormVisible ? (
          <ReviewForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        ) : (
          <div className="text-center">
            <p className="mb-4 text-gray-600">Împărtășește-ți experiența și ajută alți studenți să ia o decizie informată.</p>
            <Button onClick={() => setIsFormVisible(true)}>Scrie o recenzie</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseReviewForm;
