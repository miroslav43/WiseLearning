
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PointsPackageManager from '@/components/admin/points/PointsPackageManager';
import CoursePointsConfig from '@/components/admin/points/CoursePointsConfig';
import ReferralSettingsForm from '@/components/admin/points/ReferralSettingsForm';
import PointsTransactionsLog from '@/components/admin/points/PointsTransactionsLog';

const PointsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Points & Rewards Management</h1>
      
      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="packages">Points Packages</TabsTrigger>
          <TabsTrigger value="course-points">Course Points</TabsTrigger>
          <TabsTrigger value="referrals">Referral Program</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="packages" className="mt-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-2">Points Packages</h2>
            <p className="text-muted-foreground mb-6">
              Configure the points packages available for purchase
            </p>
            <PointsPackageManager />
          </div>
        </TabsContent>
        
        <TabsContent value="course-points" className="mt-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-2">Course Points Pricing</h2>
            <p className="text-muted-foreground mb-6">
              Configure how courses can be purchased with points
            </p>
            <CoursePointsConfig />
          </div>
        </TabsContent>
        
        <TabsContent value="referrals" className="mt-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-2">Referral Program Settings</h2>
            <p className="text-muted-foreground mb-6">
              Configure the referral program and rewards
            </p>
            <ReferralSettingsForm />
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-2">Transaction History</h2>
            <p className="text-muted-foreground mb-6">
              View all points transactions across the platform
            </p>
            <PointsTransactionsLog />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PointsPage;
