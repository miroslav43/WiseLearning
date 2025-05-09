
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ApprovalRequest {
  id: string;
  type: 'teacher' | 'course';
  title: string;
  status: 'pending';
  date: string;
}

const ApprovalRequests: React.FC = () => {
  // Mock data
  const requests: ApprovalRequest[] = [
    {
      id: '1',
      type: 'teacher',
      title: 'Maria Popescu - Mathematics Teacher',
      status: 'pending',
      date: '2023-05-15'
    },
    {
      id: '2',
      type: 'course',
      title: 'Advanced Physics - Wave Theory',
      status: 'pending',
      date: '2023-05-14'
    },
    {
      id: '3',
      type: 'teacher',
      title: 'Ion Ionescu - Computer Science Teacher',
      status: 'pending',
      date: '2023-05-13'
    },
    {
      id: '4',
      type: 'course',
      title: 'Romanian Literature - Modern Poetry',
      status: 'pending',
      date: '2023-05-12'
    }
  ];

  const handleApprove = (id: string) => {
    console.log('Approved:', id);
    // In a real app, this would update the database
  };

  const handleReject = (id: string) => {
    console.log('Rejected:', id);
    // In a real app, this would update the database
  };

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No approval requests
        </div>
      ) : (
        <ul className="space-y-3">
          {requests.map((request) => (
            <li key={request.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <div className="flex items-center">
                  <Badge variant="outline" className={request.type === 'teacher' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400' : 'bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400'}>
                    {request.type === 'teacher' ? 'Teacher' : 'Course'}
                  </Badge>
                  <span className="ml-2 font-medium">{request.title}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Submitted on {request.date}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1 text-green-600 border-green-600"
                  onClick={() => handleApprove(request.id)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1 text-red-600 border-red-600"
                  onClick={() => handleReject(request.id)}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="text-center pt-2">
        <Button variant="outline" size="sm" asChild>
          <a href="/admin/approvals">View All Requests</a>
        </Button>
      </div>
    </div>
  );
};

export default ApprovalRequests;
