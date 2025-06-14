import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TutoringReview } from "@/types/tutoring";
import { cleanStudentName, getNameInitials } from "@/utils/nameUtils";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { Star } from "lucide-react";
import React from "react";

interface TutoringReviewsProps {
  reviews: TutoringReview[];
}

const TutoringReviews: React.FC<TutoringReviewsProps> = ({ reviews }) => {
  // Helper to format date
  const formatDate = (dateString: string): string => {
    try {
      if (!dateString) return "Data necunoscută";
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ro });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data necunoscută";
    }
  };

  // Helper to get safe student name
  const getSafeStudentName = (review: TutoringReview): string => {
    return cleanStudentName(review.studentName || "Student necunoscut");
  };

  // Helper to get avatar initials safely
  const getAvatarInitials = (studentName?: string): string => {
    return getNameInitials(studentName || "Student necunoscut");
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        reviews.length
      : 0;

  // Generate stars for rating display
  const renderStars = (rating: number) => {
    const safeRating = rating || 0;
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < safeRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {renderStars(Math.round(averageRating))}
        </div>
        <div>
          <span className="font-semibold">{averageRating.toFixed(1)}</span>
          <span className="text-gray-500 ml-1">
            ({reviews.length} recenzii)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => {
          const studentName = getSafeStudentName(review);
          const reviewId = review.id || `review-${index}`;

          return (
            <div key={reviewId} className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      review.studentAvatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        studentName
                      )}&background=f0f0f0&color=333`
                    }
                    alt={studentName}
                  />
                  <AvatarFallback>
                    {getAvatarInitials(studentName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{studentName}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex mb-2">{renderStars(review.rating)}</div>

              <p className="text-gray-700">
                {review.comment || "Fără comentariu"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TutoringReviews;
