
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import PointsDisplay from '@/components/points/PointsDisplay';

interface CartSummaryProps {
  totalPrice: number;
  totalPointsPrice: number;
  discount: number;
  pointsToEarn: number;
  onCheckout: () => void;
  onPointsCheckout: () => void;
  finalPrice: number;
  formatPrice: (price: number) => string;
  formatPoints: (points: number) => string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalPrice,
  totalPointsPrice,
  discount,
  pointsToEarn,
  onCheckout,
  onPointsCheckout,
  finalPrice,
  formatPrice,
  formatPoints
}) => {
  const { isAuthenticated } = useAuth();
  const { hasEnoughPoints } = usePoints();

  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Sumar comandă</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between text-lg font-bold mb-4">
        <span>Total</span>
        <span>{formatPrice(finalPrice)}</span>
      </div>
      
      <div className="flex justify-between items-center bg-brand-50 p-3 rounded border border-brand-100 mb-6">
        <span className="text-sm font-medium text-brand-800">Total puncte</span>
        <span className="font-semibold text-brand-800">{formatPoints(totalPointsPrice)}</span>
      </div>
      
      {pointsToEarn > 0 && (
        <div className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-100 mb-6">
          <span className="text-sm font-medium text-green-800">Puncte de câștigat</span>
          <span className="font-semibold text-green-800">+{formatPoints(pointsToEarn)}</span>
        </div>
      )}

      {isAuthenticated && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Punctele tale</span>
            <PointsDisplay variant="compact" showIcon={false} />
          </div>
          <Button 
            className="w-full gap-2 mb-3" 
            variant={hasEnoughPoints(totalPointsPrice) ? "default" : "outline"}
            onClick={onPointsCheckout}
          >
            <Coins className="h-5 w-5" />
            Plătește cu puncte
          </Button>
        </div>
      )}
      
      <Button 
        className="w-full gap-2" 
        size="lg"
        onClick={onCheckout}
      >
        <CreditCard className="h-5 w-5" />
        Plătește cu cardul
      </Button>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        *Plata se va face în contul asociat platformei.
      </div>
    </Card>
  );
};

export default CartSummary;
