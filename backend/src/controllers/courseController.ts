import { CourseStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../index';

// Get all published courses (for students)
export const getAllPublishedCourses = async (req: Request, res: Response) => {
  try {
    const { subject, search, featured } = req.query;
    
    // Build query filters
    const filters: any = {
      status: CourseStatus.published
    };
    
    if (subject) {
      filters.subject = subject as string;
    }
    
    if (search) {
      filters.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (featured === 'true') {
      filters.featured = true;
    }
    
    const courses = await prisma.course.findMany({
      where: filters,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            avatar: true,
            teacherProfile: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
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
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// Get courses by teacher ID
export const getTeacherCourses = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const courses = await prisma.course.findMany({
      where: {
        teacherId: id
      },
      include: {
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
        },
        reviews: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    res.status(500).json({ message: 'Error fetching teacher courses' });
  }
};

// Get my courses (for current teacher)
export const getMyCourses = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const courses = await prisma.course.findMany({
      where: {
        teacherId: req.user.id
      },
      include: {
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
        },
        reviews: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching my courses:', error);
    res.status(500).json({ message: 'Error fetching my courses' });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            avatar: true,
            teacherProfile: true
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
              },
              include: {
                quiz: {
                  include: {
                    questions: {
                      orderBy: {
                        orderIndex: 'asc'
                      }
                    }
                  }
                },
                assignment: true
              }
            }
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // If user is not the teacher and course is not published, return error
    if (
      (!req.user || req.user.id !== course.teacherId) && 
      course.status !== CourseStatus.published && 
      req.user?.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Course not available' });
    }
    
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course' });
  }
};

// Create a new course
export const createCourse = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { 
      title, 
      description, 
      subject, 
      image, 
      price, 
      pointsPrice,
      topics = [],
      status = 'draft'
    } = req.body;
    
    // Input validation
    if (!title || !subject) {
      return res.status(400).json({ message: 'Title and subject are required' });
    }
    
    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        subject,
        image,
        price: price || 0,
        pointsPrice: pointsPrice || 0,
        teacherId: req.user.id,
        status: status as CourseStatus
      }
    });
    
    // Create topics and lessons
    if (topics.length > 0) {
      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        
        const createdTopic = await prisma.topic.create({
          data: {
            courseId: course.id,
            title: topic.title,
            description: topic.description,
            orderIndex: i
          }
        });
        
        // Create lessons
        if (topic.lessons && topic.lessons.length > 0) {
          for (let j = 0; j < topic.lessons.length; j++) {
            const lesson = topic.lessons[j];
            
            const createdLesson = await prisma.lesson.create({
              data: {
                topicId: createdTopic.id,
                title: lesson.title,
                description: lesson.description,
                videoUrl: lesson.videoUrl,
                content: lesson.content,
                duration: lesson.duration || 0,
                orderIndex: j,
                type: lesson.type || 'lesson',
                courseId: course.id
              }
            });
            
            // Create quiz if it exists
            if (lesson.type === 'quiz' && lesson.quiz) {
              const createdQuiz = await prisma.quiz.create({
                data: {
                  lessonId: createdLesson.id,
                  title: lesson.quiz.title,
                  description: lesson.quiz.description,
                  timeLimit: lesson.quiz.timeLimit
                }
              });
              
              // Create questions
              if (lesson.quiz.questions && lesson.quiz.questions.length > 0) {
                for (let k = 0; k < lesson.quiz.questions.length; k++) {
                  const question = lesson.quiz.questions[k];
                  
                  await prisma.question.create({
                    data: {
                      quizId: createdQuiz.id,
                      questionText: question.questionText,
                      type: question.type,
                      options: question.options,
                      correctOptions: question.correctOptions,
                      orderIndex: k
                    }
                  });
                }
              }
            }
            
            // Create assignment if it exists
            if (lesson.type === 'assignment' && lesson.assignment) {
              await prisma.assignment.create({
                data: {
                  lessonId: createdLesson.id,
                  title: lesson.assignment.title,
                  description: lesson.assignment.description,
                  dueDate: lesson.assignment.dueDate,
                  maxScore: lesson.assignment.maxScore || 100,
                  allowFileUpload: lesson.assignment.allowFileUpload !== false,
                  allowedFileTypes: lesson.assignment.allowedFileTypes || [],
                  unitTests: lesson.assignment.unitTests
                }
              });
            }
          }
        }
      }
    }
    
    res.status(201).json({
      message: 'Course created successfully',
      courseId: course.id
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course' });
  }
};

