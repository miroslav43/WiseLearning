
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReviewForm from '@/components/reviews/ReviewForm';
import { useReviewService } from '@/services/reviewService';

interface TutoringReviewFormProps {
  sessionId: string;
  teacherName?: string; // Added teacherName prop
  onReviewAdded: () => void;
}

const TutoringReviewForm: React.FC<TutoringReviewFormProps> = ({ 
  sessionId, 
  teacherName,
  onReviewAdded 
}) => {
  const { user } = useAuth();
  const { hasStudentReviewedSession, submitTutoringReview } = useReviewService();
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

  const hasReviewed = hasStudentReviewedSession(user.id, sessionId);

  if (hasReviewed) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-center text-gray-500">
            Ai adăugat deja o recenzie pentru această sesiune de tutoriat.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (data: { rating: number; comment: string }) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      await submitTutoringReview({
        sessionId,
        studentId: user.id,
        studentName: user.name,
        studentAvatar: user.avatar,
        teacherName: teacherName, // Set the teacherName
        userName: user.name,      // Set userName for compatibility
        userAvatar: user.avatar,  // Set userAvatar for compatibility
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
            <p className="mb-4 text-gray-600">Împărtășește experiența ta cu această sesiune de tutoriat.</p>
            <Button onClick={() => setIsFormVisible(true)}>Scrie o recenzie</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TutoringReviewForm;
