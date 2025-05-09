
import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TutoringSession, TutoringAvailability, TutoringLocationType } from '@/types/tutoring';

interface TutoringSessionFormProps {
  session?: Partial<TutoringSession>;
  onSubmit?: (data: TutoringSessionFormValues) => void;
  onSessionCreated?: () => void;
  onCancel?: () => void;
}

const tutoringFormSchema = z.object({
  subject: z.string().min(3, { message: 'Subiectul trebuie să conțină cel puțin 3 caractere' }),
  description: z.string().min(10, { message: 'Descrierea trebuie să conțină cel puțin 10 caractere' }),
  locationType: z.enum(['online', 'offline', 'both']),
  pricePerHour: z.number().min(1, { message: 'Prețul pe oră trebuie să fie cel puțin 1' }),
  availability: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
    })
  ).min(1, { message: 'Adăugați cel puțin o perioadă de disponibilitate' }),
});

export type TutoringSessionFormValues = z.infer<typeof tutoringFormSchema>;

export const TutoringSessionForm: React.FC<TutoringSessionFormProps> = ({
  session,
  onSubmit,
  onSessionCreated,
  onCancel
}) => {
  const form = useForm<TutoringSessionFormValues>({
    resolver: zodResolver(tutoringFormSchema),
    defaultValues: {
      subject: session?.subject || '',
      description: session?.description || '',
      locationType: session?.locationType || 'online',
      pricePerHour: session?.pricePerHour || 50,
      availability: session?.availability?.length
        ? session.availability
        : [{ dayOfWeek: 1, startTime: '14:00', endTime: '16:00' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availability',
  });

  const daysOfWeek = [
    { value: 0, label: 'Duminică' },
    { value: 1, label: 'Luni' },
    { value: 2, label: 'Marți' },
    { value: 3, label: 'Miercuri' },
    { value: 4, label: 'Joi' },
    { value: 5, label: 'Vineri' },
    { value: 6, label: 'Sâmbătă' },
  ];

  const handleSubmit = (data: TutoringSessionFormValues) => {
    if (onSubmit) {
      onSubmit(data);
    }
    if (onSessionCreated) {
      onSessionCreated();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subiect</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Matematică pentru Bacalaureat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descriere</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrieți detaliile sesiunii de tutoriat..." 
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
          name="locationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tip de locație</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectați tipul de locație" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">În persoană</SelectItem>
                  <SelectItem value="both">Ambele</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricePerHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preț pe oră (RON)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(Number(e.target.value))}
                  min={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Disponibilitate</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ dayOfWeek: 1, startTime: '14:00', endTime: '16:00' })}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Adaugă
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 p-3 border rounded-md">
              <div className="grid grid-cols-3 gap-2 flex-1">
                <FormField
                  control={form.control}
                  name={`availability.${index}.dayOfWeek`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Ziua</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Ziua" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {daysOfWeek.map(day => (
                            <SelectItem key={day.value} value={day.value.toString()}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`availability.${index}.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Ora de început</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`availability.${index}.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Ora de sfârșit</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Șterge</span>
              </Button>
            </div>
          ))}
          <FormMessage>{form.formState.errors.availability?.message}</FormMessage>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anulează
          </Button>
          <Button type="submit">
            {session?.id ? 'Actualizează' : 'Creează'} sesiune de tutoriat
          </Button>
        </div>
      </form>
    </Form>
  );
};
