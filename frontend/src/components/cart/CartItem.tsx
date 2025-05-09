
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  formatPrice: (price: number) => string;
  formatPoints: (points: number) => string;
  formatDate: (date: Date) => string;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onRemove, 
  formatPrice, 
  formatPoints,
  formatDate
}) => {
  return (
    <div className="p-6 border-b last:border-0">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-32 h-20 flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-grow">
          <Link to={`/courses/${item.courseId}`} className="text-lg font-medium hover:text-brand-600 transition-colors">
            {item.title}
          </Link>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
            <span>Profesor: {item.teacherName}</span>
            <span>Materie: {item.subject}</span>
            <span>Adăugat: {formatDate(item.addedAt)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <span className="text-xl font-bold block">{formatPrice(item.price)}</span>
            <span className="text-sm text-gray-500 flex items-center justify-end">
              <Coins className="h-3.5 w-3.5 mr-1" />
              {formatPoints(item.pointsPrice)} puncte
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-8 w-8"
            onClick={() => onRemove(item.id)}
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
