
import { SubscriptionPlan, CourseBundle, UserSubscription, UserBundle } from '@/types/subscription';

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic-monthly',
    name: 'Acces de bază',
    description: 'Acces la cursuri esențiale pentru bacalaureat',
    price: 49,
    period: 'monthly',
    featuredBenefit: 'Acces la 5 cursuri populare',
    benefits: [
      'Acces la 5 cursuri esențiale',
      'Teste și exerciții nelimitate',
      'Materiale de studiu descărcabile',
      'Suport prin email'
    ]
  },
  {
    id: 'premium-monthly',
    name: 'Acces complet',
    description: 'Acces nelimitat la toate materialele',
    price: 89,
    period: 'monthly',
    featuredBenefit: 'Acces la toate cursurile și materialele',
    benefits: [
      'Acces nelimitat la toate cursurile',
      'Teste și exerciții nelimitate',
      'Materiale de studiu descărcabile',
      'Suport prioritar',
      '2 ore de meditație lunare incluse'
    ],
    isPopular: true
  },
  {
    id: 'basic-annual',
    name: 'Acces de bază anual',
    description: 'Acces la cursuri esențiale pentru bacalaureat',
    price: 490,
    period: 'annual',
    featuredBenefit: 'Acces la 5 cursuri populare',
    benefits: [
      'Acces la 5 cursuri esențiale',
      'Teste și exerciții nelimitate',
      'Materiale de studiu descărcabile',
      'Suport prin email',
      'Economisești 15% față de abonamentul lunar'
    ]
  },
  {
    id: 'premium-annual',
    name: 'Acces complet anual',
    description: 'Acces nelimitat la toate materialele',
    price: 890,
    period: 'annual',
    featuredBenefit: 'Acces la toate cursurile și materialele',
    benefits: [
      'Acces nelimitat la toate cursurile',
      'Teste și exerciții nelimitate',
      'Materiale de studiu descărcabile',
      'Suport prioritar',
      '24 ore de meditație anuale incluse',
      'Economisești 15% față de abonamentul lunar'
    ],
    isPopular: true
  }
];

export const mockCourseBundles: CourseBundle[] = [
  {
    id: 'bac-full-access',
    name: 'BAC Full Access',
    description: 'Toate cursurile necesare pentru bacalaureat',
    price: 599,
    originalPrice: 799,
    discount: 25,
    courses: ['course-1', 'course-2', 'course-3', 'course-4', 'course-5'],
    featuredBenefit: 'Acces permanent la toate cursurile pentru bacalaureat',
    benefits: [
      'Toate materiile obligatorii pentru bacalaureat',
      'Acces permanent la toate actualizările',
      'Certificate de absolvire pentru fiecare curs',
      'Materiale de studiu descărcabile',
      'Suport prioritar'
    ],
    imageUrl: 'https://placehold.co/600x400/3f7e4e/FFF?text=BAC+Full+Access'
  },
  {
    id: 'math-physics-combo',
    name: 'Matematică + Fizică',
    description: 'Pachet complet pentru știintele exacte',
    price: 299,
    originalPrice: 399,
    discount: 25,
    courses: ['course-1', 'course-5'],
    featuredBenefit: 'Acces permanent la cursurile de matematică și fizică',
    benefits: [
      'Cursuri complete de matematică și fizică',
      'Exerciții rezolvate pentru bacalaureat',
      'Formule și concepte esențiale',
      'Materiale de studiu descărcabile',
      'Acces la simulări de examen'
    ],
    imageUrl: 'https://placehold.co/600x400/3f7e4e/FFF?text=Mate+Fizica'
  },
  {
    id: 'literature-history-combo',
    name: 'Română + Istorie',
    description: 'Pachet complet pentru disciplinele umaniste',
    price: 299,
    originalPrice: 399,
    discount: 25,
    courses: ['course-2', 'course-3'],
    featuredBenefit: 'Acces permanent la cursurile de română și istorie',
    benefits: [
      'Analize literare complete',
      'Comentarii pentru operele din programa de bacalaureat',
      'Cronologie istorică detaliată',
      'Materiale de studiu descărcabile',
      'Acces la simulări de examen'
    ],
    imageUrl: 'https://placehold.co/600x400/3f7e4e/FFF?text=Romana+Istorie'
  }
];

export const mockUserSubscriptions: UserSubscription[] = [
  {
    id: 'subscription-1',
    userId: 'user-1',
    planId: 'premium-monthly',
    startDate: new Date('2025-04-01'),
    endDate: new Date('2025-05-01'),
    isActive: true,
    autoRenew: true,
    paymentMethod: 'card',
    lastPaymentDate: new Date('2025-04-01')
  }
];

export const mockUserBundles: UserBundle[] = [
  {
    id: 'user-bundle-1',
    userId: 'user-1',
    bundleId: 'math-physics-combo',
    purchaseDate: new Date('2025-03-15')
  }
];
