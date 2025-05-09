
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import CartItem from './CartItem';

interface CartItemsProps {
  items: CartItemType[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  formatPrice: (price: number) => string;
  formatPoints: (points: number) => string;
  formatDate: (date: Date) => string;
}

const CartItems: React.FC<CartItemsProps> = ({ 
  items, 
  onRemoveItem, 
  onClearCart,
  formatPrice,
  formatPoints,
  formatDate 
}) => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={onRemoveItem}
            formatPrice={formatPrice}
            formatPoints={formatPoints}
            formatDate={formatDate}
          />
        ))}
      </div>
      
      <div className="flex justify-between mt-4">
        <Link to="/courses">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Continuă cumpărăturile
          </Button>
        </Link>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2">
              <Trash className="h-4 w-4" />
              Golește coșul
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
              <AlertDialogDescription>
                Această acțiune va elimina toate cursurile din coșul tău. Această acțiune nu poate fi anulată.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anulează</AlertDialogCancel>
              <AlertDialogAction onClick={onClearCart} className="bg-red-500 hover:bg-red-600">
                Golește coșul
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CartItems;
