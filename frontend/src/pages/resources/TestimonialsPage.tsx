
import React from 'react';
import { StarIcon } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "Platforma BacExamen a fost esențială pentru succesul meu la Bacalaureat. Am obținut 9.80 la matematică datorită lecțiilor clare și exercițiilor numeroase. Recomand cu încredere!",
    author: "Maria Popescu",
    role: "Absolventă de liceu, promoția 2024",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    content: "Ca părinte, am apreciat foarte mult modul organizat în care sunt prezentate materialele. Fiul meu a devenit mult mai încrezător în forțele proprii și s-a pregătit metodic pentru examene.",
    author: "Andrei Mihai",
    role: "Părinte",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 3,
    content: "Profesorii de pe BacExamen explică totul pas cu pas, iar simulările de examen m-au ajutat să-mi gestionez emoțiile în ziua cea mare. Am luat 9.65 la română!",
    author: "Elena Ionescu",
    role: "Studentă la Facultatea de Litere",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 4,
    content: "Materialele de la informatică sunt extraordinare! Problemele sunt bine explicate, iar soluțiile sunt prezentate în detaliu. M-au ajutat să obțin 10 la BAC.",
    author: "Vlad Georgescu",
    role: "Student la Politehnica",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 5,
    content: "Eram panicată înainte de BAC, dar după ce am descoperit BacExamen, totul s-a schimbat. Lecțiile video și exercițiile interactive m-au ajutat enorm.",
    author: "Diana Teodorescu",
    role: "Absolventă de liceu, promoția 2023",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: 6,
    content: "Ca profesor, recomand BacExamen elevilor mei. Platforma oferă materiale de calitate și resurse variate pentru toate nivelurile de pregătire.",
    author: "Prof. Cristian Dumitrescu",
    role: "Profesor de matematică",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: 7,
    content: "M-am pregătit pentru BAC exclusiv cu BacExamen și am reușit să iau note peste 9 la toate materiile. Profesorii sunt excelenți!",
    author: "Alexandru Stanciu",
    role: "Student la ASE",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    id: 8,
    content: "Platforma este ușor de utilizat și conține toate informațiile necesare pentru Bacalaureat. Explicațiile sunt clare și concise.",
    author: "Andreea Popa",
    role: "Absolventă de liceu, promoția 2024",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/4.jpg"
  }
];

const renderStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <StarIcon 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill={i < rating ? 'currentColor' : 'none'} 
      />
    ));
};

const TestimonialsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-4">Testimoniale</h1>
        <p className="text-gray-600">
          Descoperă experiențele absolvenților care s-au pregătit pentru Bacalaureat cu ajutorul platformei noastre.
          Suntem mândri să contribuim la succesul elevilor din toată țara.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
          >
            <div className="flex mb-4">
              {renderStars(testimonial.rating)}
            </div>
            <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
            <div className="flex items-center">
              <img 
                src={testimonial.image} 
                alt={testimonial.author}
                className="h-12 w-12 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{testimonial.author}</h3>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-brand-50 rounded-xl p-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ai o poveste de succes?</h2>
          <p className="text-gray-600 mb-8">
            Dacă te-ai pregătit cu BacExamen și ai avut rezultate bune la Bacalaureat, 
            împărtășește experiența ta cu viitorii absolvenți!
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700"
          >
            Trimite testimonialul tău
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
