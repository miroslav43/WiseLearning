
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Book, Star, GraduationCap } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <section className="py-12 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Despre BacExamen</h1>
          <p className="text-xl text-gray-600 mb-8">
            Transformăm modul în care elevii se pregătesc pentru examenul de Bacalaureat în România
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Misiunea noastră</h2>
            <p className="text-gray-700 mb-4">
              La BacExamen, credem că accesul la educație de calitate ar trebui să fie un drept, nu un privilegiu. De aceea, am construit o platformă educațională completă, accesibilă tuturor elevilor din România.
            </p>
            <p className="text-gray-700 mb-4">
              Misiunea noastră este să oferim resurse educaționale de cea mai înaltă calitate, care să-i ajute pe elevi să obțină rezultate excelente la examenul de Bacalaureat și să-și construiască un viitor academic solid.
            </p>
            <p className="text-gray-700">
              Colaborăm direct cu profesori excepționali din întreaga țară pentru a crea conținut educațional premium, adaptat la cerințele examenului național.
            </p>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
              alt="Elevi care învață împreună" 
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-brand-600 text-white rounded-lg px-6 py-4 shadow-lg">
              <p className="font-bold">Peste 15,000 de elevi ne folosesc deja</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats */}
      <section className="py-12 bg-gray-50 rounded-xl mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">BacExamen în cifre</h2>
          <p className="text-gray-600 mt-2">Impactul nostru în educația din România</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-brand-600 text-4xl font-bold mb-2">15,000+</div>
            <div className="text-gray-600">Elevi înscriși</div>
          </div>
          <div className="text-center">
            <div className="text-brand-600 text-4xl font-bold mb-2">120+</div>
            <div className="text-gray-600">Cursuri disponibile</div>
          </div>
          <div className="text-center">
            <div className="text-brand-600 text-4xl font-bold mb-2">98%</div>
            <div className="text-gray-600">Rată de promovare</div>
          </div>
          <div className="text-center">
            <div className="text-brand-600 text-4xl font-bold mb-2">4.8/5</div>
            <div className="text-gray-600">Rating mediu</div>
          </div>
        </div>
      </section>
      
      {/* Values */}
      <section className="py-12 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Valorile noastre</h2>
          <p className="text-gray-600 mt-2">Principiile care ne ghidează activitatea</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Educație accesibilă</h3>
            <p className="text-gray-600">
              Ne asigurăm că toți elevii au acces la educație de calitate, indiferent de locația geografică sau situația financiară.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Excelență academică</h3>
            <p className="text-gray-600">
              Colaborăm doar cu cei mai buni profesori și dezvoltăm conținut educațional verificat și de cea mai înaltă calitate.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Rezultate dovedite</h3>
            <p className="text-gray-600">
              Ne mândrim cu rata de succes de 98% la Bacalaureat a elevilor care folosesc platforma noastră pentru pregătire.
            </p>
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="py-12 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Echipa noastră</h2>
          <p className="text-gray-600 mt-2">Experți în educație și tehnologie</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              name: "Alexandru Popescu",
              role: "Fondator & CEO",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            },
            {
              name: "Maria Ionescu",
              role: "Director Educațional",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            },
            {
              name: "Andrei Dumitrescu",
              role: "CTO",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            },
            {
              name: "Elena Stanciu",
              role: "Director Marketing",
              image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            }
          ].map((member, index) => (
            <div key={index} className="text-center">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-40 h-40 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-brand-600 text-white rounded-xl">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Alătură-te comunității BacExamen</h2>
          <p className="text-xl mb-8 opacity-90">
            Fie că ești elev, profesor sau părinte, suntem aici pentru a te ajuta să atingi excelența academică.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explorează cursuri
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 w-full sm:w-auto">
                Contactează-ne
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
