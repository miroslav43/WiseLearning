
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';

const CookiesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Cookie className="h-8 w-8 text-brand-800" />
          <h1 className="text-3xl font-bold">Politica de Cookies</h1>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ce sunt cookie-urile?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Cookie-urile sunt fișiere text de mici dimensiuni care sunt stocate pe dispozitivul dumneavoastră atunci când vizitați un site web. 
              Acestea sunt utilizate pe scară largă pentru a face site-urile web să funcționeze mai eficient, precum și pentru a furniza informații proprietarilor site-ului.
            </p>
            <p className="text-gray-700">
              Cookie-urile pot fi clasificate ca fiind "esențiale" (necesare pentru funcționarea site-ului) sau "neesențiale" (utilizate pentru analiză, personalizare și marketing).
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cum utilizăm cookie-urile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              WiseLearning utilizează cookie-uri pentru:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>A menține sesiunea dumneavoastră activă în timpul vizitei pe site</li>
              <li>A memora preferințele și setările dumneavoastră</li>
              <li>A personaliza experiența de învățare și conținutul afișat</li>
              <li>A facilita funcționalitățile platformei, precum coșul de cumpărături sau sistemul de autentificare</li>
              <li>A analiza modul în care utilizatorii folosesc platforma noastră pentru a o îmbunătăți constant</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tipuri de cookie-uri utilizate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Cookie-uri esențiale</h3>
                <p className="text-gray-700">
                  Aceste cookie-uri sunt necesare pentru funcționarea site-ului web și nu pot fi dezactivate în sistemele noastre. 
                  Ele sunt, de obicei, setate doar ca răspuns la acțiunile efectuate de dumneavoastră care echivalează cu o cerere de servicii, 
                  cum ar fi setarea preferințelor de confidențialitate, autentificarea sau completarea formularelor.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Cookie-uri de analiză</h3>
                <p className="text-gray-700">
                  Aceste cookie-uri ne permit să numărăm vizitele și sursele de trafic, astfel încât să putem măsura și îmbunătăți performanța site-ului nostru. 
                  Ele ne ajută să știm care pagini sunt cele mai populare și care sunt mai puțin populare, și să vedem cum vizitatorii navigează pe site.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Cookie-uri funcționale</h3>
                <p className="text-gray-700">
                  Aceste cookie-uri permit site-ului să ofere funcționalități și personalizare îmbunătățite. 
                  Ele pot fi setate de noi sau de furnizori terți ale căror servicii le-am adăugat la paginile noastre.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cum puteți gestiona cookie-urile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Majoritatea browserelor web permit controlul cookie-urilor prin setările de preferințe. Cu toate acestea, dacă limitați capacitatea site-urilor web de a seta cookie-uri, 
              acest lucru poate afecta experiența dumneavoastră generală și poate împiedica funcționarea corespunzătoare a anumitor funcționalități ale site-ului nostru.
            </p>
            <p className="text-gray-700">
              Puteți șterge toate cookie-urile care sunt deja pe dispozitivul dumneavoastră accesând setările istoricului browserului. 
              De asemenea, puteți seta browserul pentru a bloca cookie-urile sau pentru a vă avertiza înainte ca acestea să fie stocate pe dispozitivul dumneavoastră.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actualizări ale politicii de cookie-uri</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Această politică poate fi actualizată periodic pentru a reflecta, de exemplu, modificări ale cookie-urilor pe care le folosim sau din alte motive operaționale, legale sau de reglementare. 
              Vă încurajăm să revizuiți periodic această politică pentru a fi informat despre cum utilizăm cookie-urile și tehnologiile conexe.
            </p>
            <p className="text-gray-700 mt-4">
              Ultima actualizare: 8 Mai 2025
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookiesPage;
