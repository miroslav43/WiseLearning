
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTutoringService } from '@/services/tutoringService';
import { TutoringSession, TutoringAvailability, TutoringLocationType } from '@/types/tutoring';
import { v4 as uuidv4 } from 'uuid';
import { Calendar, Clock, Plus, Trash } from 'lucide-react';

const TutoringAnnouncementForm: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const isEditMode = !!sessionId;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const tutoringService = useTutoringService();
  
  const [availabilities, setAvailabilities] = useState<TutoringAvailability[]>([
    { dayOfWeek: 1, startTime: "14:00", endTime: "16:00" }
  ]);
  
  const form = useForm({
    defaultValues: {
      subject: '',
      description: '',
      pricePerHour: 0,
      locationType: 'online' as TutoringLocationType,
    }
  });
  
  useEffect(() => {
    // Guard against non-teachers accessing this page
    if (user && user.role !== 'teacher') {
      navigate('/');
      toast({
        title: "Acces restricționat",
        description: "Această pagină este disponibilă doar pentru profesori.",
        variant: "destructive"
      });
      return;
    }
    
    // Load data for edit mode
    if (isEditMode && sessionId) {
      const session = tutoringService.getTutoringSessionById(sessionId);
      if (session) {
        form.reset({
          subject: session.subject,
          description: session.description,
          pricePerHour: session.pricePerHour,
          locationType: session.locationType,
        });
        
        if (session.availability && session.availability.length > 0) {
          setAvailabilities(session.availability);
        }
      } else {
        toast({
          title: "Anunț negăsit",
          description: "Anunțul pe care încerci să-l editezi nu a fost găsit.",
          variant: "destructive"
        });
        navigate('/my-tutoring/manage');
      }
    }
  }, [isEditMode, sessionId, tutoringService, form, navigate, toast, user]);
  
  const onSubmit = (data: any) => {
    if (!user) return;
    
    // Validate availabilities
    if (availabilities.length === 0) {
      toast({
        title: "Eroare",
        description: "Trebuie să adaugi cel puțin o disponibilitate.",
        variant: "destructive"
      });
      return;
    }
    
    // Create tutoring session object
    const sessionData: TutoringSession = {
      id: isEditMode && sessionId ? sessionId : uuidv4(),
      teacherId: user.id,
      teacherName: user.name,
      teacherAvatar: user.avatar,
      subject: data.subject,
      description: data.description,
      availability: availabilities,
      locationType: data.locationType,
      pricePerHour: data.pricePerHour,
      status: 'pending',
      createdAt: isEditMode ? new Date() : new Date(),
      updatedAt: new Date()
    };
    
    // Save session
    try {
      if (isEditMode) {
        tutoringService.updateTutoringSession(sessionData);
        toast({
          title: "Anunț actualizat",
          description: "Anunțul tău a fost actualizat cu succes și este în așteptare pentru aprobare.",
        });
      } else {
        tutoringService.createTutoringSession(sessionData);
        toast({
          title: "Anunț creat",
          description: "Anunțul tău a fost creat cu succes și este în așteptare pentru aprobare.",
        });
      }
      
      navigate('/my-tutoring/manage');
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la salvarea anunțului. Te rugăm să încerci din nou.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddAvailability = () => {
    setAvailabilities([
      ...availabilities,
      { dayOfWeek: 1, startTime: "14:00", endTime: "16:00" }
    ]);
  };
  
  const handleRemoveAvailability = (index: number) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index));
  };
  
  const handleAvailabilityChange = (index: number, field: keyof TutoringAvailability, value: any) => {
    const updatedAvailabilities = [...availabilities];
    updatedAvailabilities[index] = {
      ...updatedAvailabilities[index],
      [field]: value
    };
    setAvailabilities(updatedAvailabilities);
  };
  
  const getDayName = (dayOfWeek: number): string => {
    const days = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
    return days[dayOfWeek];
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/my-tutoring/manage')} 
        className="text-brand-600 hover:text-brand-700 mb-6"
      >
        &larr; Înapoi la meditațiile mele
      </Button>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Editează anunțul de meditații" : "Crează un anunț nou de meditații"}
          </CardTitle>
          <CardDescription>
            Completează formularul de mai jos pentru a {isEditMode ? "actualiza" : "crea"} un anunț de meditații pentru elevi.
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                rules={{ required: "Materia este obligatorie" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materie</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Matematică, Informatică, Fizică" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Descrierea este obligatorie" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descriere</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrie detaliat meditațiile pe care le oferi, nivelul, metodele folosite, etc." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pricePerHour"
                rules={{ 
                  required: "Prețul pe oră este obligatoriu",
                  min: { value: 1, message: "Prețul trebuie să fie mai mare decât 0" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preț pe oră (RON)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 150" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="locationType"
                rules={{ required: "Tipul de locație este obligatoriu" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tip de meditație</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează tipul de meditație" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Față în față</SelectItem>
                        <SelectItem value="both">Ambele opțiuni</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-medium">Program disponibil</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddAvailability}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adaugă disponibilitate
                  </Button>
                </div>
                
                {availabilities.map((availability, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Disponibilitate #{index + 1}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveAvailability(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <label className="text-sm font-medium">Ziua</label>
                        </div>
                        <Select 
                          value={availability.dayOfWeek.toString()} 
                          onValueChange={(value) => handleAvailabilityChange(index, 'dayOfWeek', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Alege ziua" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Luni</SelectItem>
                            <SelectItem value="2">Marți</SelectItem>
                            <SelectItem value="3">Miercuri</SelectItem>
                            <SelectItem value="4">Joi</SelectItem>
                            <SelectItem value="5">Vineri</SelectItem>
                            <SelectItem value="6">Sâmbătă</SelectItem>
                            <SelectItem value="0">Duminică</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <label className="text-sm font-medium">Ora de început</label>
                        </div>
                        <Input 
                          type="time" 
                          value={availability.startTime} 
                          onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <label className="text-sm font-medium">Ora de sfârșit</label>
                        </div>
                        <Input 
                          type="time" 
                          value={availability.endTime} 
                          onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {availabilities.length === 0 && (
                  <div className="text-center py-6 border border-dashed rounded-md">
                    <p className="text-muted-foreground">Nu ai adăugat încă nicio disponibilitate.</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddAvailability}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Adaugă disponibilitate
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/my-tutoring/manage')}
              >
                Anulează
              </Button>
              <Button type="submit">
                {isEditMode ? "Actualizează anunțul" : "Publică anunțul"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default TutoringAnnouncementForm;