// Update a course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { id } = req.params;
    const { 
      title, 
      description, 
      subject, 
      image, 
      price, 
      pointsPrice,
      status,
      featured,
      topics
    } = req.body;
    
    // Check if course exists and belongs to the user
    const courseExists = await prisma.course.findUnique({
      where: { id },
      select: { teacherId: true }
    });
    
    if (!courseExists) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is authorized (teacher or admin)
    if (courseExists.teacherId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Update course basic info
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        subject,
        image,
        price: price !== undefined ? price : undefined,
        pointsPrice: pointsPrice !== undefined ? pointsPrice : undefined,
        status: status !== undefined ? status as CourseStatus : undefined,
        featured: featured !== undefined ? featured : undefined,
        updatedAt: new Date()
      }
    });
    
    // Handle topics update if provided
    if (topics) {
      // First, get existing topics
      const existingTopics = await prisma.topic.findMany({
        where: { courseId: id },
        include: {
          lessons: {
            include: {
              quiz: { include: { questions: true } },
              assignment: true
            }
          }
        }
      });
      
      // Process topics
      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        
        if (topic.id) {
          // Update existing topic
          const existingTopic = existingTopics.find(t => t.id === topic.id);
          
          if (existingTopic) {
            await prisma.topic.update({
              where: { id: topic.id },
              data: {
                title: topic.title,
                description: topic.description,
                orderIndex: i
              }
            });
            
            // Process lessons
            if (topic.lessons) {
              for (let j = 0; j < topic.lessons.length; j++) {
                const lesson = topic.lessons[j];
                
                if (lesson.id) {
                  // Update existing lesson
                  const existingLesson = existingTopic.lessons.find(l => l.id === lesson.id);
                  
                  if (existingLesson) {
                    await prisma.lesson.update({
                      where: { id: lesson.id },
                      data: {
                        title: lesson.title,
                        description: lesson.description,
                        videoUrl: lesson.videoUrl,
                        content: lesson.content,
                        duration: lesson.duration,
                        orderIndex: j,
                        type: lesson.type
                      }
                    });
                    
                    // Update quiz if exists
                    if (lesson.type === 'quiz' && lesson.quiz) {
                      if (existingLesson.quiz) {
                        await prisma.quiz.update({
                          where: { id: existingLesson.quiz.id },
                          data: {
                            title: lesson.quiz.title,
                            description: lesson.quiz.description,
                            timeLimit: lesson.quiz.timeLimit
                          }
                        });
                        
                        // Handle questions update
                        // (this is simplified, you might want to handle this more carefully)
                        if (lesson.quiz.questions) {
                          // Delete existing questions
                          await prisma.question.deleteMany({
                            where: { quizId: existingLesson.quiz.id }
                          });
                          
                          // Create new questions
                          for (let k = 0; k < lesson.quiz.questions.length; k++) {
                            const question = lesson.quiz.questions[k];
                            
                            await prisma.question.create({
                              data: {
                                quizId: existingLesson.quiz.id,
                                questionText: question.questionText,
                                type: question.type,
                                options: question.options,
                                correctOptions: question.correctOptions,
                                orderIndex: k
                              }
                            });
                          }
                        }
                      } else {
                        // Create new quiz
                        const createdQuiz = await prisma.quiz.create({
                          data: {
                            lessonId: lesson.id,
                            title: lesson.quiz.title,
                            description: lesson.quiz.description,
                            timeLimit: lesson.quiz.timeLimit
                          }
                        });
                        
                        // Create questions
                        if (lesson.quiz.questions) {
                          for (let k = 0; k < lesson.quiz.questions.length; k++) {
                            const question = lesson.quiz.questions[k];
                            
                            await prisma.question.create({
                              data: {
                                quizId: createdQuiz.id,
                                questionText: question.questionText,
                                type: question.type,
                                options: question.options,
                                correctOptions: question.correctOptions,
                                orderIndex: k
                              }
                            });
                          }
                        }
                      }
                    } else if (existingLesson.quiz) {
                      // Delete existing quiz if lesson type changed
                      await prisma.question.deleteMany({
                        where: { quizId: existingLesson.quiz.id }
                      });
                      await prisma.quiz.delete({
                        where: { id: existingLesson.quiz.id }
                      });
                    }
                    
                    // Update assignment if exists
                    if (lesson.type === 'assignment' && lesson.assignment) {
                      if (existingLesson.assignment) {
                        await prisma.assignment.update({
                          where: { id: existingLesson.assignment.id },
                          data: {
                            title: lesson.assignment.title,
                            description: lesson.assignment.description,
                            dueDate: lesson.assignment.dueDate,
                            maxScore: lesson.assignment.maxScore,
                            allowFileUpload: lesson.assignment.allowFileUpload,
                            allowedFileTypes: lesson.assignment.allowedFileTypes,
                            unitTests: lesson.assignment.unitTests
                          }
                        });
                      } else {
                        // Create new assignment
                        await prisma.assignment.create({
                          data: {
                            lessonId: lesson.id,
                            title: lesson.assignment.title,
                            description: lesson.assignment.description,
                            dueDate: lesson.assignment.dueDate,
                            maxScore: lesson.assignment.maxScore || 100,
                            allowFileUpload: lesson.assignment.allowFileUpload !== false,
                            allowedFileTypes: lesson.assignment.allowedFileTypes || [],
                            unitTests: lesson.assignment.unitTests
                          }
                        });
                      }
                    } else if (existingLesson.assignment) {
                      // Delete existing assignment if lesson type changed
                      await prisma.assignment.delete({
                        where: { id: existingLesson.assignment.id }
                      });
                    }
                  }
                } else {
                  // Create new lesson
                  const createdLesson = await prisma.lesson.create({
                    data: {
                      topicId: existingTopic.id,
                      title: lesson.title,
                      description: lesson.description,
                      videoUrl: lesson.videoUrl,
                      content: lesson.content,
                      duration: lesson.duration || 0,
                      orderIndex: j,
                      type: lesson.type || 'lesson',
                      courseId: id
                    }
                  });
                  
                  // Create quiz if needed
                  if (lesson.type === 'quiz' && lesson.quiz) {
                    const createdQuiz = await prisma.quiz.create({
                      data: {
                        lessonId: createdLesson.id,
                        title: lesson.quiz.title,
                        description: lesson.quiz.description,
                        timeLimit: lesson.quiz.timeLimit
                      }
                    });
                    
                    // Create questions
                    if (lesson.quiz.questions) {
                      for (let k = 0; k < lesson.quiz.questions.length; k++) {
                        const question = lesson.quiz.questions[k];
                        
                        await prisma.question.create({
                          data: {
                            quizId: createdQuiz.id,
                            questionText: question.questionText,
                            type: question.type,
                            options: question.options,
                            correctOptions: question.correctOptions,
                            orderIndex: k
                          }
                        });
                      }
                    }
                  }
                  
                  // Create assignment if needed
                  if (lesson.type === 'assignment' && lesson.assignment) {
                    await prisma.assignment.create({
                      data: {
                        lessonId: createdLesson.id,
                        title: lesson.assignment.title,
                        description: lesson.assignment.description,
                        dueDate: lesson.assignment.dueDate,
                        maxScore: lesson.assignment.maxScore || 100,
                        allowFileUpload: lesson.assignment.allowFileUpload !== false,
                        allowedFileTypes: lesson.assignment.allowedFileTypes || [],
                        unitTests: lesson.assignment.unitTests
                      }
                    });
                  }
                }
              }
              
              // Delete lessons that are no longer in the list
              const lessonIdsToKeep = topic.lessons.map(l => l.id).filter(Boolean);
              const lessonsToDelete = existingTopic.lessons.filter(l => !lessonIdsToKeep.includes(l.id));
              
              for (const lessonToDelete of lessonsToDelete) {
                if (lessonToDelete.quiz) {
                  await prisma.question.deleteMany({
                    where: { quizId: lessonToDelete.quiz.id }
                  });
                  await prisma.quiz.delete({
                    where: { id: lessonToDelete.quiz.id }
                  });
                }
                
                if (lessonToDelete.assignment) {
                  await prisma.assignment.delete({
                    where: { id: lessonToDelete.assignment.id }
                  });
                }
                
                await prisma.lessonProgress.deleteMany({
                  where: { lessonId: lessonToDelete.id }
                });
                
                await prisma.lesson.delete({
                  where: { id: lessonToDelete.id }
                });
              }
            }
          }
        } else {
          // Create new topic
          const createdTopic = await prisma.topic.create({
            data: {
              courseId: id,
              title: topic.title,
              description: topic.description,
              orderIndex: i
            }
          });
          
          // Create lessons
          if (topic.lessons) {
            for (let j = 0; j < topic.lessons.length; j++) {
              const lesson = topic.lessons[j];
              
              const createdLesson = await prisma.lesson.create({
                data: {
                  topicId: createdTopic.id,
                  title: lesson.title,
                  description: lesson.description,
                  videoUrl: lesson.videoUrl,
                  content: lesson.content,
                  duration: lesson.duration || 0,
                  orderIndex: j,
                  type: lesson.type || 'lesson',
                  courseId: id
                }
              });
              
              // Create quiz if needed
              if (lesson.type === 'quiz' && lesson.quiz) {
                const createdQuiz = await prisma.quiz.create({
                  data: {
                    lessonId: createdLesson.id,
                    title: lesson.quiz.title,
                    description: lesson.quiz.description,
                    timeLimit: lesson.quiz.timeLimit
                  }
                });
                
                // Create questions
                if (lesson.quiz.questions) {
                  for (let k = 0; k < lesson.quiz.questions.length; k++) {
                    const question = lesson.quiz.questions[k];
                    
                    await prisma.question.create({
                      data: {
                        quizId: createdQuiz.id,
                        questionText: question.questionText,
                        type: question.type,
                        options: question.options,
                        correctOptions: question.correctOptions,
                        orderIndex: k
                      }
                    });
                  }
                }
              }
              
              // Create assignment if needed
              if (lesson.type === 'assignment' && lesson.assignment) {
                await prisma.assignment.create({
                  data: {
                    lessonId: createdLesson.id,
                    title: lesson.assignment.title,
                    description: lesson.assignment.description,
                    dueDate: lesson.assignment.dueDate,
                    maxScore: lesson.assignment.maxScore || 100,
                    allowFileUpload: lesson.assignment.allowFileUpload !== false,
                    allowedFileTypes: lesson.assignment.allowedFileTypes || [],
                    unitTests: lesson.assignment.unitTests
                  }
                });
              }
            }
          }
        }
      }
      
      // Delete topics that are no longer in the list
      const topicIdsToKeep = topics.map(t => t.id).filter(Boolean);
      const topicsToDelete = existingTopics.filter(t => !topicIdsToKeep.includes(t.id));
      
      for (const topicToDelete of topicsToDelete) {
        // Delete all lessons, quizzes, questions, assignments
        for (const lesson of topicToDelete.lessons) {
          if (lesson.quiz) {
            await prisma.question.deleteMany({
              where: { quizId: lesson.quiz.id }
            });
            await prisma.quiz.delete({
              where: { id: lesson.quiz.id }
            });
          }
          
          if (lesson.assignment) {
            await prisma.assignment.delete({
              where: { id: lesson.assignment.id }
            });
          }
          
          await prisma.lessonProgress.deleteMany({
            where: { lessonId: lesson.id }
          });
          
          await prisma.lesson.delete({
            where: { id: lesson.id }
          });
        }
        
        await prisma.topic.delete({
          where: { id: topicToDelete.id }
        });
      }
    }
    
    res.status(200).json({
      message: 'Course updated successfully',
      courseId: updatedCourse.id
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
};

// Delete a course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { id } = req.params;
    
    // Check if course exists and belongs to the user
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        topics: {
          include: {
            lessons: {
              include: {
                quiz: { include: { questions: true } },
                assignment: true
              }
            }
          }
        }
      }
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is authorized (teacher or admin)
    if (course.teacherId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    // Delete all related entities
    // This is a cascade delete operation
    
    // Delete enrollments
    await prisma.enrollment.deleteMany({
      where: { courseId: id }
    });
    
    // Delete reviews
    await prisma.courseReview.deleteMany({
      where: { courseId: id }
    });
    
    // Delete certificates
    await prisma.certificate.deleteMany({
      where: { courseId: id }
    });
    
    // Delete bundle courses
    await prisma.bundleCourse.deleteMany({
      where: { courseId: id }
    });
    
    // Delete topics and their children
    for (const topic of course.topics) {
      // Delete lessons and their children
      for (const lesson of topic.lessons) {
        // Delete quiz questions
        if (lesson.quiz) {
          await prisma.question.deleteMany({
            where: { quizId: lesson.quiz.id }
          });
          
          // Delete quiz attempts
          await prisma.quizAttempt.deleteMany({
            where: { quizId: lesson.quiz.id }
          });
          
          // Delete quiz
          await prisma.quiz.delete({
            where: { id: lesson.quiz.id }
          });
        }
        
        // Delete assignment submissions
        if (lesson.assignment) {
          await prisma.assignmentSubmission.deleteMany({
            where: { assignmentId: lesson.assignment.id }
          });
          
          // Delete assignment
          await prisma.assignment.delete({
            where: { id: lesson.assignment.id }
          });
        }
        
        // Delete lesson progress
        await prisma.lessonProgress.deleteMany({
          where: { lessonId: lesson.id }
        });
        
        // Delete calendar events
        await prisma.calendarEvent.deleteMany({
          where: { lessonId: lesson.id }
        });
        
        // Delete lesson
        await prisma.lesson.delete({
          where: { id: lesson.id }
        });
      }
      
      // Delete topic
      await prisma.topic.delete({
        where: { id: topic.id }
      });
    }
    
    // Finally, delete the course
    await prisma.course.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
};

// Get enrolled courses for the current user
export const getEnrolledCourses = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
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
    
    const courses = enrollments.map(enrollment => ({
      ...enrollment.course,
      enrolledAt: enrollment.enrolledAt,
      completed: enrollment.completed,
      completedAt: enrollment.completedAt
    }));
    
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Error fetching enrolled courses' });
  }
}; 