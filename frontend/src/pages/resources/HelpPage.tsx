
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { SearchIcon, HelpCircle, BookOpen, Video, MessageCircle, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HelpPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Centru de Ajutor</h1>
        <p className="text-gray-600 mb-8">
          Găsește răspunsuri la întrebările tale și învață cum să folosești platforma BacExamen pentru a maximiza
          șansele de succes la examenele tale.
        </p>
        
        <div className="relative mb-8">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input 
            className="pl-10" 
            placeholder="Caută în Centrul de Ajutor..." 
          />
        </div>
        
        <Tabs defaultValue="getting-started">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="getting-started">Început</TabsTrigger>
            <TabsTrigger value="account">Cont</TabsTrigger>
            <TabsTrigger value="courses">Cursuri</TabsTrigger>
            <TabsTrigger value="exams">Examene</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Primii pași pe platformă</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cum să îți creezi un cont</CardTitle>
                  <CardDescription>
                    Află cum să îți creezi un cont și să îți configurezi profilul
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Accesează pagina de înregistrare din partea dreaptă sus a site-ului</li>
                    <li>Completează formularul cu datele tale personale</li>
                    <li>Verifică email-ul pentru a confirma contul</li>
                    <li>Logează-te și completează informațiile de profil</li>
                    <li>Alege materiile pentru care dorești să te pregătești</li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cum să navighezi pe platformă</CardTitle>
                  <CardDescription>
                    Ghid de navigare pentru a găsi rapid resursele de care ai nevoie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <BookOpen className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Secțiunea Cursuri</span> - Aici găsești toate materialele de studiu organizate pe materii și capitole
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Video className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Videoteca</span> - Conține toate lecțiile video și tutorialele pentru fiecare materie
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <MessageCircle className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Forum</span> - Comunitatea unde poți adresa întrebări și interacționa cu alți elevi și profesori
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Settings className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Setări cont</span> - Aici poți modifica informațiile de profil și preferințele de utilizare
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cum să alegi cursurile potrivite</CardTitle>
                  <CardDescription>
                    Recomandări pentru alegerea materialelor care se potrivesc nevoilor tale
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Pentru a alege cursurile potrivite, ia în considerare următoarele aspecte:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Profilul liceului și specializarea ta</li>
                    <li>Materiile obligatorii pentru Bacalaureat</li>
                    <li>Nivelul tău actual de pregătire pentru fiecare materie</li>
                    <li>Timpul disponibil pentru studiu până la examen</li>
                    <li>Stilul tău de învățare (vizual, auditiv, practic)</li>
                  </ul>
                  <div className="mt-4">
                    <Button variant="link" className="px-0">
                      <a href="/courses">Explorează toate cursurile →</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Gestionarea contului</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Cum să îți actualizezi profilul</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Pentru a actualiza informațiile de profil, urmează acești pași:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Accesează pagina de profil din meniul de utilizator</li>
                    <li>Dă click pe "Editează profilul"</li>
                    <li>Actualizează informațiile dorite</li>
                    <li>Salvează modificările</li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Setări de confidențialitate și notificări</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Poți controla setările de confidențialitate și notificările primite astfel:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Accesează "Setări" din meniul de utilizator</li>
                    <li>Navighează la secțiunea "Confidențialitate" pentru a gestiona cine poate vedea activitatea ta</li>
                    <li>În secțiunea "Notificări" poți activa/dezactiva alertele prin email și push</li>
                    <li>Salvează preferințele</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Abonamente și facturare</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Pentru a gestiona abonamentele și a vizualiza facturile:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Accesează "Setări" din meniul de utilizator</li>
                    <li>Navighează la secțiunea "Abonamente și plăți"</li>
                    <li>Aici poți vizualiza istoricul plăților, facturile și poți modifica sau anula abonamentele existente</li>
                    <li>Pentru facturi, dă click pe "Descarcă factura" lângă plata corespunzătoare</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Utilizarea cursurilor</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cum să urmărești progresul</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Platforma noastră îți permite să urmărești progresul în timp real:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Accesează "Dashboard" pentru o privire de ansamblu asupra progresului tău la toate cursurile</li>
                    <li>În pagina fiecărui curs, vei vedea un indicator de progres care arată câte lecții ai parcurs</li>
                    <li>După fiecare test, primești un raport detaliat cu rezultatele și recomandări de îmbunătățire</li>
                    <li>Poți vizualiza statisticile de învățare în secțiunea "Analiză progres"</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cum să descarci materiale pentru studiu offline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Pentru a studia offline, poți descărca materialele astfel:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Accesează lecția sau resursa pe care dorești să o descarci</li>
                    <li>Caută butonul "Descarcă" (de obicei în partea de jos sau în opțiunile lecției)</li>
                    <li>Alege formatul dorit (PDF, DOCX, etc.)</li>
                    <li>Documentul va fi salvat pe dispozitivul tău</li>
                    <li>Pentru videoclipuri, opțiunea de descărcare este disponibilă doar pentru abonamentele premium</li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cum să folosești forumul de discuții</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Forumul nostru este un loc excelent pentru a pune întrebări și a interacționa cu comunitatea:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Accesează secțiunea "Forum" din meniul principal</li>
                    <li>Alege categoria potrivită pentru întrebarea ta</li>
                    <li>Folosește butonul "Întrebare nouă" pentru a crea o postare</li>
                    <li>Formulează clar întrebarea și adaugă detalii relevante</li>
                    <li>Poți marca un răspuns ca fiind "soluție" dacă rezolvă problema ta</li>
                    <li>Poți salva discuțiile interesante pentru a le accesa mai târziu</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="exams">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Pregătirea pentru examene</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cum să te pregătești eficient pentru simulări</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Simulările sunt esențiale pentru pregătirea eficientă. Iată cum să te pregătești:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Parcurge toată materia cel puțin o dată înainte de simulare</li>
                    <li>Rezolvă variante din anii anteriori pentru a te familiariza cu formatul</li>
                    <li>Cronometrează-te pentru a te obișnui cu timpul limitat</li>
                    <li>Analizează greșelile frecvente și concentrează-te pe îmbunătățirea lor</li>
                    <li>Utilizează simulările online din platformă care oferă feedback instant</li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cum să folosești rezultatele testelor pentru îmbunătățire</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Rezultatele testelor sunt valoroase pentru îmbunătățirea performanței:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Analizează fiecare greșeală pentru a înțelege cauza</li>
                    <li>Consultă explicațiile detaliate oferite pentru fiecare răspuns greșit</li>
                    <li>Identifică tiparele de greșeli pentru a descoperi zonele slabe</li>
                    <li>Creează un plan de studiu concentrat pe aceste zone</li>
                    <li>Refă testele periodic pentru a măsura progresul</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sfaturi pentru ziua examenului</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Pentru a da tot ce ai mai bun în ziua examenului:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Odihnește-te bine în noaptea dinaintea examenului</li>
                    <li>Ia un mic dejun consistent și hidratează-te corespunzător</li>
                    <li>Ajunge cu cel puțin 30 de minute înainte la centrul de examen</li>
                    <li>Citește cu atenție toate instrucțiunile înainte de a începe</li>
                    <li>Alocă timp pentru verificarea răspunsurilor la final</li>
                    <li>Începe cu subiectele pe care le știi cel mai bine pentru a câștiga încredere</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 bg-brand-50 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <HelpCircle className="h-12 w-12 text-brand-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Nu ai găsit ce căutai?</h2>
              <p className="text-gray-600 mb-4">
                Echipa noastră de suport este disponibilă pentru a răspunde la orice întrebare ai avea.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/contact">
                  <Button>Contactează-ne</Button>
                </a>
                <a href="/faq">
                  <Button variant="outline">Vezi întrebări frecvente</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
