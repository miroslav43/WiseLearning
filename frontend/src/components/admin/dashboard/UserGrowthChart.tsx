
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserGrowthChart: React.FC = () => {
  // Mock data
  const data = [
    { name: 'Jan', students: 1200, teachers: 45 },
    { name: 'Feb', students: 1350, teachers: 52 },
    { name: 'Mar', students: 1450, teachers: 60 },
    { name: 'Apr', students: 1600, teachers: 68 },
    { name: 'May', students: 1750, teachers: 75 },
    { name: 'Jun', students: 1950, teachers: 82 },
    { name: 'Jul', students: 2100, teachers: 90 },
    { name: 'Aug', students: 2300, teachers: 95 },
    { name: 'Sep', students: 2500, teachers: 105 },
    { name: 'Oct', students: 2650, teachers: 115 },
    { name: 'Nov', students: 2750, teachers: 125 },
    { name: 'Dec', students: 2845, teachers: 135 },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)', 
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="students" 
            stroke="#8884d8" 
            fillOpacity={1} 
            fill="url(#colorStudents)" 
            name="Students"
          />
          <Area 
            type="monotone" 
            dataKey="teachers" 
            stroke="#82ca9d" 
            fillOpacity={1} 
            fill="url(#colorTeachers)" 
            name="Teachers"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;
