import { cn } from "@/lib/utils";
import { getRecentActivity } from "@/services/adminService";
import { format } from "date-fns";
import { Edit, Loader2, Plus, Settings, Trash2, User } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Activity {
  id: number | string;
  user: string;
  action: string;
  type: "create" | "update" | "delete" | "approve" | "other";
  timestamp: string;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        const response = await getRecentActivity();

        if (response && Array.isArray(response.data)) {
          setActivities(response.data);
        } else {
          setActivities([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
        setError("Failed to load recent activity. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return <Plus className="h-4 w-4" />;
      case "update":
        return <Edit className="h-4 w-4" />;
      case "delete":
        return <Trash2 className="h-4 w-4" />;
      case "approve":
        return <User className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "create":
        return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400";
      case "update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400";
      case "delete":
        return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400";
      case "approve":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400";
    }
  };

  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy h:mm a");
    } catch (error) {
      console.error("Invalid date format", error);
      return dateString;
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

  if (!activities.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No recent activity to display
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                        getActivityColor(activity.type)
                      )}
                    >
                      {getActivityIcon(activity.type)}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {activity.user}
                        </span>{" "}
                        {activity.action}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentActivity;
