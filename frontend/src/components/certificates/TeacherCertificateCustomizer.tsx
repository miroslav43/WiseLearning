
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Award } from 'lucide-react';
import { Student } from '@/types/user';
import { Course } from '@/types/course';
import { TutoringSession } from '@/types/tutoring';
import { generateCourseCertificate, generateTutoringCertificate } from '@/services/certificateService';
import { useToast } from '@/hooks/use-toast';

interface TeacherCertificateCustomizerProps {
  student: Student;
  type: 'course' | 'tutoring';
  course?: Course;
  tutoring?: TutoringSession;
  onCertificateGenerated: (certificate: any) => void;
}

const TeacherCertificateCustomizer: React.FC<TeacherCertificateCustomizerProps> = ({
  student,
  type,
  course,
  tutoring,
  onCertificateGenerated
}) => {
  const [customMessage, setCustomMessage] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleGenerateCertificate = () => {
    try {
      if (type === 'course' && course) {
        const certificate = generateCourseCertificate(student, course, customMessage);
        onCertificateGenerated(certificate);
      } else if (type === 'tutoring' && tutoring) {
        const certificate = generateTutoringCertificate(student, tutoring, customMessage);
        onCertificateGenerated(certificate);
      }
      
      toast({
        title: "Certificate generated",
        description: "The certificate has been generated and sent to the student.",
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: "Error",
        description: "There was an error generating the certificate.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Award className="h-4 w-4 mr-2" />
          Generate Certificate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Certificate</DialogTitle>
          <DialogDescription>
            Create a certificate for {student.name} for completing 
            {type === 'course' ? ` the course "${course?.title}"` : ` tutoring in "${tutoring?.subject}"`}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="customMessage" className="text-sm font-medium">
              Custom Message (Optional)
            </label>
            <Textarea
              id="customMessage"
              placeholder="Add a personalized message for the student..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This message will appear on the certificate.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerateCertificate}>
            Generate Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherCertificateCustomizer;
