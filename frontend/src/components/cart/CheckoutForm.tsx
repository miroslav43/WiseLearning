
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CreditCard, AlertTriangle, MapPin } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const checkoutFormSchema = z.object({
  // Payment Information
  cardholderName: z.string().min(3, { message: 'Numele trebuie să aibă minim 3 caractere.' }),
  cardNumber: z.string()
    .min(16, { message: 'Numărul cardului trebuie să aibă minim 16 caractere.' })
    .max(19, { message: 'Numărul cardului trebuie să aibă maxim 19 caractere.' })
    .regex(/^[0-9\s]+$/, { message: 'Numărul cardului trebuie să conțină doar cifre.' }),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: 'Data expirării trebuie să fie în formatul MM/YY.' }),
  cvv: z.string()
    .min(3, { message: 'CVV trebuie să aibă minim 3 caractere.' })
    .max(4, { message: 'CVV trebuie să aibă maxim 4 caractere.' })
    .regex(/^[0-9]+$/, { message: 'CVV trebuie să conțină doar cifre.' }),

  // Billing Address Fields
  fullName: z.string().min(3, { message: 'Numele complet trebuie să aibă minim 3 caractere.' }),
  streetAddress: z.string().min(5, { message: 'Adresa trebuie să aibă minim 5 caractere.' }),
  city: z.string().min(2, { message: 'Orașul trebuie să aibă minim 2 caractere.' }),
  county: z.string().min(2, { message: 'Județul trebuie să aibă minim 2 caractere.' }),
  postalCode: z.string()
    .min(5, { message: 'Codul poștal trebuie să aibă minim 5 caractere.' })
    .regex(/^[0-9]+$/, { message: 'Codul poștal trebuie să conțină doar cifre.' }),
  phoneNumber: z.string()
    .min(10, { message: 'Numărul de telefon trebuie să aibă minim 10 caractere.' })
    .regex(/^[0-9]+$/, { message: 'Numărul de telefon trebuie să conțină doar cifre.' }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormValues) => void;
  isProcessing: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, isProcessing }) => {
  const [activeSection, setActiveSection] = useState<'payment' | 'billing'>('payment');
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      fullName: '',
      streetAddress: '',
      city: '',
      county: '',
      postalCode: '',
      phoneNumber: '',
    },
  });

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    
    return v;
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  const toggleSection = (section: 'payment' | 'billing') => {
    setActiveSection(section);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Detalii de plată</CardTitle>
        <CardDescription>Introduceți detaliile pentru a finaliza comanda</CardDescription>
        
        <div className="flex mt-4 border rounded-lg overflow-hidden">
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center ${activeSection === 'payment' ? 'bg-brand-600 text-white' : 'bg-gray-100'}`}
            onClick={() => toggleSection('payment')}
          >
            <CreditCard className="h-4 w-4 inline mr-2" />
            Detalii card
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center ${activeSection === 'billing' ? 'bg-brand-600 text-white' : 'bg-gray-100'}`}
            onClick={() => toggleSection('billing')}
          >
            <MapPin className="h-4 w-4 inline mr-2" />
            Adresă facturare
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeSection === 'payment' && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numele deținătorului de card</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ex. Ion Popescu" 
                          {...field} 
                          disabled={isProcessing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numărul cardului</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          {...field} 
                          value={formatCardNumber(field.value)}
                          disabled={isProcessing}
                          maxLength={19}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Data expirării</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/YY" 
                            {...field} 
                            value={formatExpiryDate(field.value)}
                            disabled={isProcessing}
                            maxLength={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="123" 
                            {...field} 
                            disabled={isProcessing}
                            maxLength={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {activeSection === 'billing' && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume complet</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ion Popescu" 
                          {...field} 
                          disabled={isProcessing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresa</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Strada, număr, bloc, scara, apartament" 
                          {...field} 
                          disabled={isProcessing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oraș</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="București" 
                            {...field} 
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="county"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Județ</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ilfov" 
                            {...field} 
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cod poștal</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123456" 
                            {...field} 
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Număr de telefon</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="0712345678" 
                            {...field} 
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm flex items-start mt-4">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
              <p>Acesta este un demo. Nu introduceți datele reale ale cardului dvs. Pentru testare, puteți folosi numărul 4242 4242 4242 4242, orice dată de expirare viitoare și orice CVV cu 3 cifre.</p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isProcessing}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isProcessing ? 'Se procesează...' : 'Plătește acum'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
