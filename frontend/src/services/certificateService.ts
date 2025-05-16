import { useNotifications } from '@/contexts/NotificationContext';
import { Course } from '@/types/course';
import { Badge, Certificate, User } from '@/types/user';
import { apiClient } from '@/utils/apiClient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Mock badges data
export const badgeTemplates: Badge[] = [
  {
    id: 'course-completion',
    name: 'Course Completion',
    description: 'Awarded for successfully completing a course',
    type: 'course',
    imageUrl: '/badges/course-completion.svg'
  },
  {
    id: 'tutoring-completion',
    name: 'Tutoring Excellence',
    description: 'Awarded for completing tutoring sessions',
    type: 'tutoring',
    imageUrl: '/badges/tutoring-excellence.svg'
  },
  {
    id: 'programming-master',
    name: 'Programming Master',
    description: 'Awarded for excellence in programming courses',
    type: 'course',
    category: 'computer-science',
    imageUrl: '/badges/programming-master.svg'
  },
  {
    id: 'math-wizard',
    name: 'Math Wizard',
    description: 'Awarded for excellence in mathematics',
    type: 'course',
    category: 'mathematics',
    imageUrl: '/badges/math-wizard.svg'
  }
];

// Generate a badge when a course is completed
export const generateCourseBadge = (course: Course): Badge => {
  // Find a subject-specific badge if available
  const subjectBadge = badgeTemplates.find(
    badge => badge.type === 'course' && badge.category === course.subject
  );
  
  // Use subject-specific badge or default to course completion badge
  return subjectBadge || badgeTemplates.find(badge => badge.id === 'course-completion')!;
};

// Generate a badge when tutoring is completed
export const generateTutoringBadge = (): Badge => {
  return badgeTemplates.find(badge => badge.id === 'tutoring-completion')!;
};

// Generate a certificate for course completion
export const generateCourseCertificate = async (
  courseId: string,
  customMessage?: string,
  badgeId?: string
) => {
  return apiClient.post<Certificate>('/certificates', {
    courseId,
    customMessage,
    badgeId
  });
};

// Generate a certificate for tutoring completion
export const generateTutoringCertificate = async (
  tutoringId: string,
  customMessage?: string,
  badgeId?: string
) => {
  return apiClient.post<Certificate>('/certificates', {
    tutoringId,
    customMessage,
    badgeId
  });
};

// Generate PDF certificate from HTML element
export const generatePDF = async (elementId: string, fileName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Add certificate to user's collection
export const addCertificateToUser = (user: User, certificate: Certificate): User => {
  return {
    ...user,
    certificates: [...(user.certificates || []), certificate]
  };
};

// Get badge by ID
export const getBadgeById = (badgeId: string): Badge | undefined => {
  return badgeTemplates.find(badge => badge.id === badgeId);
};

// Get certificates for a specific user
export const getUserCertificates = async (userId: string) => {
  return apiClient.get<Certificate[]>(`/certificates/user/${userId}`);
};

// Get my certificates (for the current user)
export const getMyCertificates = async () => {
  const userId = 'current'; // This will be handled by the backend based on the JWT token
  return apiClient.get<Certificate[]>(`/certificates/user/${userId}`);
};

// Get a specific certificate
export const getCertificateById = async (certificateId: string) => {
  return apiClient.get<Certificate>(`/certificates/${certificateId}`);
};

// Custom hook for using certificate service with notifications
export const useCertificateService = () => {
  const { addNotification } = useNotifications();
  
  const generateCourseCertificateWithNotification = async (
    courseId: string,
    customMessage?: string,
    badgeId?: string
  ) => {
    try {
      const certificate = await generateCourseCertificate(courseId, customMessage, badgeId);
      
      addNotification({
        title: 'Certificat generat',
        message: 'Certificatul tău pentru finalizarea cursului a fost generat cu succes.',
        type: 'success'
      });
      
      return certificate;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Eroare la generarea certificatului';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  const generateTutoringCertificateWithNotification = async (
    tutoringId: string,
    customMessage?: string,
    badgeId?: string
  ) => {
    try {
      const certificate = await generateTutoringCertificate(tutoringId, customMessage, badgeId);
      
      addNotification({
        title: 'Certificat generat',
        message: 'Certificatul tău pentru finalizarea tutoriatului a fost generat cu succes.',
        type: 'success'
      });
      
      return certificate;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Eroare la generarea certificatului';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  return {
    generateCourseCertificateWithNotification,
    generateTutoringCertificateWithNotification
  };
};
