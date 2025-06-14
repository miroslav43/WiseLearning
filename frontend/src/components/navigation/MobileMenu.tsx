import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/cart";
import useUser from "@/hooks/useUser";
import {
  Award,
  BookOpen,
  Calendar,
  Coins,
  Heart,
  LogIn,
  LogOut,
  MessageSquare,
  Settings,
  ShoppingCart,
  Trophy,
  User,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  isMenuOpen: boolean;
  onClose?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMenuOpen,
  onClose = () => {},
}) => {
  const { logout } = useAuth();
  const { isStudent, isTeacher, isAdmin, isAuthenticated } = useUser();
  const { cart } = useCart();

  if (!isMenuOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="md:hidden bg-white border-t">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <nav className="flex flex-col space-y-2">
          {/* Public navigation links */}
          <Link to="/courses" className="nav-link" onClick={onClose}>
            Cursuri
          </Link>
          <Link to="/tutoring" className="nav-link" onClick={onClose}>
            Tutoriat
          </Link>
          <Link to="/blog" className="nav-link" onClick={onClose}>
            Blog
          </Link>
          <Link
            to="/resources/materials"
            className="nav-link"
            onClick={onClose}
          >
            Resurse
          </Link>

          {/* Group About and Contact under Informații */}
          <div className="py-1 border-t border-b border-gray-100 my-1">
            <p className="text-sm font-medium text-gray-500 mb-2 px-1">
              Informații
            </p>
            <Link to="/about" className="nav-link pl-2" onClick={onClose}>
              Despre
            </Link>
            <Link to="/contact" className="nav-link pl-2" onClick={onClose}>
              Contact
            </Link>
          </div>

          {isAuthenticated && (
            <>
              <div className="py-1 border-t border-gray-100 my-1">
                <p className="text-sm font-medium text-gray-500 mb-2 px-1">
                  Contul meu
                </p>

                {/* Common authenticated user links */}
                <Link
                  to="/profile"
                  className="nav-link pl-2 flex items-center"
                  onClick={onClose}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
                <Link
                  to="/settings"
                  className="nav-link pl-2 flex items-center"
                  onClick={onClose}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Setări</span>
                </Link>
                <Link
                  to="/messaging"
                  className="nav-link pl-2 flex items-center"
                  onClick={onClose}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Mesaje</span>
                </Link>
                <Link
                  to="/calendar"
                  className="nav-link pl-2 flex items-center"
                  onClick={onClose}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Calendar</span>
                </Link>
                <Link
                  to="/cart"
                  className="nav-link pl-2 flex items-center justify-between"
                  onClick={onClose}
                >
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
                <Link
                  to="/subscriptions"
                  className="nav-link pl-2 flex items-center"
                  onClick={onClose}
                >
                  <Coins className="mr-2 h-4 w-4" />
                  <span>Abonamente</span>
                </Link>
              </div>

              {/* Role-specific links */}
              {isStudent && (
                <div className="py-1 border-t border-gray-100 my-1">
                  <p className="text-sm font-medium text-gray-500 mb-2 px-1">
                    Student
                  </p>
                  <Link
                    to="/dashboard/student"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/my-courses"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Cursurile mele</span>
                  </Link>
                  <Link
                    to="/my-saved-courses"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Cursuri salvate</span>
                  </Link>
                  <Link
                    to="/my-achievements"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    <span>Realizări</span>
                  </Link>
                  <Link
                    to="/my-certificates"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    <span>Certificate</span>
                  </Link>
                  <Link
                    to="/my-tutoring"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Meditațiile mele</span>
                  </Link>
                </div>
              )}

              {isTeacher && (
                <div className="py-1 border-t border-gray-100 my-1">
                  <p className="text-sm font-medium text-gray-500 mb-2 px-1">
                    Profesor
                  </p>
                  <Link
                    to="/dashboard/teacher"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/teacher/profile"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil profesor</span>
                  </Link>
                  <Link
                    to="/my-courses/manage"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Cursurile mele</span>
                  </Link>
                  <Link
                    to="/my-students"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Studenții mei</span>
                  </Link>
                  <Link
                    to="/my-tutoring/manage"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Meditațiile mele</span>
                  </Link>
                </div>
              )}

              {isAdmin && (
                <div className="py-1 border-t border-gray-100 my-1">
                  <p className="text-sm font-medium text-gray-500 mb-2 px-1">
                    Admin
                  </p>
                  <Link
                    to="/admin"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Utilizatori</span>
                  </Link>
                  <Link
                    to="/admin/courses"
                    className="nav-link pl-2 flex items-center"
                    onClick={onClose}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Cursuri</span>
                  </Link>
                </div>
              )}

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full text-left nav-link pl-2 flex items-center text-red-600 mt-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Deconectare</span>
              </button>
            </>
          )}
        </nav>

        {!isAuthenticated && (
          <div className="flex flex-col space-y-2">
            <Link to="/login" onClick={onClose}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogIn className="h-4 w-4" />
                Autentificare
              </Button>
            </Link>
            <Link to="/register" onClick={onClose}>
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
