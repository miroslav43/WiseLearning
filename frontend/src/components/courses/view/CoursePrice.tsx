
import React from 'react';

interface CoursePriceProps {
  price: number;
}

const CoursePrice: React.FC<CoursePriceProps> = ({ price }) => {
  // Format price
  const formattedPrice = new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 0,
  }).format(price);

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-brand-600">{formattedPrice}</div>
    </div>
  );
};

export default CoursePrice;
