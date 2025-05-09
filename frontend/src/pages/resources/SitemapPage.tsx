
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LayoutGrid } from 'lucide-react';

const SitemapPage: React.FC = () => {
  // Define all site sections
  const sections = [
    {
      title: "Pagini Principale",
      links: [
        { name: "Acasă", path: "/" },
        { name: "Despre Noi", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Blog", path: "/blog" },
      ]
    },
    {
      title: "Cursuri și Învățare",
      links: [
        { name: "Toate Cursurile", path: "/courses" },
        { name: "Matematică", path: "/courses?category=mathematics" },
        { name: "Fizică", path: "/courses?category=physics" },
        { name: "Chimie", path: "/courses?category=chemistry" },
        { name: "Biologie", path: "/courses?category=biology" },
        { name: "Limba Română", path: "/courses?category=romanian" },
        { name: "Istorie", path: "/courses?category=history" },
        { name: "Informatică", path: "/courses?category=computer-science" },
      ]
    },
    {
      title: "Servicii",
      links: [
        { name: "Abonamente", path: "/subscriptions" },
        { name: "Tutoriat", path: "/tutoring" },
        { name: "Calendar", path: "/calendar" },
      ]
    },
    {
      title: "Cont și Utilizator",
      links: [
        { name: "Autentificare", path: "/login" },
        { name: "Înregistrare", path: "/register" },
        { name: "Profil", path: "/profile" },
        { name: "Setări Cont", path: "/settings" },
        { name: "Coș de Cumpărături", path: "/cart" },
      ]
    },
    {
      title: "Resurse",
      links: [
        { name: "Materiale Gratuite", path: "/resources/materials" },
        { name: "Întrebări Frecvente", path: "/faq" },
        { name: "Testimoniale", path: "/testimonials" },
        { name: "Ajutor", path: "/help" },
      ]
    },
    {
      title: "Zona Studentului",
      links: [
        { name: "Tablou de Bord Student", path: "/dashboard/student" },
        { name: "Cursurile Mele", path: "/my-courses" },
        { name: "Realizările Mele", path: "/my-achievements" },
        { name: "Certificatele Mele", path: "/my-certificates" },
        { name: "Punctele Mele", path: "/my-points" },
        { name: "Tutoriatul Meu", path: "/my-tutoring" },
        { name: "Mesaje", path: "/messaging" },
      ]
    },
    {
      title: "Zona Profesorului",
      links: [
        { name: "Tablou de Bord Profesor", path: "/dashboard/teacher" },
        { name: "Gestionare Cursuri", path: "/my-courses/manage" },
        { name: "Studenții Mei", path: "/my-students" },
        { name: "Gestionare Tutoriat", path: "/my-tutoring/manage" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Termeni și Condiții", path: "/terms" },
        { name: "Politica de Confidențialitate", path: "/privacy-policy" },
        { name: "Politica de Cookies", path: "/cookies" },
        { name: "Cariere", path: "/careers" },
      ]
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <LayoutGrid className="h-8 w-8 text-brand-800" />
          <h1 className="text-3xl font-bold">Hartă Site</h1>
        </div>
        
        <p className="text-gray-700 mb-8">
          Această pagină conține o hartă completă a site-ului WiseLearning, organizată pe secțiuni pentru a vă ajuta să găsiți rapid informațiile sau serviciile de care aveți nevoie.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="h-full">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link 
                        to={link.path} 
                        className="text-brand-800 hover:underline hover:text-brand-700 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12">
          <Separator className="mb-6" />
          <p className="text-gray-600 text-sm">
            Nu găsiți ceea ce căutați? Vizitați pagina noastră de <Link to="/help" className="text-brand-800 hover:underline">Ajutor</Link> sau <Link to="/contact" className="text-brand-800 hover:underline">Contactați-ne</Link> direct.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
