
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Check, Plus, X } from 'lucide-react';

const TeacherProfileEditPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [certificates, setCertificates] = useState<string[]>([]);
  const [newCertificate, setNewCertificate] = useState('');
  const [scheduleItems, setScheduleItems] = useState<Array<{day: string, hours: string}>>([
    { day: "Luni", hours: "14:00 - 20:00" },
    { day: "Marți", hours: "14:00 - 20:00" },
    { day: "Miercuri", hours: "16:00 - 21:00" }
  ]);
  const [newScheduleDay, setNewScheduleDay] = useState('');
  const [newScheduleHours, setNewScheduleHours] = useState('');
  
  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      education: '',
      experience: ''
    }
  });
  
  useEffect(() => {
    // In a real app, we would fetch the teacher's profile data from an API
    // For now, we'll use mock data
    if (user && user.role === 'teacher') {
      // Fetch teacher data and populate the form
      setSpecializations(['Matematică', 'Fizică']);
      setCertificates(['Diplomă de Excelență în Educație', 'Certificat de Metodologie Didactică']);
    } else {
      // Redirect if not a teacher
      navigate('/');
      toast({
        title: "Acces restricționat",
        description: "Trebuie să fii profesor pentru a accesa această pagină.",
        variant: "destructive"
      });
    }
  }, [user, navigate, toast]);
  
  const onSubmit = (data: any) => {
    // In a real app, we would send this data to an API
    console.log('Form data:', {
      ...data,
      specializations,
      certificates,
      scheduleItems
    });
    
    toast({
      title: "Profil actualizat",
      description: "Profilul tău a fost actualizat cu succes.",
      variant: "default"
    });
    
    // Redirect to teacher profile page
    navigate('/teacher/profile');
  };
  
  const addSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization('');
    }
  };
  
  const removeSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };
  
  const addCertificate = () => {
    if (newCertificate.trim() && !certificates.includes(newCertificate.trim())) {
      setCertificates([...certificates, newCertificate.trim()]);
      setNewCertificate('');
    }
  };
  
  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };
  
  const addScheduleItem = () => {
    if (newScheduleDay.trim() && newScheduleHours.trim()) {
      setScheduleItems([...scheduleItems, { 
        day: newScheduleDay.trim(), 
        hours: newScheduleHours.trim() 
      }]);
      setNewScheduleDay('');
      setNewScheduleHours('');
    }
  };
  
  const removeScheduleItem = (index: number) => {
    setScheduleItems(scheduleItems.filter((_, i) => i !== index));
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/teacher/profile')} 
          className="text-brand-600 hover:text-brand-700"
        >
          &larr; Înapoi la profil
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-2">
                <AvatarImage src={user?.avatar} alt={user?.name || 'Profil'} />
                <AvatarFallback className="bg-brand-500 text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'TP'}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription>Profesor</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Actualizează-ți informațiile pentru a-ți personaliza profilul și pentru a ajuta elevii să te găsească mai ușor.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sfaturi pentru profilul tău</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Fotografie profesională</h4>
                <p className="text-sm text-muted-foreground">
                  Adaugă o fotografie clară care să îți inspire încredere și profesionalism.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Biografie completă</h4>
                <p className="text-sm text-muted-foreground">
                  Descrie-ți experiența, abordarea didactică și materiile pe care le predai.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Certificări relevante</h4>
                <p className="text-sm text-muted-foreground">
                  Adaugă diplomele și certificările care îți atestă expertiza în domeniu.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Editează profilul tău</CardTitle>
              <CardDescription>
                Completează informațiile de mai jos pentru a-ți actualiza profilul de profesor.
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informații de bază</h3>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nume complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Numele tău complet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biografie</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descrie experiența ta și abordarea didactică" 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Education & Experience */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Educație și Experiență</h3>
                    
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Educație</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Universitatea București, Facultatea de Matematică" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experiență profesională</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 5+ ani experiență în predare" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Specializations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Specializări</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-brand-100 text-brand-700">
                          {spec}
                          <button 
                            type="button"
                            onClick={() => removeSpecialization(index)}
                            className="ml-1 text-gray-500 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Adaugă o specializare" 
                        value={newSpecialization}
                        onChange={(e) => setNewSpecialization(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addSpecialization}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Adaugă
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Certificates */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Certificări</h3>
                    
                    <div className="space-y-2 mb-4">
                      {certificates.map((cert, index) => (
                        <div key={index} className="flex items-start justify-between border p-2 rounded-md">
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-1" />
                            <span className="text-sm">{cert}</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeCertificate(index)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Adaugă o certificare" 
                        value={newCertificate}
                        onChange={(e) => setNewCertificate(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addCertificate}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Adaugă
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Schedule */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Program disponibil</h3>
                    
                    <div className="space-y-2 mb-4">
                      {scheduleItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border p-2 rounded-md">
                          <div className="flex flex-1 justify-between">
                            <span className="font-medium">{item.day}:</span>
                            <span>{item.hours}</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeScheduleItem(index)}
                            className="ml-4 text-gray-500 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Input 
                        placeholder="Zi" 
                        value={newScheduleDay}
                        onChange={(e) => setNewScheduleDay(e.target.value)}
                      />
                      <Input 
                        placeholder="Interval orar" 
                        value={newScheduleHours}
                        onChange={(e) => setNewScheduleHours(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addScheduleItem}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Adaugă
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/teacher/profile')}
                  >
                    Anulează
                  </Button>
                  <Button type="submit">Salvează modificările</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileEditPage;
