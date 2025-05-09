
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, Users, BookOpen, Heart, MapPin, Clock, CalendarDays, Award } from 'lucide-react';

const CareersPage: React.FC = () => {
  const openPositions = [
    {
      title: "Profesor de Matematică",
      department: "Departamentul Educațional",
      location: "Remote / București",
      type: "Full-time / Part-time",
      description: "Căutăm un profesor pasionat de matematică pentru a crea materiale educaționale de calitate și a susține sesiuni live cu elevii care se pregătesc pentru Bacalaureat."
    },
    {
      title: "Specialist Conținut Educațional",
      department: "Departamentul de Conținut",
      location: "București",
      type: "Full-time",
      description: "Vei fi responsabil pentru dezvoltarea și actualizarea materialelor educaționale pentru toate materiile, asigurând alinierea la programa școlară și la cerințele examenului de Bacalaureat."
    },
    {
      title: "Dezvoltator Web Frontend",
      department: "Departamentul IT",
      location: "Remote / București",
      type: "Full-time",
      description: "Vei contribui la dezvoltarea și îmbunătățirea platformei noastre educaționale, concentrându-te pe experiența utilizatorului și pe funcționalități interactive."
    },
    {
      title: "Specialist Marketing Digital",
      department: "Departamentul Marketing",
      location: "București",
      type: "Full-time",
      description: "Vei coordona campaniile de marketing digital pentru a crește vizibilitatea platformei și pentru a atrage noi utilizatori prin strategii inovative."
    },
    {
      title: "Asistent Suport Clienți",
      department: "Departamentul Suport",
      location: "Remote / București",
      type: "Part-time",
      description: "Vei oferi asistență utilizatorilor platformei, răspunzând la întrebări și ajutându-i să folosească eficient resursele disponibile."
    }
  ];

  const benefits = [
    {
      icon: <Clock className="h-10 w-10 text-brand-600" />,
      title: "Program flexibil",
      description: "Îți oferim flexibilitate pentru a-ți organiza timpul de lucru într-un mod care să se potrivească stilului tău de viață."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-brand-600" />,
      title: "Oportunități de învățare",
      description: "Susținem dezvoltarea profesională continuă prin acces la resurse educaționale și traininguri specializate."
    },
    {
      icon: <Users className="h-10 w-10 text-brand-600" />,
      title: "Echipă dinamică",
      description: "Te vei alătura unei echipe diverse și pasionate, dedicată transformării educației în România."
    },
    {
      icon: <Award className="h-10 w-10 text-brand-600" />,
      title: "Recunoașterea performanței",
      description: "Apreciem și recompensăm excelența prin scheme de bonusuri și programe de recunoaștere."
    },
    {
      icon: <Heart className="h-10 w-10 text-brand-600" />,
      title: "Pachet de beneficii",
      description: "Oferim un pachet competitiv care include asigurare medicală privată și alte beneficii personalizate."
    },
    {
      icon: <BadgeCheck className="h-10 w-10 text-brand-600" />,
      title: "Impact real",
      description: "Contribui direct la succesul elevilor din România, ajutându-i să-și atingă potențialul academic."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Cariere la BacExamen</h1>
        <p className="text-gray-600 mb-8">
          Alătură-te echipei noastre și contribuie la transformarea educației în România.
          Suntem mereu în căutare de persoane talentate și pasionate care împărtășesc valorile noastre.
        </p>

        <div className="bg-brand-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">De ce să lucrezi cu noi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Posturi disponibile</h2>
        <div className="space-y-6 mb-12">
          {openPositions.map((position, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{position.title}</CardTitle>
                <CardDescription>{position.department}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {position.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {position.type}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    Aplicare până la: 30 iunie 2025
                  </div>
                </div>
                <p className="text-gray-600">{position.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full sm:w-auto">Vezi detalii și aplică</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Nu găsești ce cauți?</h2>
          <p className="text-gray-600 mb-6">
            Dacă nu există un post care să se potrivească profilului tău, dar crezi că poți aduce valoare echipei noastre,
            trimite-ne o aplicație spontană. Suntem mereu deschiși să cunoaștem persoane talentate.
          </p>
          <Button variant="outline">Trimite o aplicație spontană</Button>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
