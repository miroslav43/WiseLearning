
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/types/cart';
import { ShoppingCart, MapPin, Wallet, Coins, Tag } from 'lucide-react';
import { usePoints } from '@/contexts/PointsContext';

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  totalPointsPrice: number;
  discount?: number;
  finalPrice?: number;
  pointsToEarn?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  items = [], 
  totalPrice = 0, 
  totalPointsPrice = 0,
  discount = 0,
  finalPrice,
  pointsToEarn = 0
}) => {
  const { formatPoints } = usePoints();
  const actualFinalPrice = finalPrice !== undefined ? finalPrice : totalPrice;
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate estimated delivery date (5 days from now)
  const getEstimatedDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return formatDate(deliveryDate);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Sumar comandă
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items && items.map((item) => (
            <div key={item.id} className="flex justify-between gap-2">
              <div className="flex-grow">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">Prof. {item.teacherName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(item.price)}</p>
                <p className="text-sm text-muted-foreground flex items-center justify-end">
                  <Coins className="h-3 w-3 mr-1" />
                  {formatPoints(item.pointsPrice)} puncte
                </p>
              </div>
            </div>
          ))}
          
          <Separator className="my-2" />
          
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center">
                <Tag className="h-3.5 w-3.5 mr-1" />
                Discount
              </span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>Taxe procesare</span>
            <span>0 RON</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(actualFinalPrice)}</span>
          </div>
          
          <div className="flex justify-between items-center bg-brand-50 p-2 rounded border border-brand-100">
            <span className="text-sm font-medium text-brand-800 flex items-center">
              <Coins className="h-4 w-4 mr-1" />
              Total puncte
            </span>
            <span className="font-semibold text-brand-800">{formatPoints(totalPointsPrice)} puncte</span>
          </div>
          
          {pointsToEarn > 0 && (
            <div className="flex justify-between items-center bg-green-50 p-2 rounded border border-green-100">
              <span className="text-sm font-medium text-green-800 flex items-center">
                <Coins className="h-4 w-4 mr-1" />
                Puncte de câștigat
              </span>
              <span className="font-semibold text-green-800">+{formatPoints(pointsToEarn)}</span>
            </div>
          )}
          
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <Wallet className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <p className="font-medium">Detalii plată</p>
                <p className="text-muted-foreground">
                  Comandă plasată: {formatDate(new Date())}
                </p>
                <p className="text-muted-foreground">
                  Metoda de plată: Card sau Puncte
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <p className="font-medium">Detalii livrare</p>
                <p className="text-muted-foreground">
                  Acces digital imediat după procesarea plății
                </p>
                <p className="text-muted-foreground">
                  Certificate digitale disponibile din: {getEstimatedDeliveryDate()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
