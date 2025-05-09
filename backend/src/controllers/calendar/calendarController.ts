import { Request, Response } from 'express';
import * as calendarService from './calendarService';

/**
 * Get current user's calendar events
 * GET /api/calendar/events
 */
export const getUserEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { startDate, endDate } = req.query;
    
    // Convert string dates to Date objects if provided
    const startDateTime = startDate ? new Date(startDate as string) : undefined;
    const endDateTime = endDate ? new Date(endDate as string) : undefined;
    
    const events = await calendarService.getUserEvents(
      userId, 
      startDateTime, 
      endDateTime
    );
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ message: 'Failed to fetch calendar events' });
  }
};

/**
 * Create calendar event
 * POST /api/calendar/events
 */
export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { 
      title, 
      description, 
      type, 
      startTime, 
      endTime,
      courseId,
      lessonId,
      teacherId,
      studentId,
      location
    } = req.body;
    
    // Validate required fields
    if (!title || !type || !startTime) {
      return res.status(400).json({ 
        message: 'Title, type, and startTime are required fields' 
      });
    }
    
    // Parse dates
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = endTime ? new Date(endTime) : undefined;
    
    const event = await calendarService.createEvent(userId, {
      title,
      description,
      type,
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      courseId,
      lessonId,
      teacherId,
      studentId,
      location
    });
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ message: 'Failed to create calendar event' });
  }
};

/**
 * Update calendar event
 * PUT /api/calendar/events/:id
 */
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { 
      title, 
      description, 
      type, 
      startTime, 
      endTime,
      courseId,
      lessonId,
      teacherId,
      studentId,
      location
    } = req.body;
    
    // Parse dates if provided
    let eventData: any = {
      title,
      description,
      type,
      courseId,
      lessonId,
      teacherId,
      studentId,
      location
    };
    
    if (startTime) {
      eventData.startTime = new Date(startTime);
    }
    
    if (endTime) {
      eventData.endTime = new Date(endTime);
    }
    
    const event = await calendarService.updateEvent(id, userId, eventData);
    
    res.status(200).json(event);
  } catch (error) {
    console.error(`Error updating calendar event ${req.params.id}:`, error);
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: 'Calendar event not found' });
      }
      if (error.message.includes('not belong to you')) {
        return res.status(403).json({ message: 'You can only update your own events' });
      }
    }
    
    res.status(500).json({ message: 'Failed to update calendar event' });
  }
};

/**
 * Delete calendar event
 * DELETE /api/calendar/events/:id
 */
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    await calendarService.deleteEvent(id, userId);
    
    res.status(200).json({ message: 'Calendar event deleted successfully' });
  } catch (error) {
    console.error(`Error deleting calendar event ${req.params.id}:`, error);
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: 'Calendar event not found' });
      }
      if (error.message.includes('not belong to you')) {
        return res.status(403).json({ message: 'You can only delete your own events' });
      }
    }
    
    res.status(500).json({ message: 'Failed to delete calendar event' });
  }
}; 