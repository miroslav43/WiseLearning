
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SubscriptionPlansManager from '@/components/admin/subscriptions/SubscriptionPlansManager';
import CourseBundlesManager from '@/components/admin/subscriptions/CourseBundlesManager';
import UserSubscriptionsTable from '@/components/admin/subscriptions/UserSubscriptionsTable';

const SubscriptionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Subscription Management</h1>
      <p className="text-gray-600">
        Manage subscription plans, course packages, and user subscriptions from this panel.
      </p>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="packages">Course Packages</TabsTrigger>
          <TabsTrigger value="users">User Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>
                Create and manage subscription plans for monthly and annual access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionPlansManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="packages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Packages</CardTitle>
              <CardDescription>
                Create and manage course bundles that users can purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseBundlesManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Subscriptions</CardTitle>
              <CardDescription>
                View and manage all active user subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserSubscriptionsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionsPage;
