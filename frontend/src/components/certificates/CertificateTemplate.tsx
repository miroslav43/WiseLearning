
import React from 'react';
import { Certificate } from '@/types/user';
import { getBadgeById } from '@/services/certificateService';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Award } from 'lucide-react';

interface CertificateTemplateProps {
  certificate: Certificate;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ certificate }) => {
  const badge = getBadgeById(certificate.badgeId);
  
  return (
    <div 
      id={`certificate-${certificate.id}`} 
      className="w-full bg-white border border-gray-200 rounded-md p-8 relative overflow-hidden"
      style={{ 
        minHeight: '500px',
        backgroundImage: 'url(/certificate-bg.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Border decoration */}
      <div className="absolute inset-0 border-8 border-double border-brand-100 m-4 pointer-events-none" />
      
      {/* Certificate header */}
      <div className="text-center mb-10 relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center">
            <Award className="w-10 h-10 text-brand-700" />
          </div>
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-1">Certificate of Achievement</h1>
        <p className="text-lg text-gray-600">WiseLearning</p>
      </div>
      
      {/* Certificate content */}
      <div className="text-center mb-10">
        <p className="text-lg text-gray-600 mb-4">This is to certify that</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">{certificate.userId}</h2>
        <p className="text-lg text-gray-600 mb-4">has successfully completed</p>
        <h3 className="text-xl font-bold text-gray-800 mb-6 font-serif">
          {certificate.type === 'course' ? certificate.courseName : certificate.tutoringSubject}
        </h3>
        
        {certificate.customMessage && (
          <p className="text-md text-gray-700 mb-6 italic">{certificate.customMessage}</p>
        )}
      </div>
      
      {/* Badge */}
      {badge && (
        <div className="flex justify-center mb-8">
          <Badge variant="brandSecondary" className="px-4 py-2 text-sm">
            {badge.name}
          </Badge>
        </div>
      )}
      
      {/* Certificate footer */}
      <div className="flex justify-between items-end mt-12">
        <div>
          <p className="text-sm text-gray-500">Issued on</p>
          <p className="text-md font-medium">{format(certificate.issueDate, 'MMMM d, yyyy')}</p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Authorized by</p>
          <p className="text-md font-medium">{certificate.teacherName}</p>
          <p className="text-sm text-gray-500">Instructor</p>
        </div>
      </div>
      
      {/* Serial number */}
      <div className="absolute bottom-3 left-3 text-xs text-gray-400">
        Certificate ID: {certificate.id.substring(0, 8)}
      </div>
    </div>
  );
};

export default CertificateTemplate;
