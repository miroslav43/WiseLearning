
import React from 'react';
import { ShoppingCart, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';
import { useCart } from '@/contexts/cart';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/contexts/PointsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AddToCartButtonProps {
  course: Course;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showPoints?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  course, 
  variant = 'default',
  size = 'default',
  className = '',
  showPoints = false
}) => {
  const { isAuthenticated, user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { formatPoints } = usePoints();
  const { toast } = useToast();

  const alreadyInCart = isInCart(course.id);
  const isTeacher = user?.role === 'teacher';

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Autentificare necesară",
        description: "Trebuie să fii autentificat pentru a adăuga cursuri în coș.",
        variant: "destructive",
      });
      return;
    }
    
    if (isTeacher) {
      toast({
        title: "Acțiune nepermisă",
        description: "Profesorii nu pot achiziționa cursuri.",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(course);
  };

  if (isTeacher) {
    return null; // Don't show the button for teachers
  }

  if (showPoints) {
    return (
      <div className="flex flex-col space-y-2">
        <Button
          variant={alreadyInCart ? 'secondary' : variant}
          size={size}
          className={`gap-2 ${className}`}
          onClick={handleAddToCart}
          disabled={alreadyInCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {alreadyInCart ? 'În coș' : 'Adaugă în coș'}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center text-sm flex items-center justify-center gap-1 text-brand-600 cursor-help">
                <Coins className="h-3.5 w-3.5" />
                <span>{formatPoints(course.pointsPrice)} puncte</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Poți achiziționa acest curs și cu puncte</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <Button
      variant={alreadyInCart ? 'secondary' : variant}
      size={size}
      className={`gap-2 ${className}`}
      onClick={handleAddToCart}
      disabled={alreadyInCart}
    >
      <ShoppingCart className="h-4 w-4" />
      {alreadyInCart ? 'În coș' : 'Adaugă în coș'}
    </Button>
  );
};

export default AddToCartButton;
