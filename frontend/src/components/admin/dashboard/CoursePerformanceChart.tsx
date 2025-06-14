import { getCoursePerformance } from "@/services/adminService";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CoursePerformanceData {
  name: string;
  enrollments: number;
  rating: number;
}

const CoursePerformanceChart: React.FC = () => {
  const [data, setData] = useState<CoursePerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoursePerformance = async () => {
      try {
        setLoading(true);
        const response = await getCoursePerformance();

        if (response && Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setData([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch course performance data:", err);
        setError(
          "Failed to load course performance chart. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCoursePerformance();
  }, []);

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
        <p>No course performance data available.</p>
      </div>
    );
  }

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
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#82ca9d"
            domain={[0, 5]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="enrollments"
            fill="#8884d8"
            name="Enrollments"
          />
          <Bar yAxisId="right" dataKey="rating" fill="#82ca9d" name="Rating" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoursePerformanceChart;
