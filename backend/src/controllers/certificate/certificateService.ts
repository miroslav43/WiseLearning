import { prisma } from '../../index';

/**
 * Get all certificates for a specific user
 */
export const getUserCertificates = async (userId: string) => {
  return prisma.certificate.findMany({
    where: {
      userId
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          image: true
        }
      },
      tutoring: {
        select: {
          id: true,
          subject: true
        }
      },
      badge: true
    },
    orderBy: {
      issueDate: 'desc'
    }
  });
};

/**
 * Get a specific certificate by ID
 */
export const getCertificateById = async (id: string) => {
  return prisma.certificate.findUnique({
    where: {
      id
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          image: true,
          subject: true,
          teacherId: true,
          teacher: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      tutoring: {
        select: {
          id: true,
          subject: true,
          teacherId: true,
          teacher: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      badge: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

/**
 * Generate a course completion certificate
 */
export const generateCourseCertificate = async (
  userId: string,
  courseId: string,
  additionalData: {
    customMessage?: string;
    badgeId?: string;
  } = {}
) => {
  // Fetch course and user data
  const [course, user] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }),
    prisma.user.findUnique({
      where: { id: userId }
    })
  ]);
  
  if (!course || !user) {
    throw new Error('Course or user not found');
  }
  
  // Check if user has completed the course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    }
  });
  
  if (!enrollment || !enrollment.completed) {
    throw new Error('User has not completed this course');
  }
  
  // Check if certificate already exists
  const existingCert = await prisma.certificate.findFirst({
    where: {
      userId,
      courseId
    }
  });
  
  if (existingCert) {
    return existingCert;
  }
  
  // Generate certificate
  const certificate = await prisma.certificate.create({
    data: {
      userId,
      title: `${course.title} - Course Completion Certificate`,
      type: 'course_completion',
      courseId: course.id,
      courseName: course.title,
      teacherId: course.teacherId,
      teacherName: course.teacher.name,
      customMessage: additionalData.customMessage,
      badgeId: additionalData.badgeId,
      // Mock imageUrl for now - in a real system, this would be generated
      imageUrl: `/certificates/course-${courseId}-${userId}.png`
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          image: true
        }
      },
      badge: true
    }
  });
  
  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      title: 'New Certificate',
      message: `You've earned a certificate for completing "${course.title}"`,
      type: 'success',
      link: `/certificates/${certificate.id}`
    }
  });
  
  return certificate;
};

/**
 * Generate a tutoring completion certificate
 */
export const generateTutoringCertificate = async (
  userId: string,
  tutoringId: string,
  additionalData: {
    customMessage?: string;
    badgeId?: string;
  } = {}
) => {
  // Fetch tutoring session and user data
  const [tutoring, user] = await Promise.all([
    prisma.tutoringSession.findUnique({
      where: { id: tutoringId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }),
    prisma.user.findUnique({
      where: { id: userId }
    })
  ]);
  
  if (!tutoring || !user) {
    throw new Error('Tutoring session or user not found');
  }
  
  // Check if certificate already exists
  const existingCert = await prisma.certificate.findFirst({
    where: {
      userId,
      tutoringId
    }
  });
  
  if (existingCert) {
    return existingCert;
  }
  
  // Generate certificate
  const certificate = await prisma.certificate.create({
    data: {
      userId,
      title: `${tutoring.subject} - Tutoring Certificate`,
      type: 'tutoring_completion',
      tutoringId: tutoring.id,
      tutoringSubject: tutoring.subject,
      teacherId: tutoring.teacherId,
      teacherName: tutoring.teacher.name,
      customMessage: additionalData.customMessage,
      badgeId: additionalData.badgeId,
      // Mock imageUrl for now - in a real system, this would be generated
      imageUrl: `/certificates/tutoring-${tutoringId}-${userId}.png`
    },
    include: {
      tutoring: {
        select: {
          id: true,
          subject: true
        }
      },
      badge: true
    }
  });
  
  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      title: 'New Certificate',
      message: `You've earned a certificate for completing tutoring in "${tutoring.subject}"`,
      type: 'success',
      link: `/certificates/${certificate.id}`
    }
  });
  
  return certificate;
}; 