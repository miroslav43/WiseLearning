
import { v4 as uuidv4 } from 'uuid';
import { 
  TutoringSession, 
  TutoringRequest, 
  TutoringMessage 
} from '@/types/tutoring';

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Sample tutoring sessions
export const mockTutoringSessions: TutoringSession[] = [
  {
    id: uuidv4(),
    teacherId: 'teacher1',
    teacherName: 'Prof. Ionescu Maria',
    teacherAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
    subject: 'Matematică - Pregătire Bacalaureat',
    description: 'Sesiuni intensive pentru pregătirea examenului de bacalaureat la matematică. Focus pe subiecte tip 1 și 2. Exerciții și simulări de examen.',
    availability: [
      { dayOfWeek: 1, startTime: '15:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '16:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '14:00', endTime: '16:00' }
    ],
    locationType: 'online',
    pricePerHour: 80,
    status: 'approved',
    createdAt: generateRandomDate(new Date('2025-04-01'), new Date('2025-04-30')),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    teacherId: 'teacher2',
    teacherName: 'Prof. Popescu Alexandru',
    teacherAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
    subject: 'Informatică - Algoritmi și Structuri de Date',
    description: 'Meditații pentru aprofundarea conceptelor de algoritmi și structuri de date. Ideal pentru elevii care doresc să participe la olimpiade sau concursuri de informatică.',
    availability: [
      { dayOfWeek: 2, startTime: '16:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '17:00', endTime: '19:00' }
    ],
    locationType: 'both',
    pricePerHour: 100,
    status: 'approved',
    createdAt: generateRandomDate(new Date('2025-04-01'), new Date('2025-04-30')),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    teacherId: 'teacher3',
    teacherName: 'Prof. Dumitrescu Elena',
    teacherAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
    subject: 'Limba Română - Analiză Literară',
    description: 'Focus pe analiza operelor literare din programa pentru bacalaureat. Tehnici de redactare a eseurilor și comentariilor literare.',
    availability: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '15:00', endTime: '17:00' },
    ],
    locationType: 'online',
    pricePerHour: 75,
    status: 'approved',
    createdAt: generateRandomDate(new Date('2025-04-01'), new Date('2025-04-30')),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    teacherId: 'teacher4',
    teacherName: 'Prof. Georgescu Mihai',
    teacherAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
    subject: 'Fizică - Mecanică și Termodinamică',
    description: 'Explicații aprofundate pentru conceptele de mecanică și termodinamică. Rezolvare de probleme complexe și pregătire pentru examene.',
    availability: [
      { dayOfWeek: 2, startTime: '15:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '16:00', endTime: '18:00' },
    ],
    locationType: 'offline',
    pricePerHour: 90,
    status: 'pending',
    createdAt: generateRandomDate(new Date('2025-04-01'), new Date('2025-04-30')),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    teacherId: 'teacher5',
    teacherName: 'Prof. Stanciu Ana',
    teacherAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
    subject: 'Chimie Organică',
    description: 'Meditații pentru chimie organică, cu focus pe reacții și mecanisme. Ideal pentru pregătirea examenului de bacalaureat sau admitere la facultate.',
    availability: [
      { dayOfWeek: 3, startTime: '14:00', endTime: '16:00' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '12:00' },
    ],
    locationType: 'both',
    pricePerHour: 85,
    status: 'approved',
    createdAt: generateRandomDate(new Date('2025-04-01'), new Date('2025-04-30')),
    updatedAt: new Date()
  }
];

// Sample tutoring requests
export const mockTutoringRequests: TutoringRequest[] = [
  {
    id: uuidv4(),
    sessionId: mockTutoringSessions[0].id,
    studentId: 'student1',
    studentName: 'Radu Alexandra',
    studentAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
    message: 'Aș dori să programez câteva sesiuni pentru a mă pregăti pentru bacalaureat. Sunt disponibilă lunea și miercurea după-amiază.',
    preferredDates: [
      new Date('2025-05-10T15:00:00'),
      new Date('2025-05-12T16:00:00')
    ],
    status: 'accepted',
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-05-02')
  },
  {
    id: uuidv4(),
    sessionId: mockTutoringSessions[1].id,
    studentId: 'student2',
    studentName: 'Popa Andrei',
    studentAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
    message: 'Sunt interesat de meditații pentru olimpiada de informatică. Aș dori să discutăm despre programul și tematica abordată.',
    preferredDates: [
      new Date('2025-05-11T17:00:00')
    ],
    status: 'pending',
    createdAt: new Date('2025-05-03'),
    updatedAt: new Date('2025-05-03')
  },
  {
    id: uuidv4(),
    sessionId: mockTutoringSessions[2].id,
    studentId: 'student3',
    studentName: 'Diaconu Maria',
    studentAvatar: '/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png',
    message: 'Aș dori ajutor pentru analiza romanului "Ion" de Liviu Rebreanu. Sunt disponibilă joia, conform programului dumneavoastră.',
    preferredDates: [
      new Date('2025-05-13T15:00:00')
    ],
    status: 'rejected',
    createdAt: new Date('2025-05-02'),
    updatedAt: new Date('2025-05-04')
  }
];

// Sample tutoring messages
export const mockTutoringMessages: TutoringMessage[] = [
  {
    id: uuidv4(),
    requestId: mockTutoringRequests[0].id,
    senderId: mockTutoringRequests[0].studentId,
    senderName: mockTutoringRequests[0].studentName,
    senderRole: 'student',
    message: 'Bună ziua! Aș dori să programez câteva sesiuni pentru pregătirea la matematică.',
    read: true,
    createdAt: new Date('2025-05-01T10:00:00')
  },
  {
    id: uuidv4(),
    requestId: mockTutoringRequests[0].id,
    senderId: mockTutoringSessions[0].teacherId,
    senderName: mockTutoringSessions[0].teacherName,
    senderRole: 'teacher',
    message: 'Bună! Sigur, putem începe săptămâna viitoare. Ce zici de luni la 15:00?',
    read: true,
    createdAt: new Date('2025-05-01T10:30:00')
  },
  {
    id: uuidv4(),
    requestId: mockTutoringRequests[0].id,
    senderId: mockTutoringRequests[0].studentId,
    senderName: mockTutoringRequests[0].studentName,
    senderRole: 'student',
    message: 'Perfect, luni la 15:00 este ideal pentru mine.',
    read: true,
    createdAt: new Date('2025-05-01T11:00:00')
  },
  {
    id: uuidv4(),
    requestId: mockTutoringRequests[0].id,
    senderId: mockTutoringSessions[0].teacherId,
    senderName: mockTutoringSessions[0].teacherName,
    senderRole: 'teacher',
    message: 'Excelent! Voi trimite un link pentru sesiunea online cu 10 minute înainte de începere.',
    read: false,
    createdAt: new Date('2025-05-01T11:15:00')
  }
];
