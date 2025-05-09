
import { v4 as uuidv4 } from 'uuid';
import { Certificate, Badge, User } from '@/types/user';
import { Course } from '@/types/course';
import { TutoringSession } from '@/types/tutoring';
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
export const generateCourseCertificate = (
  user: User,
  course: Course,
  customMessage?: string
): Certificate => {
  const badge = generateCourseBadge(course);
  
  return {
    id: uuidv4(),
    userId: user.id,
    title: `Certificate of Completion: ${course.title}`,
    issueDate: new Date(),
    type: 'course',
    courseId: course.id,
    courseName: course.title,
    teacherId: course.teacherId,
    teacherName: course.teacherName,
    customMessage: customMessage,
    badgeId: badge.id
  };
};

// Generate a certificate for tutoring completion
export const generateTutoringCertificate = (
  user: User,
  session: TutoringSession,
  customMessage?: string
): Certificate => {
  const badge = generateTutoringBadge();
  
  return {
    id: uuidv4(),
    userId: user.id,
    title: `Certificate of Excellence: ${session.subject}`,
    issueDate: new Date(),
    type: 'tutoring',
    tutoringId: session.id,
    tutoringSubject: session.subject,
    teacherId: session.teacherId,
    teacherName: session.teacherName,
    customMessage: customMessage,
    badgeId: badge.id
  };
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
