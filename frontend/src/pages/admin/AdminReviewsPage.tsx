
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ReviewManagement from '@/components/admin/ReviewManagement';

const AdminReviewsPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestionare recenzii</h1>
        <Button variant="outline" asChild className="self-start sm:self-auto">
          <Link to="/admin" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Înapoi la panou
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
          <CardTitle>Toate recenziile</CardTitle>
          <CardDescription>
            Vizualizează, filtrează și moderează recenziile pentru cursuri și sesiuni de tutoriat
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ReviewManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReviewsPage;
