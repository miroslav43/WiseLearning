
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, BookOpen, Video, Film, PenTool } from 'lucide-react';

const MaterialsPage: React.FC = () => {
  const materials = [
    {
      title: "Variante BAC Matematică M1",
      description: "Colecție completă de variante rezolvate pentru profilul real, specializarea matematică-informatică.",
      type: "PDF",
      icon: FileText,
      downloadUrl: "#"
    },
    {
      title: "Variante BAC Română",
      description: "Subiecte și bareme din sesiunile anterioare cu rezolvări detaliate.",
      type: "PDF",
      icon: FileText,
      downloadUrl: "#"
    },
    {
      title: "Formule Matematică",
      description: "Toate formulele esențiale pentru algebră, analiză și geometrie, organizate pe capitole.",
      type: "PDF",
      icon: FileText,
      downloadUrl: "#"
    },
    {
      title: "Sinteze Istorie",
      description: "Materiale sintetice pentru toate perioadele istorice incluse în programa de Bacalaureat.",
      type: "PDF",
      icon: FileText,
      downloadUrl: "#"
    },
    {
      title: "Lecții Video Fizică",
      description: "Explicații video pentru principalele concepte de mecanică, termodinamică și electricitate.",
      type: "Video",
      icon: Video,
      downloadUrl: "#"
    },
    {
      title: "Simulare completă BAC",
      description: "Set complet de simulări pentru toate materiile obligatorii la Bacalaureat.",
      type: "PDF",
      icon: PenTool,
      downloadUrl: "#"
    }
  ];

  const categories = [
    { name: "Matematică", count: 15 },
    { name: "Limba Română", count: 12 },
    { name: "Istorie", count: 8 },
    { name: "Biologie", count: 10 },
    { name: "Fizică", count: 9 },
    { name: "Chimie", count: 7 },
    { name: "Informatică", count: 11 },
    { name: "Geografie", count: 6 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Materiale Gratuite</h1>
      <p className="text-gray-600 mb-8">
        Descarcă materiale educaționale gratuite pentru pregătirea examenului de Bacalaureat.
        Toate resursele sunt create de profesori experimentați și actualizate conform programei în vigoare.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {materials.map((material, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <div className="bg-brand-100 text-brand-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {material.type}
                    </div>
                  </div>
                  <CardDescription>{material.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full gap-2" variant="outline">
                    <Download className="h-4 w-4" />
                    Descarcă gratuit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Materiale Premium</h2>
            <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Obține acces la toate materialele noastre premium</h3>
                  <p className="text-gray-600">
                    Peste 200 de resurse exclusive, actualizate constant și adaptate cerințelor actuale
                  </p>
                </div>
                <Button className="shrink-0">
                  Vezi planurile premium
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Categorii</CardTitle>
              <CardDescription>Resurse pe materii</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <a 
                      href={`#${category.name.toLowerCase()}`}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Solicită materiale</CardTitle>
              <CardDescription>
                Nu găsești ce cauți? Trimite-ne un mesaj și vom încerca să îți oferim materialele necesare.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <a href="/contact">
                <Button variant="outline" className="w-full">
                  Solicită materiale
                </Button>
              </a>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;
