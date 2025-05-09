
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, you would send the form data to your backend
    toast({
      title: "Mesaj trimis cu succes!",
      description: "Îți mulțumim pentru mesaj. Te vom contacta în curând.",
    });
    // Reset form
    e.currentTarget.reset();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Contactează-ne</h1>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Trimite-ne un mesaj</h2>
          <p className="text-gray-600 mb-8">
            Ai întrebări despre cursurile noastre sau dorești să colaborezi cu noi? Completează formularul și te vom contacta cât mai curând.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
                <Input id="name" placeholder="Numele tău" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input id="email" type="email" placeholder="email@exemplu.com" required />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subiect</label>
              <Input id="subject" placeholder="Subiectul mesajului" required />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
              <Textarea 
                id="message" 
                placeholder="Mesajul tău..." 
                rows={6} 
                required 
              />
            </div>
            
            <Button type="submit" className="w-full md:w-auto">
              Trimite mesaj
            </Button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Informații de contact</h2>
          <p className="text-gray-600 mb-8">
            Poți să ne contactezi direct folosind informațiile de mai jos sau ne poți vizita la sediul nostru.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-brand-100 p-3 rounded-full">
                <Mail className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">contact@bacexamen.ro</p>
                <p className="text-gray-600">suport@bacexamen.ro</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-brand-100 p-3 rounded-full">
                <Phone className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Telefon</h3>
                <p className="text-gray-600">+40 723 456 789</p>
                <p className="text-gray-600">+40 21 123 4567</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-brand-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Adresă</h3>
                <p className="text-gray-600">Strada Academiei 14</p>
                <p className="text-gray-600">Sector 1, București</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-brand-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Program</h3>
                <p className="text-gray-600">Luni - Vineri: 9:00 - 18:00</p>
                <p className="text-gray-600">Sâmbătă: 10:00 - 14:00</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 rounded-lg overflow-hidden h-64 border border-gray-200">
            {/* This would be replaced with a real map integration */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Harta va fi afișată aici</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-brand-50 rounded-xl p-8 text-center mb-16">
        <h2 className="text-2xl font-semibold mb-2">Ai nevoie de asistență rapidă?</h2>
        <p className="text-gray-600 mb-6">Echipa noastră de suport este disponibilă pentru a te ajuta</p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            Sună-ne acum
          </Button>
          <Button className="gap-2">
            <Mail className="h-4 w-4" />
            Email rapid
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
