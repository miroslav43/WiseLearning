
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminStats from '@/components/admin/AdminStats';
import TeacherApprovalList from '@/components/admin/TeacherApprovalList';
import CourseApprovalList from '@/components/admin/CourseApprovalList';
import TeacherManagementList from '@/components/admin/TeacherManagementList';
import BlogManagement from '@/components/admin/BlogManagement';
import UserManagement from '@/components/admin/UserManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import ReviewManagement from '@/components/admin/ReviewManagement';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { School, Star } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panou de administrare</h1>

      <AdminStats />
      
      <div className="flex flex-wrap justify-end gap-2 mb-4">
        <Button asChild className="gap-2">
          <Link to="/admin/tutoring">
            <School className="h-4 w-4" />
            Administrare tutoriat
          </Link>
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link to="/admin/reviews">
            <Star className="h-4 w-4" />
            Administrare recenzii
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="teacher-approvals" className="mt-8">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="teacher-approvals">Aprobări profesori</TabsTrigger>
          <TabsTrigger value="course-approvals">Aprobări cursuri</TabsTrigger>
          <TabsTrigger value="teachers">Gestionare profesori</TabsTrigger>
          <TabsTrigger value="users">Utilizatori</TabsTrigger>
          <TabsTrigger value="courses">Cursuri</TabsTrigger>
          <TabsTrigger value="reviews">Recenzii</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teacher-approvals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cereri de aprobare profesori</CardTitle>
              <CardDescription>
                Aprobă sau respinge cererile noi de profesori
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeacherApprovalList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="course-approvals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cereri de aprobare cursuri</CardTitle>
              <CardDescription>
                Aprobă sau respinge cererile de publicare a cursurilor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseApprovalList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teachers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestionare profesori</CardTitle>
              <CardDescription>
                Modifică permisiunile și starea profesorilor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeacherManagementList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestionare utilizatori</CardTitle>
              <CardDescription>
                Vizualizează și gestionează toți utilizatorii platformei
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestionare cursuri</CardTitle>
              <CardDescription>
                Vizualizează și gestionează toate cursurile de pe platformă
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestionare recenzii</CardTitle>
              <CardDescription>
                Vizualizează și moderează recenziile cursurilor și sesiunilor de tutoriat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestionare blog</CardTitle>
              <CardDescription>
                Adaugă, modifică sau șterge articole de blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlogManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
