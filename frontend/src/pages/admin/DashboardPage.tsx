
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  ArrowUp,
  ArrowDown,
  Users,
  BookOpen,
  Award,
  School,
  Activity
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlatformStatistics from '@/components/admin/dashboard/PlatformStatistics';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import ApprovalRequests from '@/components/admin/dashboard/ApprovalRequests';
import UserGrowthChart from '@/components/admin/dashboard/UserGrowthChart';
import CoursePerformanceChart from '@/components/admin/dashboard/CoursePerformanceChart';

const DashboardPage: React.FC = () => {
  // Mock data for dashboard stats
  const stats = [
    {
      title: 'Total Users',
      value: '2,845',
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Active Courses',
      value: '128',
      change: '+3.2%',
      trend: 'up',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: 'Tutoring Sessions',
      value: '387',
      change: '+21.4%',
      trend: 'up',
      icon: <School className="h-5 w-5" />
    },
    {
      title: 'Achievements Earned',
      value: '3,541',
      change: '-2.3%',
      trend: 'down',
      icon: <Award className="h-5 w-5" />
    },
    {
      title: 'Points Issued',
      value: '245,280',
      change: '+15.8%',
      trend: 'up',
      icon: <Activity className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={cn(
                "p-1 rounded-md",
                stat.trend === 'up' ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-400" :
                                       "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-400"
              )}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={cn(
                "text-xs flex items-center mt-1",
                stat.trend === 'up' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <UserGrowthChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <CoursePerformanceChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Approval Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalRequests />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="statistics">
        <TabsList>
          <TabsTrigger value="statistics">Platform Statistics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Platform Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <PlatformStatistics />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Admin Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function for class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default DashboardPage;
