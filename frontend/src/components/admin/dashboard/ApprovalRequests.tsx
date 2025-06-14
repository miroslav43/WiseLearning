import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  approveCourse,
  approveTeacher,
  getApprovalRequests,
  rejectCourse,
  rejectTeacher,
} from "@/services/adminService";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ApprovalRequest {
  id: string;
  type: "teacher" | "course";
  title: string;
  status: "pending";
  date: string;
}

const ApprovalRequests: React.FC = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchApprovalRequests();
  }, []);

  const fetchApprovalRequests = async () => {
    try {
      setLoading(true);
      const response = await getApprovalRequests();

      if (response && Array.isArray(response.data)) {
        setRequests(response.data);
      } else {
        setRequests([]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch approval requests:", err);
      setError("Failed to load approval requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: ApprovalRequest) => {
    try {
      setProcessingIds((prev) => [...prev, request.id]);

      if (request.type === "teacher") {
        await approveTeacher(request.id);
      } else {
        await approveCourse(request.id);
      }

      // Remove the approved request from the list
      setRequests((prev) => prev.filter((req) => req.id !== request.id));

      toast({
        title: "Approved",
        description: `Successfully approved ${
          request.type === "teacher" ? "teacher" : "course"
        }.`,
        variant: "default",
      });
    } catch (err) {
      console.error(`Failed to approve ${request.type}:`, err);
      toast({
        title: "Error",
        description: `Failed to approve ${request.type}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== request.id));
    }
  };

  const handleReject = async (request: ApprovalRequest) => {
    try {
      setProcessingIds((prev) => [...prev, request.id]);

      if (request.type === "teacher") {
        await rejectTeacher(request.id, "Rejected by admin");
      } else {
        await rejectCourse(request.id, "Rejected by admin");
      }

      // Remove the rejected request from the list
      setRequests((prev) => prev.filter((req) => req.id !== request.id));

      toast({
        title: "Rejected",
        description: `Successfully rejected ${
          request.type === "teacher" ? "teacher" : "course"
        }.`,
        variant: "default",
      });
    } catch (err) {
      console.error(`Failed to reject ${request.type}:`, err);
      toast({
        title: "Error",
        description: `Failed to reject ${request.type}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== request.id));
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

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No approval requests pending
        </div>
      ) : (
        <ul className="space-y-3">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className={
                      request.type === "teacher"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400"
                    }
                  >
                    {request.type === "teacher" ? "Teacher" : "Course"}
                  </Badge>
                  <span className="ml-2 font-medium">{request.title}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Submitted on {new Date(request.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-green-600 border-green-600"
                  onClick={() => handleApprove(request)}
                  disabled={processingIds.includes(request.id)}
                >
                  {processingIds.includes(request.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-red-600 border-red-600"
                  onClick={() => handleReject(request)}
                  disabled={processingIds.includes(request.id)}
                >
                  {processingIds.includes(request.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="text-center pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/approvals">View All Requests</Link>
        </Button>
      </div>
    </div>
  );
};

export default ApprovalRequests;
