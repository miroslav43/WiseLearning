
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Users, BookOpen, UserCheck, Clock } from 'lucide-react';

// Mock data for demonstration
const userStatsData = [
  { name: 'Ian', value: 35 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 61 },
  { name: 'Apr', value: 80 },
  { name: 'Mai', value: 65 },
  { name: 'Iun', value: 59 }
];

const teacherStatusData = [
  { name: 'Aprobați', value: 68, color: '#10b981' },
  { name: 'În așteptare', value: 12, color: '#f59e0b' },
  { name: 'Respinși', value: 8, color: '#ef4444' }
];

const AdminStats: React.FC = () => {
  const stats = [
    {
      title: "Utilizatori totali",
      value: "1,284",
      icon: <Users className="h-5 w-5 text-brand-600" />,
      description: "↑ 16% față de luna trecută"
    },
    {
      title: "Cursuri publicate",
      value: "85",
      icon: <BookOpen className="h-5 w-5 text-brand-600" />,
      description: "↑ 8% față de luna trecută"
    },
    {
      title: "Profesori aprobați",
      value: "68",
      icon: <UserCheck className="h-5 w-5 text-brand-600" />,
      description: "12 în așteptare pentru aprobare"
    },
    {
      title: "Cursuri în așteptare",
      value: "23",
      icon: <Clock className="h-5 w-5 text-brand-600" />,
      description: "Necesită revizuire și aprobare"
    }
  ];

  const chartConfig = {
    users: {
      label: "Utilizatori",
      theme: {
        light: "#10b981",
        dark: "#10b981",
      },
    },
    teachers: {
      label: "Profesori",
      theme: {
        light: "#8b5cf6",
        dark: "#8b5cf6",
      },
    },
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Utilizatori noi înregistrați</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userStatsData}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="var(--color-users)" 
                    radius={[4, 4, 0, 0]} 
                    name="users"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuția profesorilor</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={teacherStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {teacherStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
