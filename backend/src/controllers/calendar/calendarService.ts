import { prisma } from '../../index';

/**
 * Get user's calendar events with optional date filters
 */
export const getUserEvents = async (
  userId: string, 
  startDate?: Date, 
  endDate?: Date
) => {
  const where: any = { userId };
  
  // Add date filters if provided
  if (startDate || endDate) {
    where.startTime = {};
    
    if (startDate) {
      where.startTime.gte = startDate;
    }
    
    if (endDate) {
      where.startTime.lte = endDate;
    }
  }
  
  return prisma.calendarEvent.findMany({
    where,
    include: {
      course: {
        select: {
          id: true,
          title: true,
          image: true
        }
      },
      lesson: {
        select: {
          id: true,
          title: true,
          type: true
        }
      },
      teacher: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      student: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    },
    orderBy: {
      startTime: 'asc'
    }
  });
};

/**
 * Create a new calendar event
 */
export const createEvent = async (
  userId: string,
  eventData: {
    title: string;
    description?: string;
    type: string;
    startTime: Date;
    endTime?: Date;
    courseId?: string;
    lessonId?: string;
    teacherId?: string;
    studentId?: string;
    location?: string;
  }
) => {
  return prisma.calendarEvent.create({
    data: {
      userId,
      title: eventData.title,
      description: eventData.description,
      type: eventData.type,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      courseId: eventData.courseId,
      lessonId: eventData.lessonId,
      teacherId: eventData.teacherId,
      studentId: eventData.studentId,
      location: eventData.location
    },
    include: {
      course: {
        select: {
          id: true,
          title: true
        }
      },
      lesson: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });
};

/**
 * Update a calendar event
 */
export const updateEvent = async (
  id: string,
  userId: string,
  eventData: {
    title?: string;
    description?: string;
    type?: string;
    startTime?: Date;
    endTime?: Date;
    courseId?: string;
    lessonId?: string;
    teacherId?: string;
    studentId?: string;
    location?: string;
  }
) => {
  // First check if event exists and belongs to user
  const event = await prisma.calendarEvent.findUnique({
    where: { id }
  });
  
  if (!event) {
    throw new Error('Calendar event not found');
  }
  
  if (event.userId !== userId) {
    throw new Error('Cannot update an event that does not belong to you');
  }
  
  return prisma.calendarEvent.update({
    where: { id },
    data: eventData,
    include: {
      course: {
        select: {
          id: true,
          title: true
        }
      },
      lesson: {
        select: {
          id: true, 
          title: true
        }
      }
    }
  });
};

/**
 * Delete a calendar event
 */
export const deleteEvent = async (id: string, userId: string) => {
  // First check if event exists and belongs to user
  const event = await prisma.calendarEvent.findUnique({
    where: { id }
  });
  
  if (!event) {
    throw new Error('Calendar event not found');
  }
  
  if (event.userId !== userId) {
    throw new Error('Cannot delete an event that does not belong to you');
  }
  
  return prisma.calendarEvent.delete({
    where: { id }
  });
}; 