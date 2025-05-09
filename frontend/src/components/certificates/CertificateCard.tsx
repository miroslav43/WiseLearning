
import React, { useState } from 'react';
import { Certificate, Badge as BadgeType } from '@/types/user';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import BadgeIcon from './BadgeIcon';
import { getBadgeById, generatePDF } from '@/services/certificateService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CertificateTemplate from './CertificateTemplate';
import { useToast } from '@/hooks/use-toast';

interface CertificateCardProps {
  certificate: Certificate;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const badge = getBadgeById(certificate.badgeId);
  
  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const fileName = `certificate-${certificate.id.substring(0, 8)}`;
      await generatePDF(`certificate-${certificate.id}`, fileName);
      toast({
        title: "Certificate downloaded",
        description: "Your certificate has been saved to your downloads folder.",
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {badge && <BadgeIcon badge={badge} size="md" />}
          
          <div className="flex-1">
            <h3 className="font-medium">{certificate.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {certificate.type === 'course' ? certificate.courseName : certificate.tutoringSubject}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {certificate.type === 'course' ? 'Course' : 'Tutoring'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {format(new Date(certificate.issueDate), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Certificate</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <CertificateTemplate certificate={certificate} />
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={handleDownload}
          disabled={isGenerating}
        >
          <Download className="h-3 w-3 mr-1" />
          {isGenerating ? 'Generating...' : 'Download'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;
