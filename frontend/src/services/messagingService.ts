
import { v4 as uuidv4 } from 'uuid';
import { 
  Message, 
  Conversation, 
  Contact, 
  AllowedContact,
  Attachment 
} from '@/types/messaging';
import { UserRole } from '@/types/user';

// Mock data for messages
const mockMessages: Message[] = [];
const mockConversations: Conversation[] = [];

// Get contacts based on user role
export const getContactsByRole = (userId: string, userRole: UserRole): Contact[] => {
  // In a real application, this would fetch contacts from a database
  // For now, we'll return mock data based on role
  
  // Sample contacts
  const mockContacts: Contact[] = [
    {
      id: 'teacher1',
      name: 'Prof. Ionescu Maria',
      avatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      role: 'teacher',
      lastMessage: 'Bună ziua! Cum pot să te ajut astăzi?',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      unreadCount: 2
    },
    {
      id: 'teacher2',
      name: 'Prof. Popescu Alexandru',
      avatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      role: 'teacher',
      lastMessage: 'Tema pentru săptămâna viitoare a fost postată.',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unreadCount: 0
    },
    {
      id: 'student1',
      name: 'Radu Alexandra',
      avatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      role: 'student',
      lastMessage: 'Mulțumesc pentru explicații!',
      lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      unreadCount: 0
    },
    {
      id: 'student2',
      name: 'Popa Andrei',
      avatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      role: 'student',
      lastMessage: 'Am trimis proiectul pe email.',
      lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      unreadCount: 0
    },
    {
      id: 'admin1',
      name: 'Admin Demo',
      avatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      role: 'admin',
      lastMessage: 'Vă rugăm să actualizați materialele de curs.',
      lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      unreadCount: 1
    }
  ];
  
  // Filter contacts based on user role
  let filteredContacts: Contact[] = [];
  
  switch (userRole) {
    case 'student':
      // Students can only message teachers
      filteredContacts = mockContacts.filter(contact => contact.role === 'teacher');
      break;
    case 'teacher':
      // Teachers can message students and admins
      filteredContacts = mockContacts.filter(contact => 
        contact.role === 'student' || contact.role === 'admin'
      );
      break;
    case 'admin':
      // Admins can message teachers
      filteredContacts = mockContacts.filter(contact => contact.role === 'teacher');
      break;
    default:
      filteredContacts = [];
  }
  
  return filteredContacts;
};

// Check if a user can message another user based on roles
export const canMessageUser = (senderRole: UserRole, receiverRole: UserRole): boolean => {
  if (senderRole === 'student' && receiverRole === 'teacher') return true;
  if (senderRole === 'teacher' && (receiverRole === 'student' || receiverRole === 'admin')) return true;
  if (senderRole === 'admin' && receiverRole === 'teacher') return true;
  return false;
};

// Get allowed contacts for search
export const getAllowedContacts = (userRole: UserRole): AllowedContact[] => {
  // In a real application, this would fetch all potential contacts from a database
  // For now, we'll return mock data based on role
  
  const mockAllowedContacts: AllowedContact[] = [
    {
      userId: 'teacher1',
      userName: 'Prof. Ionescu Maria',
      userAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      userRole: 'teacher'
    },
    {
      userId: 'teacher2',
      userName: 'Prof. Popescu Alexandru',
      userAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      userRole: 'teacher'
    },
    {
      userId: 'teacher3',
      userName: 'Prof. Dumitrescu Elena',
      userAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      userRole: 'teacher'
    },
    {
      userId: 'student1',
      userName: 'Radu Alexandra',
      userAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      userRole: 'student'
    },
    {
      userId: 'student2',
      userName: 'Popa Andrei',
      userAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      userRole: 'student'
    },
    {
      userId: 'admin1',
      userName: 'Admin Demo',
      userAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
      userRole: 'admin'
    }
  ];
  
  // Filter contacts based on user role
  let filteredContacts: AllowedContact[] = [];
  
  switch (userRole) {
    case 'student':
      // Students can only message teachers
      filteredContacts = mockAllowedContacts.filter(contact => contact.userRole === 'teacher');
      break;
    case 'teacher':
      // Teachers can message students and admins
      filteredContacts = mockAllowedContacts.filter(contact => 
        contact.userRole === 'student' || contact.userRole === 'admin'
      );
      break;
    case 'admin':
      // Admins can message teachers
      filteredContacts = mockAllowedContacts.filter(contact => contact.userRole === 'teacher');
      break;
    default:
      filteredContacts = [];
  }
  
  return filteredContacts;
};

