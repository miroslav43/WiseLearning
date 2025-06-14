import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserGrowthData } from "@/services/adminService";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface UserGrowthData {
  name: string;
  students: number;
  teachers: number;
}

const UserGrowthChart: React.FC = () => {
  const [data, setData] = useState<UserGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("month");

  useEffect(() => {
    const fetchUserGrowthData = async () => {
      try {
        setLoading(true);
        const response = await getUserGrowthData(period);

        if (response && Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setData([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user growth data:", err);
        setError("Failed to load user growth chart. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserGrowthData();
  }, [period]);

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-800 h-80 flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-md bg-yellow-50 p-4 text-yellow-800 h-80 flex items-center justify-center">
        <p>No user growth data available for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
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
    </div>
  );
};

export default UserGrowthChart;
