
import React from 'react';
import { User, Edit, Trash2, Plus, Award, Settings, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Mock data for recent activity (fixed the octal literal error)
const activities = [
  {
    id: 1,
    user: 'Admin',
    action: 'Created new achievement "Consistent Learner"',
    type: 'create',
    icon: <Award className="h-4 w-4" />,
    timestamp: new Date(2023, 4, 20, 14, 32)
  },
  {
    id: 2,
    user: 'Admin',
    action: 'Updated points pricing for course "Advanced Mathematics"',
    type: 'update',
    icon: <Edit className="h-4 w-4" />,
    timestamp: new Date(2023, 4, 20, 11, 15)
  },
  {
    id: 3,
    user: 'Admin',
    action: 'Approved new teacher "Maria Popescu"',
    type: 'approve',
    icon: <User className="h-4 w-4" />,
    timestamp: new Date(2023, 4, 19, 16, 45)
  },
  {
    id: 4,
    user: 'Admin',
    action: 'Modified referral reward settings',
    type: 'update',
    icon: <Settings className="h-4 w-4" />,
    timestamp: new Date(2023, 4, 19, 10, 22)
  },
  {
    id: 5,
    user: 'Admin',
    action: 'Deleted review from course "Introduction to Physics"',
    type: 'delete',
    icon: <Trash2 className="h-4 w-4" />,
    timestamp: new Date(2023, 4, 18, 15, 30)
  },
  {
    id: 6,
    user: 'Admin',
    action: 'Added new points package "Premium Bundle"',
    type: 'create',
    icon: <Plus className="h-4 w-4" />,
    timestamp: new Date(2023, 4, 18, 9, 10)
  },
  {
    id: 7,
    user: 'Admin',
    action: 'Featured course "Romanian Grammar"',
    type: 'update',
    icon: <Star className="h-4 w-4" />,
    timestamp: new Date(2023, 4, 17, 14, 5)
  }
];

const RecentActivity: React.FC = () => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400';
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400';
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400';
      case 'approve':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const formatTimestamp = (date: Date) => {
    return format(date, 'MMM d, yyyy h:mm a');
  };

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
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                        getActivityColor(activity.type)
                      )}
                    >
                      {activity.icon}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {activity.user}
                        </span>{' '}
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
