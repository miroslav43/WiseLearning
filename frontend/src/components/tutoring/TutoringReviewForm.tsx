import ReviewForm from "@/components/reviews/ReviewForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTutoringService } from "@/services/tutoringService";
import React, { useState } from "react";

interface TutoringReviewFormProps {
  sessionId: string;
  teacherName?: string;
  onReviewAdded: () => void;
}

const TutoringReviewForm: React.FC<TutoringReviewFormProps> = ({
  sessionId,
  teacherName,
  onReviewAdded,
}) => {
  const { user } = useAuth();
  const { createTutoringReview, isLoading } = useTutoringService();
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

  const handleSubmit = async (data: { rating: number; comment: string }) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      await createTutoringReview({
        sessionId,
        studentId: user.id,
        studentName: user.name,
        studentAvatar: user.avatar,
        rating: data.rating,
        comment: data.comment,
      });

      setIsFormVisible(false);
      onReviewAdded();
    } catch (error) {
      console.error("Error submitting review:", error);
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
          <ReviewForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting || isLoading}
          />
        ) : (
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Împărtășește experiența ta cu această sesiune de tutoriat.
            </p>
            <Button onClick={() => setIsFormVisible(true)}>
              Scrie o recenzie
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TutoringReviewForm;
