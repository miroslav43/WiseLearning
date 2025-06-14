import { Request, Response } from 'express';
import { prisma } from '../index';

// Save/unsave a course for current user
export const toggleSavedCourse = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already saved
    const existingSaved = await prisma.savedCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingSaved) {
      // Remove from saved
      await prisma.savedCourse.delete({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });
      res.status(200).json({ saved: false, message: 'Course removed from saved' });
    } else {
      // Add to saved
      await prisma.savedCourse.create({
        data: {
          userId,
          courseId
        }
      });
      res.status(200).json({ saved: true, message: 'Course saved' });
    }
  } catch (error) {
    console.error('Error toggling saved course:', error);
    res.status(500).json({ message: 'Error toggling saved course' });
  }
};

// Like/unlike a course for current user
export const toggleLikedCourse = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already liked
    const existingLiked = await prisma.likedCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingLiked) {
      // Remove like
      await prisma.likedCourse.delete({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });
      res.status(200).json({ liked: false, message: 'Course unliked' });
    } else {
      // Add like
      await prisma.likedCourse.create({
        data: {
          userId,
          courseId
        }
      });
      res.status(200).json({ liked: true, message: 'Course liked' });
    }
  } catch (error) {
    console.error('Error toggling liked course:', error);
    res.status(500).json({ message: 'Error toggling liked course' });
  }
};

// Get saved courses for current user
export const getSavedCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const savedCourses = await prisma.savedCourse.findMany({
      where: { userId },
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
            reviews: {
              select: {
                rating: true
              }
            }
          }
        }
      },
      orderBy: { savedAt: 'desc' }
    });

    const courses = savedCourses.map((saved: any) => ({
      ...saved.course,
      savedAt: saved.savedAt
    }));

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching saved courses:', error);
    res.status(500).json({ message: 'Error fetching saved courses' });
  }
};

// Get liked courses for current user
export const getLikedCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const likedCourses = await prisma.likedCourse.findMany({
      where: { userId },
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
            reviews: {
              select: {
                rating: true
              }
            }
          }
        }
      },
      orderBy: { likedAt: 'desc' }
    });

    const courses = likedCourses.map((liked: any) => ({
      ...liked.course,
      likedAt: liked.likedAt
    }));

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching liked courses:', error);
    res.status(500).json({ message: 'Error fetching liked courses' });
  }
};

// Check if course is saved by current user
export const checkSavedStatus = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const savedCourse = await prisma.savedCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    res.status(200).json({
      isSaved: !!savedCourse,
      savedAt: savedCourse?.savedAt || null
    });
  } catch (error) {
    console.error('Error checking saved status:', error);
    res.status(500).json({ message: 'Error checking saved status' });
  }
};

// Check if course is liked by current user
export const checkLikedStatus = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const likedCourse = await prisma.likedCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    res.status(200).json({
      isLiked: !!likedCourse,
      likedAt: likedCourse?.likedAt || null
    });
  } catch (error) {
    console.error('Error checking liked status:', error);
    res.status(500).json({ message: 'Error checking liked status' });
  }
};

// Get all favorites (saved + liked) for current user
export const getAllFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const [savedCourses, likedCourses] = await Promise.all([
      prisma.savedCourse.findMany({
        where: { userId },
        select: {
          courseId: true,
          savedAt: true
        }
      }),
      prisma.likedCourse.findMany({
        where: { userId },
        select: {
          courseId: true,
          likedAt: true
        }
      })
    ]);

    const savedCourseIds = savedCourses.map(saved => saved.courseId);
    const likedCourseIds = likedCourses.map(liked => liked.courseId);

    res.status(200).json({
      savedCourses: savedCourseIds,
      likedCourses: likedCourseIds,
      savedDetails: savedCourses.reduce((acc, saved) => {
        acc[saved.courseId] = { savedAt: saved.savedAt };
        return acc;
      }, {} as Record<string, { savedAt: Date }>),
      likedDetails: likedCourses.reduce((acc, liked) => {
        acc[liked.courseId] = { likedAt: liked.likedAt };
        return acc;
      }, {} as Record<string, { likedAt: Date }>)
    });
  } catch (error) {
    console.error('Error fetching all favorites:', error);
    res.status(500).json({ message: 'Error fetching all favorites' });
  }
};

// Remove multiple courses from saved
export const removeBulkSaved = async (req: Request, res: Response) => {
  try {
    const { courseIds } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: 'Course IDs array is required' });
    }

    await prisma.savedCourse.deleteMany({
      where: {
        userId,
        courseId: { in: courseIds }
      }
    });

    res.status(200).json({ 
      message: `Removed ${courseIds.length} courses from saved`,
      removedCount: courseIds.length
    });
  } catch (error) {
    console.error('Error removing bulk saved courses:', error);
    res.status(500).json({ message: 'Error removing bulk saved courses' });
  }
}; 