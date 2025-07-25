import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import AuthenticatedActions from "./AuthenticatedActions";
import BrandLogo from "./BrandLogo";
import DesktopNavigation from "./DesktopNavigation";
import MobileMenu from "./MobileMenu";
import UnauthenticatedActions from "./UnauthenticatedActions";

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <BrandLogo />

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* User Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            {isAuthenticated ? (
              <AuthenticatedActions />
            ) : (
              <UnauthenticatedActions />
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isMenuOpen={isMenuOpen} onClose={closeMenu} />
    </header>
  );
};

export default Navbar;
