
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Coins, Eye } from "lucide-react";
import { useCart } from "@/contexts/cart";
import { usePoints } from "@/contexts/PointsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Course } from "@/types/course";
import { useNavigate } from "react-router-dom";

interface CourseButtonsProps {
  course: Course;
}

const CourseButtons: React.FC<CourseButtonsProps> = ({ course }) => {
  const { addToCart, isInCart, checkoutWithPoints } = useCart();
  const { hasEnoughPoints, formatPoints } = usePoints();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const alreadyInCart = isInCart(course.id);
  const hasPoints = hasEnoughPoints(course.pointsPrice);
  const canBuyWithPoints = isAuthenticated && hasPoints && !alreadyInCart;
  const isTeacher = user?.role === 'teacher';

  const handleBuyWithPoints = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Autentificare necesară",
        description: "Trebuie să fii autentificat pentru a cumpăra cu puncte.",
        variant: "destructive",
      });
      return;
    }
    
    if (!hasEnoughPoints(course.pointsPrice)) {
      toast({
        title: "Puncte insuficiente",
        description: `Ai nevoie de ${formatPoints(course.pointsPrice)} puncte pentru a achiziționa acest curs.`,
        variant: "destructive",
      });
      return;
    }
    
    // Add to cart and checkout with points
    addToCart(course);
    const success = await checkoutWithPoints();
    
    if (success) {
      toast({
        title: "Achiziție reușită!",
        description: "Ai cumpărat cursul cu puncte.",
        variant: "default",
      });
    }
  };

  const handlePreview = () => {
    // Check if the course has topics and lessons
    if (course.topics && course.topics.length > 0 && course.topics[0].lessons && course.topics[0].lessons.length > 0) {
      // Navigate to the first lesson of the course
      const firstLesson = course.topics[0].lessons[0];
      navigate(`/courses/${course.id}/lessons/${firstLesson.id}`);
    } else {
      // If no lessons are available, show a toast message
      toast({
        title: "Previzualizare",
        description: "Nu există lecții disponibile pentru previzualizare.",
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Button 1: Add to Cart - only hide for teachers */}
      {!isTeacher && (
        <Button 
          className="w-full gap-2 bg-brand-800" 
          variant={alreadyInCart ? 'secondary' : 'default'}
          onClick={() => addToCart(course)}
          disabled={alreadyInCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {alreadyInCart ? 'În coș' : 'Adaugă în coș'}
        </Button>
      )}
      
      {/* Button 2: Buy with Points - only hide for teachers */}
      {!isTeacher && (
        <Button 
          variant="secondary" 
          className="w-full gap-2" 
          disabled={!canBuyWithPoints}
          onClick={handleBuyWithPoints}
        >
          <Coins className="h-4 w-4" />
          Cumpără cu {formatPoints(course.pointsPrice)} puncte
        </Button>
      )}
      
      {/* Button 3: Preview - show for everyone */}
      <Button 
        variant="outline" 
        className="w-full gap-2"
        onClick={handlePreview}
      >
        <Eye className="h-4 w-4" />
        Previzualizare
      </Button>
    </div>
  );
};

export default CourseButtons;
