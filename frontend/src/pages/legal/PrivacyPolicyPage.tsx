
import React from 'react';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Politica de confidențialitate</h1>
        <p className="text-gray-600 mb-8">
          Ultima actualizare: 1 Mai 2025
        </p>
        
        <div className="prose prose-gray max-w-none">
          <h2>Introducere</h2>
          <p>
            Bun venit la BacExamen! Confidențialitatea datelor tale este importantă pentru noi. Această Politică de Confidențialitate descrie modul în care colectăm, utilizăm, stocăm și protejăm informațiile pe care le furnizezi când utilizezi platforma noastră educațională.
          </p>
          <p>
            Prin accesarea și utilizarea serviciilor noastre, ești de acord cu practicile descrise în această politică. Te rugăm să o citești cu atenție pentru a înțelege cum tratăm informațiile tale.
          </p>
          
          <Separator className="my-6" />
          
          <h2>Informațiile pe care le colectăm</h2>
          <h3>Informații furnizate de tine</h3>
          <p>
            Când creezi un cont sau utilizezi serviciile noastre, putem colecta următoarele tipuri de informații:
          </p>
          <ul>
            <li>Informații de identificare: nume, adresă de e-mail, număr de telefon</li>
            <li>Informații educaționale: școala, clasa, profilul de studiu, materiile de interes</li>
            <li>Conținut generat de utilizator: comentarii, întrebări, răspunsuri în forum, teme încărcate</li>
            <li>Informații de plată: detalii despre card (dacă achiziționezi servicii premium)</li>
          </ul>
          
          <h3>Informații colectate automat</h3>
          <p>
            Când utilizezi platforma noastră, colectăm automat anumite informații despre dispozitivul tău și interacțiunea cu serviciile noastre:
          </p>
          <ul>
            <li>Informații despre dispozitiv: tipul dispozitivului, sistemul de operare, browser, rezoluție</li>
            <li>Date de utilizare: paginile accesate, timpul petrecut pe platformă, funcționalitățile utilizate</li>
            <li>Date de performanță: rezultate la teste, progres în cursuri, timp de studiu</li>
            <li>Informații de localizare: țară, regiune (bazate pe adresa IP)</li>
          </ul>
          
          <Separator className="my-6" />
          
          <h2>Cum utilizăm informațiile</h2>
          <p>
            Utilizăm informațiile colectate pentru următoarele scopuri:
          </p>
          <ul>
            <li>Furnizarea și personalizarea serviciilor educaționale</li>
            <li>Îmbunătățirea și dezvoltarea platformei noastre</li>
            <li>Comunicarea cu tine despre contul tău, actualizări sau promoții</li>
            <li>Procesarea plăților și gestionarea abonamentelor</li>
            <li>Oferirea de asistență și răspunsuri la întrebări</li>
            <li>Analiza tendințelor de utilizare și monitorizarea performanței</li>
            <li>Asigurarea securității platformei și prevenirea fraudelor</li>
          </ul>
          
          <Separator className="my-6" />
          
          <h2>Partajarea informațiilor</h2>
          <p>
            Nu vindem informațiile tale personale către terți. Putem partaja informații în următoarele situații:
          </p>
          <ul>
            <li>Cu furnizori de servicii care ne ajută să operăm platforma (procesatori de plăți, servicii de găzduire, analiză)</li>
            <li>Cu parteneri educaționali pentru a oferi servicii integrate (doar cu consimțământul tău)</li>
            <li>În cazul în care legea ne obligă sau pentru a ne proteja drepturile legale</li>
            <li>În cazul unei fuziuni, achiziții sau vânzări de active (cu protecții adecvate pentru datele tale)</li>
          </ul>
          
          <Separator className="my-6" />
          
          <h2>Securitatea datelor</h2>
          <p>
            Implementăm măsuri tehnice și organizaționale adecvate pentru a proteja informațiile tale împotriva accesului neautorizat, utilizării incorecte sau divulgării. Aceste măsuri includ:
          </p>
          <ul>
            <li>Criptarea datelor sensibile</li>
            <li>Accesul restricționat la informațiile tale personale</li>
            <li>Monitorizarea și testarea regulată a sistemelor noastre</li>
            <li>Instruirea personalului nostru cu privire la protecția datelor</li>
          </ul>
          <p>
            Cu toate acestea, nicio metodă de transmitere pe internet sau de stocare electronică nu este 100% sigură, astfel că nu putem garanta securitatea absolută.
          </p>
          
          <Separator className="my-6" />
          
          <h2>Drepturile tale</h2>
          <p>
            În conformitate cu legile aplicabile privind protecția datelor, ai următoarele drepturi:
          </p>
          <ul>
            <li>Dreptul de acces la datele tale personale</li>
            <li>Dreptul de a solicita rectificarea datelor inexacte</li>
            <li>Dreptul de a solicita ștergerea datelor în anumite circumstanțe</li>
            <li>Dreptul de a solicita restricționarea prelucrării</li>
            <li>Dreptul la portabilitatea datelor</li>
            <li>Dreptul de a te opune prelucrării bazate pe interesele noastre legitime</li>
            <li>Dreptul de a retrage consimțământul în orice moment</li>
            <li>Dreptul de a depune o plângere la o autoritate de supraveghere</li>
          </ul>
          <p>
            Pentru a-ți exercita aceste drepturi, te rugăm să ne contactezi la adresa privacy@bacexamen.ro.
          </p>
          
          <Separator className="my-6" />
          
          <h2>Cookie-uri și tehnologii similare</h2>
          <p>
            Utilizăm cookie-uri și tehnologii similare pentru a îmbunătăți experiența utilizatorilor, a analiza traficul și a personaliza conținutul. Poți controla utilizarea cookie-urilor prin setările browserului tău. Pentru mai multe informații, te rugăm să consulți Politica noastră privind Cookie-urile.
          </p>
          
          <Separator className="my-6" />
          
          <h2>Informații pentru minori</h2>
          <p>
            Serviciile noastre sunt destinate persoanelor cu vârsta de cel puțin 14 ani. Nu colectăm cu bună știință informații personale de la copii sub această vârstă. Dacă ești părinte sau tutore și crezi că copilul tău ne-a furnizat informații personale, te rugăm să ne contactezi pentru a le elimina.
          </p>
          
          <Separator className="my-6" />
          
          <h2>Modificări ale politicii de confidențialitate</h2>
          <p>
            Putem actualiza această politică de confidențialitate periodic pentru a reflecta modificările practicilor noastre sau din alte motive operaționale, legale sau de reglementare. Te vom notifica despre modificările semnificative prin afișarea unei notificări pe site-ul nostru sau prin trimiterea unui e-mail.
          </p>
          
          <Separator className="my-6" />
          
          <h2>Contact</h2>
          <p>
            Dacă ai întrebări, preocupări sau solicitări privind această politică de confidențialitate sau modul în care procesăm datele tale personale, te rugăm să ne contactezi la:
          </p>
          <p>
            Email: privacy@bacexamen.ro<br />
            Adresă: Strada Academiei 14, Sector 1, București<br />
            Telefon: +40 723 456 789
          </p>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>
              © 2025 BacExamen. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
