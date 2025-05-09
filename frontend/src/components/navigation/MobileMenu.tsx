
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/cart';
import { BookOpen, LogIn, MessageSquare, ShoppingCart, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isMenuOpen: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen }) => {
  const { user, isAuthenticated } = useAuth();
  const { cart } = useCart();

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden bg-white border-t">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <nav className="flex flex-col space-y-2">
          {/* Removed Home link */}
          <Link to="/courses" className="nav-link">Cursuri</Link>
          <Link to="/subscriptions" className="nav-link">Abonamente</Link>
          <Link to="/tutoring" className="nav-link">Tutoriat</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          <Link to="/resources/materials" className="nav-link">Resurse</Link>
          <Link to="/faq" className="nav-link">Întrebări frecvente</Link>
          <Link to="/testimonials" className="nav-link">Testimoniale</Link>
          <Link to="/help" className="nav-link">Ajutor</Link>
          
          {/* Group About and Contact under Informații */}
          <div className="py-1 border-t border-b border-gray-100 my-1">
            <p className="text-sm font-medium text-gray-500 mb-2 px-1">Informații</p>
            <Link to="/about" className="nav-link pl-2">Despre</Link>
            <Link to="/contact" className="nav-link pl-2">Contact</Link>
            <Link to="/privacy-policy" className="nav-link pl-2">Politica de confidențialitate</Link>
            <Link to="/terms" className="nav-link pl-2">Termeni și condiții</Link>
            <Link to="/careers" className="nav-link pl-2">Cariere</Link>
          </div>
          
          {isAuthenticated && (
            <Link to="/cart" className="nav-link flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>Coș de cumpărături</span>
              </div>
              {cart.items.length > 0 && (
                <span className="bg-brand-800 text-white text-xs px-2 py-1 rounded-full">
                  {cart.items.length}
                </span>
              )}
            </Link>
          )}

          {/* User specific links for mobile */}
          {isAuthenticated && user && (
            <>
              {user.role === 'student' && (
                <>
                  <Link to="/dashboard/student" className="nav-link flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Tablou de bord</span>
                  </Link>
                  <Link to="/my-tutoring" className="nav-link flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Tutoriat</span>
                  </Link>
                </>
              )}
              
              {user.role === 'teacher' && (
                <>
                  <Link to="/dashboard/teacher" className="nav-link flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Tablou de bord</span>
                  </Link>
                  <Link to="/my-tutoring/manage" className="nav-link flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Tutoriat</span>
                  </Link>
                </>
              )}
              
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className="nav-link flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Administrare</span>
                  </Link>
                  <Link to="/admin/tutoring" className="nav-link flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Tutoriat</span>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
        
        {!isAuthenticated && (
          <div className="flex flex-col space-y-2">
            <Link to="/login">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogIn className="h-4 w-4" />
                Autentificare
              </Button>
            </Link>
            <Link to="/register">
              <Button className="w-full justify-start gap-2 bg-brand-800 hover:bg-brand-700 text-white">
                <User className="h-4 w-4" />
                Înregistrare
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
