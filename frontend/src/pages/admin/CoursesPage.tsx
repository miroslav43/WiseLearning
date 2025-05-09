
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CourseManagement from '@/components/admin/CourseManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseApprovalList from '@/components/admin/CourseApprovalList';

const CoursesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Course Management</h1>
      
      <Tabs defaultValue="all-courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-courses">All Courses</TabsTrigger>
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Database</CardTitle>
              <CardDescription>
                View and manage all courses on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending-approval" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Courses Awaiting Approval</CardTitle>
              <CardDescription>
                Review and approve course submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseApprovalList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoursesPage;
