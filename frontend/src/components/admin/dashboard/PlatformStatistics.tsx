
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const PlatformStatistics: React.FC = () => {
  // Mock data
  const statistics = [
    {
      category: 'User Engagement',
      metrics: [
        { name: 'Average Session Duration', value: '12m 30s', trend: 'up' },
        { name: 'Daily Active Users', value: '842', trend: 'up' },
        { name: 'Monthly Active Users', value: '2,567', trend: 'up' },
        { name: 'User Retention Rate', value: '68%', trend: 'down' }
      ]
    },
    {
      category: 'Content Statistics',
      metrics: [
        { name: 'Total Courses', value: '128', trend: 'up' },
        { name: 'Total Lessons', value: '2,345', trend: 'up' },
        { name: 'Average Course Rating', value: '4.6/5', trend: 'up' },
        { name: 'Course Completion Rate', value: '47%', trend: 'down' }
      ]
    },
    {
      category: 'Financial Metrics',
      metrics: [
        { name: 'Monthly Revenue', value: '€12,450', trend: 'up' },
        { name: 'Average Order Value', value: '€45.75', trend: 'up' },
        { name: 'Total Points Purchased', value: '245,280', trend: 'up' },
        { name: 'Point/Currency Ratio', value: '€1 = 10 pts', trend: 'neutral' }
      ]
    }
  ];

  const getTrendBadge = (trend: string) => {
    if (trend === 'up') {
      return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">Increasing</Badge>;
    } else if (trend === 'down') {
      return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400">Decreasing</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400">Stable</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {statistics.map((statGroup, index) => (
        <div key={index}>
          <h3 className="text-lg font-medium mb-3">{statGroup.category}</h3>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statGroup.metrics.map((metric, metricIndex) => (
                  <TableRow key={metricIndex}>
                    <TableCell className="font-medium">{metric.name}</TableCell>
                    <TableCell>{metric.value}</TableCell>
                    <TableCell>{getTrendBadge(metric.trend)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlatformStatistics;
