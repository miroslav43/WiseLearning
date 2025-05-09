
import { Course, Subject, Topic, Lesson, Quiz, Assignment, Review, QuestionType } from '@/types/course';

// Mock courses data
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Informatică: Algoritmi și Structuri de Date',
    description: 'Un curs complet despre algoritmi și structuri de date pentru Bacalaureat la Informatică, cu multe exemple practice și exerciții.',
    subject: 'computer-science',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1928&auto=format&fit=crop',
    price: 199,
    pointsPrice: 2000,
    teacherId: '2',
    teacherName: 'Mihai Popescu',
    teacherAvatar: 'https://ui-avatars.com/api/?name=Mihai+Popescu&background=3f7e4e&color=fff',
    topics: getMockTopics(),
    students: 348,
    rating: 4.8,
    reviews: getMockReviews(),
    status: 'published',
    featured: true,
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-12-20')
  },
  {
    id: '2',
    title: 'Matematică: Analiză pentru Bacalaureat',
    description: 'Pregătește-te pentru Bacalaureat la Matematică cu acest curs complet de analiză matematică. Toate formulele și demonstrațiile explicate pas cu pas.',
    subject: 'mathematics',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop',
    price: 249,
    pointsPrice: 2500,
    teacherId: '3',
    teacherName: 'Elena Ionescu',
    teacherAvatar: 'https://ui-avatars.com/api/?name=Elena+Ionescu&background=3f7e4e&color=fff',
    topics: getMockTopics(),
    students: 512,
    rating: 4.9,
    reviews: getMockReviews(),
    status: 'published',
    featured: true,
    createdAt: new Date('2023-09-10'),
    updatedAt: new Date('2023-12-15')
  },
  {
    id: '3',
    title: 'Limba Română: Comentarii Literare',
    description: 'Învață să realizezi comentarii literare pentru toate operele din programa de Bacalaureat la Limba și Literatura Română.',
    subject: 'romanian',
    image: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=2071&auto=format&fit=crop',
    price: 179,
    pointsPrice: 1800,
    teacherId: '4',
    teacherName: 'Ana Dumitrescu',
    teacherAvatar: 'https://ui-avatars.com/api/?name=Ana+Dumitrescu&background=3f7e4e&color=fff',
    topics: getMockTopics(),
    students: 423,
    rating: 4.7,
    reviews: getMockReviews(),
    status: 'published',
    featured: true,
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2023-11-30')
  },
  {
    id: '4',
    title: 'Istorie: România în Epoca Modernă',
    description: 'Un curs complet despre istoria României în epoca modernă, cu focus pe subiectele importante pentru Bacalaureat.',
    subject: 'history',
    image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=2074&auto=format&fit=crop',
    price: 149,
    pointsPrice: 1500,
    teacherId: '5',
    teacherName: 'Ion Marinescu',
    teacherAvatar: 'https://ui-avatars.com/api/?name=Ion+Marinescu&background=3f7e4e&color=fff',
    topics: getMockTopics(),
    students: 286,
    rating: 4.6,
    reviews: getMockReviews(),
    status: 'published',
    featured: false,
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2023-11-25')
  },
  {
    id: '5',
    title: 'Biologie: Anatomie și Genetică',
    description: 'Învață tot ce trebuie să știi despre anatomie și genetică pentru a lua o notă mare la Bacalaureatul de Biologie.',
    subject: 'biology',
    image: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?q=80&w=2070&auto=format&fit=crop',
    price: 189,
    pointsPrice: 1900,
    teacherId: '6',
    teacherName: 'Maria Constantinescu',
    teacherAvatar: 'https://ui-avatars.com/api/?name=Maria+Constantinescu&background=3f7e4e&color=fff',
    topics: getMockTopics(),
    students: 342,
    rating: 4.8,
    reviews: getMockReviews(),
    status: 'published',
    featured: false,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-12-10')
  },
  {
    id: '6',
    title: 'Geografie: România și Europa',
    description: 'Explorează geografia României și a Europei cu acest curs complet care te pregătește pentru proba de Bacalaureat la Geografie.',
    subject: 'geography',
    image: 'https://images.unsplash.com/photo-1519500099198-fd81846bc57f?q=80&w=2070&auto=format&fit=crop',
    price: 159,
    pointsPrice: 1600,
    teacherId: '7',
    teacherName: 'Andrei Georgescu',
    teacherAvatar: 'https://ui-avatars.com/api/?name=Andrei+Georgescu&background=3f7e4e&color=fff',
    topics: getMockTopics(),
    students: 215,
    rating: 4.5,
    reviews: getMockReviews(),
    status: 'published',
    featured: false,
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-11-20')
  }
];

