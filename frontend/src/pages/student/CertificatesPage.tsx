
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Certificate } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CertificateCard from '@/components/certificates/CertificateCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, BookOpen, Heart } from 'lucide-react';

const CertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  
  useEffect(() => {
    if (user && user.certificates) {
      setCertificates(user.certificates);
    }
  }, [user]);
  
  const courseCertificates = certificates.filter(cert => cert.type === 'course');
  const tutoringCertificates = certificates.filter(cert => cert.type === 'tutoring');
  
  if (!user || user.role !== 'student') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Certificates</h1>
          <p>You need to be logged in as a student to view your certificates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Certificates</h1>
      
      {certificates.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No certificates yet</CardTitle>
            <CardDescription>
              Complete courses or tutoring sessions to earn certificates of achievement.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              All Certificates
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Certificates
            </TabsTrigger>
            <TabsTrigger value="tutoring" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Tutoring Certificates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map(certificate => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            {courseCertificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseCertificates.map(certificate => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    You don't have any course certificates yet. 
                    Complete a course to earn your first certificate!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="tutoring">
            {tutoringCertificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutoringCertificates.map(certificate => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    You don't have any tutoring certificates yet. 
                    Complete tutoring sessions to earn certificates!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CertificatesPage;
