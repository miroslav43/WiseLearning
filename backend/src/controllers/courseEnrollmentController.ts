import { Request, Response } from 'express';
import { prisma } from '../index';

// Get enrolled courses for the current user
export const getEnrolledCourses = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log('Fetching enrolled courses for user:', req.user.id);

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        course: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            topics: {
              orderBy: {
                orderIndex: 'asc'
              },
              include: {
                lessons: {
                  orderBy: {
                    orderIndex: 'asc'
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log('Found enrollments:', enrollments.length);

    const courses = enrollments.map(enrollment => ({
      ...enrollment.course,
      enrolledAt: enrollment.enrolledAt,
      completed: enrollment.completed,
      completedAt: enrollment.completedAt
    }));

    console.log('Mapped courses:', courses.length);

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    console.error('Error details:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    res.status(500).json({ message: 'Error fetching enrolled courses' });
  }
};

// Enroll a user in a course
export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { 
        id: true, 
        title: true, 
        status: true,
        teacherId: true 
      }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.status !== 'published') {
      return res.status(400).json({ message: 'Course is not available for enrollment' });
    }

    // Check if user is not the teacher
    if (course.teacherId === userId) {
      return res.status(400).json({ message: 'Teachers cannot enroll in their own courses' });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId
      },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
};

// Unenroll a user from a course
export const unenrollFromCourse = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if enrollment exists
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    // Delete enrollment and related data
    await prisma.$transaction(async (tx) => {
      // Delete lesson progress
      await tx.lessonProgress.deleteMany({
        where: {
          userId,
          lesson: {
            topic: {
              courseId
            }
          }
        }
      });

      // Delete quiz attempts
      await tx.quizAttempt.deleteMany({
        where: {
          userId,
          courseId
        }
      });

      // Delete enrollment
      await tx.enrollment.delete({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });
    });

    res.status(200).json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    res.status(500).json({ message: 'Error unenrolling from course' });
  }
};

// Check if user is enrolled in a course
export const checkEnrollmentStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      select: {
        id: true,
        enrolledAt: true,
        completed: true,
        completedAt: true,
        status: true
      }
    });

    res.status(200).json({
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    res.status(500).json({ message: 'Error checking enrollment status' });
  }
};

// Mark course as completed for user
export const markCourseCompleted = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if enrollment exists
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    if (enrollment.completed) {
      return res.status(400).json({ message: 'Course already completed' });
    }

    // Update enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      data: {
        completed: true,
        completedAt: new Date()
      }
    });

    res.status(200).json({
      message: 'Course marked as completed',
      enrollment: updatedEnrollment
    });
  } catch (error) {
    console.error('Error marking course as completed:', error);
    res.status(500).json({ message: 'Error marking course as completed' });
  }
}; 