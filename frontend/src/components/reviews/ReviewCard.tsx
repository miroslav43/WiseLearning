
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  userName,
  userAvatar,
  rating,
  comment,
  createdAt,
  onDelete,
  isAdmin = false
}) => {
  return (
    <div className="border-b pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <div className="flex items-start">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{userName}</h4>
              <div className="flex items-center mt-1">
                <RatingStars rating={rating} size="sm" />
                <span className="text-xs text-gray-500 ml-2">
                  {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ro })}
                </span>
              </div>
            </div>
            {isAdmin && onDelete && (
              <button 
                onClick={() => onDelete(id)} 
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Șterge
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-700">{comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
