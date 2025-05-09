
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';
import BreadcrumbNavigation from '../navigation/BreadcrumbNavigation';
import ScrollToTop from '../ui/scroll-to-top';
import { useAuth } from '@/contexts/AuthContext';
import { SavedCoursesProvider } from '@/contexts/SavedCoursesContext';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <SavedCoursesProvider>
      <div className="flex flex-col min-h-screen max-w-full overflow-x-hidden bg-gradient-to-b from-brand-50 to-white">
        <Navbar />
        <BreadcrumbNavigation />
        
        <main className="flex-grow w-full pb-8">
          <Outlet />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </SavedCoursesProvider>
  );
};

export default MainLayout;
