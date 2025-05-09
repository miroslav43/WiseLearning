
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '../admin/AdminSidebar';
import { Toaster } from '@/components/ui/sonner';

const AdminLayout: React.FC = () => {
  const { user } = useAuth();

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 animate-fade-in">
          <Outlet />
        </div>
      </div>
      <Toaster 
        position="top-right" 
        toastOptions={{
          classNames: {
            toast: "bg-white shadow-lg border border-gray-100 rounded-lg",
            title: "font-medium text-gray-900",
            description: "text-gray-600",
          }
        }}
      />
    </div>
  );
};

export default AdminLayout;