// Get conversation between two users
export const getOrCreateConversation = (user1Id: string, user2Id: string): Conversation => {
  // Check if conversation already exists
  const existingConversation = mockConversations.find(conv => 
    conv.participants.includes(user1Id) && conv.participants.includes(user2Id)
  );
  
  if (existingConversation) {
    return existingConversation;
  }
  
  // Create new conversation if it doesn't exist
  const newConversation: Conversation = {
    id: uuidv4(),
    participants: [user1Id, user2Id],
    unreadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockConversations.push(newConversation);
  return newConversation;
};

// Get messages for a conversation
export const getConversationMessages = (conversationId: string): Message[] => {
  // In a real application, this would fetch messages from a database
  // For now, we'll return mock messages for the given conversation

  // Initialize with some mock messages if none exist
  if (mockMessages.length === 0) {
    const conversation = mockConversations.find(conv => conv.id === conversationId);
    if (conversation && conversation.participants.length === 2) {
      const [user1, user2] = conversation.participants;
      
      mockMessages.push({
        id: uuidv4(),
        senderId: user1,
        receiverId: user2,
        content: "Bună ziua! Am o întrebare legată de cursul dvs.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true
      });
      
      mockMessages.push({
        id: uuidv4(),
        senderId: user2,
        receiverId: user1,
        content: "Bună! Desigur, cum te pot ajuta?",
        timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000), // 1.8 hours ago
        read: true
      });
      
      mockMessages.push({
        id: uuidv4(),
        senderId: user1,
        receiverId: user2,
        content: "Aș dori să știu când va fi următorul test.",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        read: true
      });
      
      mockMessages.push({
        id: uuidv4(),
        senderId: user2,
        receiverId: user1,
        content: "Următorul test va fi pe data de 15 mai. Avem și o sesiune de recapitulare pe 12 mai.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        read: false
      });
    }
  }
  
  return mockMessages
    .filter(message => {
      const conversation = mockConversations.find(conv => conv.id === conversationId);
      if (!conversation) return false;
      
      return conversation.participants.includes(message.senderId) && 
             conversation.participants.includes(message.receiverId);
    })
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Send a new message
export const sendMessage = (
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string,
  attachments: Attachment[] = []
): Message => {
  const newMessage: Message = {
    id: uuidv4(),
    senderId,
    receiverId,
    content,
    timestamp: new Date(),
    read: false,
    attachments
  };
  
  mockMessages.push(newMessage);
  
  // Update conversation's last message and timestamp
  const conversation = mockConversations.find(conv => conv.id === conversationId);
  if (conversation) {
    conversation.lastMessage = newMessage;
    conversation.updatedAt = new Date();
    conversation.unreadCount += 1;
  }
  
  return newMessage;
};

// Mark messages as read
export const markMessagesAsRead = (conversationId: string, userId: string): void => {
  const conversation = mockConversations.find(conv => conv.id === conversationId);
  if (!conversation) return;
  
  mockMessages.forEach(message => {
    if (message.receiverId === userId && !message.read) {
      message.read = true;
    }
  });
  
  // Reset unread count for this conversation
  conversation.unreadCount = 0;
};

// Create a new conversation with an initial message for tutoring
export const createTutoringConversation = (
  studentId: string,
  teacherId: string,
  studentName: string,
  subject: string
): Conversation => {
  // Create or get existing conversation
  const conversation = getOrCreateConversation(studentId, teacherId);
  
  // Send initial message
  const initialMessage = `Bună ziua! Sunt ${studentName} și sunt interesat/ă de sesiunile de meditații pentru ${subject}. Aș dori să aflu mai multe detalii și să programez o sesiune. Mulțumesc!`;
  
  sendMessage(conversation.id, studentId, teacherId, initialMessage);
  
  return conversation;
};
