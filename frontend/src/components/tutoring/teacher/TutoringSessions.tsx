
import React from 'react';
import { TutoringSession, TutoringRequest } from '@/types/tutoring';
import TutoringSessionCard from './TutoringSessionCard';
import EmptySessionsView from './EmptySessionsView';

interface TutoringSessionsProps {
  sessions: TutoringSession[];
  requests: TutoringRequest[];
  onCreateSession: () => void;
  onViewSession: (session: TutoringSession) => void;
  onEditSession: (session: TutoringSession) => void;
  onDeleteSession: (session: TutoringSession) => void;
}

const TutoringSessions: React.FC<TutoringSessionsProps> = ({
  sessions,
  requests,
  onCreateSession,
  onViewSession,
  onEditSession,
  onDeleteSession
}) => {
  if (sessions.length === 0) {
    return <EmptySessionsView onCreateSession={onCreateSession} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map(session => (
        <TutoringSessionCard
          key={session.id}
          session={session}
          requests={requests}
          onView={onViewSession}
          onEdit={onEditSession}
          onDelete={onDeleteSession}
        />
      ))}
    </div>
  );
};

export default TutoringSessions;
