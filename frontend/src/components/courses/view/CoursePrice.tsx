import { useCourseContext } from "@/contexts/CourseContext";
import React from "react";

const CoursePrice: React.FC = () => {
  const { course } = useCourseContext();

  if (!course) return null;

  // Format price
  const formattedPrice = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 0,
  }).format(course.price);

  // Format points price if available
  const hasPointsPrice = course.pointsPrice > 0;

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-brand-600">{formattedPrice}</div>
      {hasPointsPrice && (
        <div className="text-sm text-gray-600 mt-1">
          sau {course.pointsPrice} puncte
        </div>
      )}
    </div>
  );
};

export default CoursePrice;
