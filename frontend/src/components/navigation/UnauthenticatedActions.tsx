
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, User } from 'lucide-react';

const UnauthenticatedActions: React.FC = () => {
  return (
    <>
      <Link to="/login" className="hidden md:block">
        <Button variant="outline" size="sm" className="gap-1">
          <LogIn className="h-3.5 w-3.5" />
          Autentificare
        </Button>
      </Link>
      <Link to="/register" className="hidden md:block">
        <Button size="sm" className="gap-1 bg-brand-800 hover:bg-brand-700 text-white">
          <User className="h-3.5 w-3.5" />
          Înregistrare
        </Button>
      </Link>
    </>
  );
};

export default UnauthenticatedActions;
