
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Adresa de email invalidă' }),
  password: z.string().min(6, { message: 'Parola trebuie să aibă cel puțin 6 caractere' })
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: 'Autentificare reușită',
        description: 'Bine ai revenit!',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Autentificare eșuată',
        description: 'Email sau parolă incorectă.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-brand-600" />
            <span className="text-2xl font-bold text-brand-600">BacExamen</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Autentificare</h2>
          <p className="mt-2 text-gray-600">
            Intră în cont pentru a accesa cursurile tale
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nume@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parolă</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Introduceți parola" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Ține-mă minte
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-brand-600 hover:text-brand-500">
                    Ai uitat parola?
                  </Link>
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center gap-2"
                  disabled={isLoading}
                >
                  <LogIn className="h-4 w-4" />
                  {isLoading ? 'Se procesează...' : 'Autentificare'}
                </Button>
              </div>

              {/* Demo accounts */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500 mb-3 text-center">Demo conturi (pentru testare):</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs p-1 h-auto"
                    onClick={() => {
                      form.setValue('email', 'student@example.com');
                      form.setValue('password', 'password');
                    }}
                  >
                    Student
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs p-1 h-auto"
                    onClick={() => {
                      form.setValue('email', 'teacher@example.com');
                      form.setValue('password', 'password');
                    }}
                  >
                    Profesor
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs p-1 h-auto"
                    onClick={() => {
                      form.setValue('email', 'admin@example.com');
                      form.setValue('password', 'password');
                    }}
                  >
                    Admin
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Nu ai cont?</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/register">
                <Button variant="outline" className="w-full">
                  Creează un cont nou
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
