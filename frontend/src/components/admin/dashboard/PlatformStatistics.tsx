import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDashboardStats } from "@/services/adminService";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Metric {
  name: string;
  value: string;
  trend: "up" | "down" | "neutral";
}

interface StatGroup {
  category: string;
  metrics: Metric[];
}

const PlatformStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<StatGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();

        // Transform the API response into the format we need
        if (response && response.statistics) {
          setStatistics(response.statistics);
        } else {
          setStatistics([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard statistics:", err);
        setError("Failed to load platform statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const getTrendBadge = (trend: string) => {
    if (trend === "up") {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
        >
          Increasing
        </Badge>
      );
    } else if (trend === "down") {
      return (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
        >
          Decreasing
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
        >
          Stable
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-800">
        <p>{error}</p>
      </div>
    );
  }

  if (!statistics.length) {
    return (
      <div className="rounded-md bg-yellow-50 p-4 text-yellow-800">
        <p>No platform statistics available at the moment.</p>
      </div>
    );
  }

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
