import { Request, Response } from 'express';
import { prisma } from '../index';

// Send a message in a tutoring request
export const sendTutoringMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { requestId } = req.params;
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Get the request to verify user can send messages
    const request = await prisma.tutoringRequest.findUnique({
      where: { id: requestId },
      include: {
        session: {
          select: { teacherId: true }
        }
      }
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Check if user is either the student or the teacher
    const isStudent = request.studentId === req.user.id;
    const isTeacher = request.session.teacherId === req.user.id;
    
    if (!isStudent && !isTeacher) {
      return res.status(403).json({ message: 'Not authorized to send messages in this request' });
    }
    
    // Create the message
    const tutoringMessage = await prisma.tutoringMessage.create({
      data: {
        requestId,
        senderId: req.user.id,
        message: message.trim(),
        read: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });
    
    res.status(201).json({
      message: 'Message sent successfully',
      tutoringMessage
    });
  } catch (error) {
    console.error('Error sending tutoring message:', error);
    res.status(500).json({ message: 'Error sending tutoring message' });
  }
};

// Get messages for a specific request
export const getRequestMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { requestId } = req.params;
    
    // Get the request to verify user can view messages
    const request = await prisma.tutoringRequest.findUnique({
      where: { id: requestId },
      include: {
        session: {
          select: { teacherId: true }
        }
      }
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Check if user is either the student or the teacher
    const isStudent = request.studentId === req.user.id;
    const isTeacher = request.session.teacherId === req.user.id;
    
    if (!isStudent && !isTeacher) {
      return res.status(403).json({ message: 'Not authorized to view messages in this request' });
    }
    
    // Get all messages for this request
    const messages = await prisma.tutoringMessage.findMany({
      where: { requestId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    
    // Mark messages as read for the current user
    await prisma.tutoringMessage.updateMany({
      where: {
        requestId,
        senderId: { not: req.user.id },
        read: false
      },
      data: { read: true }
    });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching request messages:', error);
    res.status(500).json({ message: 'Error fetching request messages' });
  }
};

// Get unread message count for user
export const getUnreadMessageCount = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // For students: count unread messages in their requests
    // For teachers: count unread messages in requests for their sessions
    let unreadCount = 0;
    
    if (req.user.role === 'student') {
      unreadCount = await prisma.tutoringMessage.count({
        where: {
          request: {
            studentId: req.user.id
          },
          senderId: { not: req.user.id },
          read: false
        }
      });
    } else if (req.user.role === 'teacher') {
      unreadCount = await prisma.tutoringMessage.count({
        where: {
          request: {
            session: {
              teacherId: req.user.id
            }
          },
          senderId: { not: req.user.id },
          read: false
        }
      });
    }
    
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread message count:', error);
    res.status(500).json({ message: 'Error fetching unread message count' });
  }
};

// Get conversations for current user
export const getMyConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    let conversations: any[] = [];
    
    if (req.user.role === 'student') {
      // Get requests where user is the student
      const requests = await prisma.tutoringRequest.findMany({
        where: { studentId: req.user.id },
        include: {
          session: {
            include: {
              teacher: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      
      conversations = requests.map(request => ({
        requestId: request.id,
        sessionId: request.sessionId,
        status: request.status,
        subject: request.session.subject,
        otherParty: request.session.teacher,
        lastMessage: request.messages[0] || null,
        unreadCount: 0 // Will be calculated below
      }));
      
    } else if (req.user.role === 'teacher') {
      // Get requests for user's sessions
      const requests = await prisma.tutoringRequest.findMany({
        where: {
          session: {
            teacherId: req.user.id
          }
        },
        include: {
          session: {
            select: {
              id: true,
              subject: true
            }
          },
          student: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      
      conversations = requests.map(request => ({
        requestId: request.id,
        sessionId: request.sessionId,
        status: request.status,
        subject: request.session.subject,
        otherParty: request.student,
        lastMessage: request.messages[0] || null,
        unreadCount: 0 // Will be calculated below
      }));
    }
    
    // Calculate unread counts for each conversation
    for (const conversation of conversations) {
      const unreadCount = await prisma.tutoringMessage.count({
        where: {
          requestId: conversation.requestId,
          senderId: { not: req.user.id },
          read: false
        }
      });
      conversation.unreadCount = unreadCount;
    }
    
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { requestId } = req.params;
    
    // Verify user has access to this request
    const request = await prisma.tutoringRequest.findUnique({
      where: { id: requestId },
      include: {
        session: {
          select: { teacherId: true }
        }
      }
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    const isStudent = request.studentId === req.user.id;
    const isTeacher = request.session.teacherId === req.user.id;
    
    if (!isStudent && !isTeacher) {
      return res.status(403).json({ message: 'Not authorized to mark messages as read' });
    }
    
    // Mark all messages from other party as read
    await prisma.tutoringMessage.updateMany({
      where: {
        requestId,
        senderId: { not: req.user.id },
        read: false
      },
      data: { read: true }
    });
    
    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
}; 