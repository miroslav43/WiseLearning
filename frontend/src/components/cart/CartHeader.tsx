
import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface CartHeaderProps {
  title: string;
  isEmpty?: boolean;
}

const CartHeader: React.FC<CartHeaderProps> = ({ title, isEmpty = false }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      {isEmpty && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Coșul tău este gol</h2>
          <p className="text-gray-500 mb-6">Nu ai adăugat încă niciun curs în coș.</p>
        </div>
      )}
    </div>
  );
};

export default CartHeader;
