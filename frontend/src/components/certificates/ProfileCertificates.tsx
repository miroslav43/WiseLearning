
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Certificate } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBadgeById } from '@/services/certificateService';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import BadgeIcon from './BadgeIcon';

const ProfileCertificates: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || !user.certificates || user.certificates.length === 0) {
    return null;
  }
  
  const certificates = user.certificates;
  const recentCertificates = certificates
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 3);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Certificate Collection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentCertificates.length > 0 ? (
          <div className="space-y-3">
            {recentCertificates.map(certificate => {
              const badge = getBadgeById(certificate.badgeId);
              return (
                <div key={certificate.id} className="flex items-center gap-3">
                  {badge && <BadgeIcon badge={badge} size="sm" />}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{certificate.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(certificate.issueDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No certificates earned yet.
          </div>
        )}
        
        <Button asChild variant="outline" className="w-full mt-2">
          <Link to="/my-certificates" className="flex items-center justify-between">
            <span>View all certificates</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCertificates;
