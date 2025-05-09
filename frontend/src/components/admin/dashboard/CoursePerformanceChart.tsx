
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CoursePerformanceChart: React.FC = () => {
  // Mock data
  const data = [
    { name: 'Math', enrollments: 320, rating: 4.7 },
    { name: 'Computer Science', enrollments: 480, rating: 4.9 },
    { name: 'Romanian', enrollments: 250, rating: 4.5 },
    { name: 'Physics', enrollments: 180, rating: 4.3 },
    { name: 'Chemistry', enrollments: 120, rating: 4.2 },
    { name: 'Biology', enrollments: 190, rating: 4.6 },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 5]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)', 
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }} 
          />
          <Bar yAxisId="left" dataKey="enrollments" fill="#8884d8" name="Enrollments" />
          <Bar yAxisId="right" dataKey="rating" fill="#82ca9d" name="Rating" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoursePerformanceChart;
