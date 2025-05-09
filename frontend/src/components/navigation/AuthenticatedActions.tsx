
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import UserMenu from './UserMenu';
import { useCart } from '@/contexts/cart'; // Updated import path

const AuthenticatedActions: React.FC = () => {
  const { cart } = useCart();
  
  return (
    <>
      <NotificationDropdown />
      
      <Link to="/cart" className="hidden md:flex">
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.items.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand-800 rounded-full text-[10px] flex items-center justify-center text-white">
              {cart.items.length > 9 ? '9+' : cart.items.length}
            </span>
          )}
        </Button>
      </Link>
      <UserMenu />
    </>
  );
};

export default AuthenticatedActions;
