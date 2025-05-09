
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlogManagement from '@/components/admin/BlogManagement';

const BlogPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>
            Create, edit, and manage blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPage;
