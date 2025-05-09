
import React from 'react';
import { TutoringSession, TutoringRequest } from '@/types/tutoring';
import TutoringRequestCard from './TutoringRequestCard';
import EmptyRequestsView from './EmptyRequestsView';

interface TutoringRequestsProps {
  sessions: TutoringSession[];
  requests: TutoringRequest[];
  onViewRequest: (request: TutoringRequest) => void;
}

const TutoringRequests: React.FC<TutoringRequestsProps> = ({
  sessions,
  requests,
  onViewRequest
}) => {
  if (requests.length === 0) {
    return <EmptyRequestsView />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map(request => (
        <TutoringRequestCard
          key={request.id}
          request={request}
          sessions={sessions}
          onView={onViewRequest}
        />
      ))}
    </div>
  );
};

export default TutoringRequests;
