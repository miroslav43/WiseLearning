
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "Cum mă pregătesc eficient pentru Bacalaureat?",
      answer: "Pentru o pregătire eficientă, îți recomandăm să urmezi un program regulat de studiu, să rezolvi cât mai multe variante de subiecte din anii anteriori și să folosești resursele noastre educaționale personalizate."
    },
    {
      question: "Cât timp ar trebui să aloc zilnic pentru studiu?",
      answer: "Recomandăm 2-3 ore zilnic pentru fiecare materie principală, cu pauze regulate pentru a menține concentrarea și eficiența. Calitatea timpului de studiu este mai importantă decât cantitatea."
    },
    {
      question: "Cum pot accesa cursurile online?",
      answer: "După crearea unui cont și achiziționarea cursurilor dorite, le poți accesa imediat din secțiunea 'Cursurile mele' din contul tău. Toate materialele sunt disponibile 24/7."
    },
    {
      question: "Oferiți meditații individuale?",
      answer: "Da, oferim sesiuni de meditații individuale cu profesori experimentați pentru toate materiile de Bacalaureat. Poți programa o sesiune din contul tău personal."
    },
    {
      question: "Cum știu ce materii să aleg pentru Bacalaureat?",
      answer: "Materiile pentru Bacalaureat depind de profilul liceului tău. Te recomandăm să consulți profesorii tăi și să verifici metodologia oficială pentru anul curent pe site-ul Ministerului Educației."
    },
    {
      question: "Cum pot obține o notă mai bună la Bacalaureat?",
      answer: "Pentru note mai bune, concentrează-te pe înțelegerea conceptelor fundamentale, exersează cu subiecte din anii anteriori, participă la simulări și cere feedback constant de la profesori."
    },
    {
      question: "Ce fac dacă am întrebări despre conținutul cursurilor?",
      answer: "Poți adresa întrebări direct profesorilor prin funcția de comentarii disponibilă la fiecare lecție sau poți contacta echipa noastră de suport."
    },
    {
      question: "Cât costă cursurile voastre?",
      answer: "Prețurile variază în funcție de materie și pachetul ales. Oferim opțiuni pentru toate bugetele, inclusiv pachete complete cu reduceri semnificative. Verifică pagina de cursuri pentru detalii."
    },
    {
      question: "Oferiți certificate la finalizarea cursurilor?",
      answer: "Da, la finalizarea fiecărui curs vei primi un certificat digital care atestă parcurgerea materialelor și evaluările completate."
    },
    {
      question: "Pot anula un abonament?",
      answer: "Da, poți anula abonamentul oricând din contul tău. Pentru cursurile achiziționate individual, oferim o garanție de 14 zile cu returnarea banilor."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Întrebări Frecvente</h1>
      <p className="text-gray-600 mb-8">
        Găsește răspunsuri la cele mai comune întrebări despre pregătirea pentru Bacalaureat și serviciile noastre.
      </p>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-16 bg-brand-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Nu ai găsit răspunsul căutat?</h2>
        <p className="text-gray-600 mb-6">Contactează-ne și îți vom răspunde cât mai curând posibil.</p>
        <div className="flex justify-center">
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700"
          >
            Contactează-ne
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