// Helper functions to generate mock data
function getMockTopics(): Topic[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `m${i + 1}`,
    title: `Modulul ${i + 1}: ${getRandomTitle()}`,
    description: 'În acest modul vei învăța conceptele fundamentale și vei rezolva exerciții practice.',
    lessons: getMockLessons(i + 1),
    order: i + 1
  }));
}

function getMockLessons(moduleIndex: number): Lesson[] {
  return Array.from({ length: 4 }, (_, i) => {
    // Determine the lesson type based on index
    const lessonTypes: ('lesson' | 'quiz' | 'assignment')[] = ['lesson', 'quiz', 'assignment'];
    const type = lessonTypes[i % lessonTypes.length];
    
    return {
      id: `l${moduleIndex}-${i + 1}`,
      title: `Lecția ${i + 1}: ${getRandomTitle()}`,
      description: 'În această lecție vei învăța concepte importante și vei vedea exemple practice.',
      videoUrl: type === 'lesson' ? `https://example.com/video${moduleIndex}-${i + 1}` : undefined,
      content: 'Conținutul detaliat al lecției va fi disponibil după achiziționarea cursului.',
      duration: 25 + Math.floor(Math.random() * 20),
      quiz: type === 'quiz' ? getMockQuiz(moduleIndex, i) : undefined,
      assignment: type === 'assignment' ? getMockAssignment(moduleIndex, i) : undefined,
      order: i + 1,
      type: type
    };
  });
}

function getMockQuiz(moduleIndex: number, lessonIndex: number): Quiz {
  return {
    id: `q${moduleIndex}-${lessonIndex}`,
    title: 'Test de verificare a cunoștințelor',
    description: 'Acest test te va ajuta să verifici cât de bine ai înțeles conceptele din această lecție.',
    questions: Array.from({ length: 5 }, (_, i) => ({
      id: `q${moduleIndex}-${lessonIndex}-${i}`,
      questionText: `Întrebarea ${i + 1}?`,
      type: 'single' as QuestionType, 
      options: [
        `Opțiunea A pentru întrebarea ${i + 1}`,
        `Opțiunea B pentru întrebarea ${i + 1}`,
        `Opțiunea C pentru întrebarea ${i + 1}`,
        `Opțiunea D pentru întrebarea ${i + 1}`
      ],
      correctOptions: [Math.floor(Math.random() * 4)],
      order: i + 1
    })),
    timeLimit: 10
  };
}

function getMockAssignment(moduleIndex: number, lessonIndex: number): Assignment {
  return {
    id: `a${moduleIndex}-${lessonIndex}`,
    title: 'Temă pentru acasă',
    description: 'Rezolvă aceste exerciții pentru a-ți consolida cunoștințele dobândite în această lecție.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    maxScore: 100,
    allowFileUpload: true,
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.zip']
  };
}

function getMockReviews(): Review[] {
  const reviewTexts = [
    'Un curs excelent! Am învățat foarte multe și am reușit să iau o notă mare la Bacalaureat.',
    'Profesorul explică foarte clar și materialele sunt bine structurate. Recomand!',
    'M-a ajutat enorm să înțeleg conceptele dificile. Merită toți banii!',
    'Unul dintre cele mai bune cursuri pe care le-am urmat. Exercițiile sunt foarte utile pentru pregătirea examenului.',
    'Materiale de calitate și explicații pe înțelesul tuturor. Sunt foarte mulțumit de achiziție.'
  ];
  
  const names = [
    'Alexandru Ionescu',
    'Maria Popescu',
    'Andrei Dumitrescu',
    'Elena Radu',
    'Mihai Constantin',
    'Ioana Gheorghe',
    'George Vasile'
  ];
  
  return Array.from({ length: 4 + Math.floor(Math.random() * 6) }, (_, i) => ({
    id: `r${i}`,
    userId: `u${i}`,
    userName: names[Math.floor(Math.random() * names.length)],
    userAvatar: `https://ui-avatars.com/api/?name=${names[Math.floor(Math.random() * names.length)].replace(' ', '+')}&background=3f7e4e&color=fff`,
    courseId: `${Math.floor(Math.random() * 6) + 1}`, // Added the missing required property
    rating: 4 + Math.floor(Math.random() * 2),
    comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
  }));
}

function getRandomTitle(): string {
  const titles = [
    'Concepte Fundamentale',
    'Aplicații Practice',
    'Studiu de Caz',
    'Recapitulare',
    'Exerciții Rezolvate',
    'Probleme Avansate',
    'Tehnici de Rezolvare',
    'Sinteze',
    'Modele de Subiecte',
    'Analiză Aprofundată'
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
}
