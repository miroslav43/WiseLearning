
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TutoringSession, TutoringRequest } from '@/types/tutoring';

interface TutoringStatsProps {
  sessions: TutoringSession[];
  requests: TutoringRequest[];
}

const TutoringStats: React.FC<TutoringStatsProps> = ({ sessions, requests }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sesiuni active</CardTitle>
          <CardDescription>Sesiuni aprobate și disponibile</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-3xl font-bold">
            {sessions.filter(s => s.status === 'approved').length}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">În așteptare</CardTitle>
          <CardDescription>Sesiuni care așteaptă aprobarea</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-3xl font-bold">
            {sessions.filter(s => s.status === 'pending').length}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Cereri noi</CardTitle>
          <CardDescription>Cereri de la studenți</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-3xl font-bold">
            {requests.filter(r => r.status === 'pending').length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutoringStats;
