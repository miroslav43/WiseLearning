import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useTutoringContext } from "@/contexts/TutoringContext";
import { cn } from "@/lib/utils";
import { TutoringSession } from "@/types/tutoring";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { ro } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TutoringRequestFormProps {
  session: TutoringSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Create a schema for the form
const requestFormSchema = z.object({
  message: z.string().min(10, {
    message: "Mesajul trebuie să conțină cel puțin 10 caractere.",
  }),
  preferredDates: z
    .array(
      z.object({
        date: z.date(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .min(1, {
      message: "Trebuie să selectezi cel puțin o dată preferată.",
    }),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

const TutoringRequestForm: React.FC<TutoringRequestFormProps> = ({
  session,
  open,
  onOpenChange,
}) => {
  const { sendTutoringRequest } = useTutoringContext();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Safe property access with fallbacks
  const teacherName = session.teacherName || "Profesor necunoscut";
  const subject = session.subject || "Materie necunoscută";

  // Get default values for the form
  const defaultValues: RequestFormValues = {
    message: "",
    preferredDates: [
      {
        date: addDays(new Date(), 1),
        startTime: "10:00",
        endTime: "11:00",
      },
    ],
  };

  // Initialize the form
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: RequestFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Format the preferred dates to match the API format
      const formattedPreferredDates = data.preferredDates.map((pd) => ({
        date: format(pd.date, "yyyy-MM-dd"),
        startTime: pd.startTime,
        endTime: pd.endTime,
      }));

      // Create the request object
      await sendTutoringRequest({
        sessionId: session.id,
        message: data.message,
        preferredDates: formattedPreferredDates,
      });

      onOpenChange(false);
    } catch (err) {
      console.error("Failed to send tutoring request:", err);
      setError(
        err instanceof Error
          ? err.message
          : "A apărut o eroare la trimiterea cererii."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the preferred dates from the form
  const preferredDates = form.watch("preferredDates");

  // Add a new preferred date
  const addPreferredDate = () => {
    const currentPreferredDates = form.getValues("preferredDates");

    form.setValue("preferredDates", [
      ...currentPreferredDates,
      {
        date: addDays(new Date(), 1),
        startTime: "10:00",
        endTime: "11:00",
      },
    ]);
  };

  // Remove a preferred date
  const removePreferredDate = (index: number) => {
    const currentPreferredDates = form.getValues("preferredDates");

    if (currentPreferredDates.length > 1) {
      form.setValue(
        "preferredDates",
        currentPreferredDates.filter((_, i) => i !== index)
      );
    }
  };

  // Generate time options (from 8:00 to 20:00)
  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cerere de tutoriat</DialogTitle>
          <DialogDescription>
            Trimite o cerere către {teacherName} pentru a programa o sesiune de
            tutoriat la {subject}.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mesaj pentru profesor</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrie ce dorești să înveți în această sesiune..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Date preferate</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPreferredDate}
                >
                  Adaugă dată
                </Button>
              </div>

              {preferredDates.map((_, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-medium">
                      Opțiunea {index + 1}
                    </h5>
                    {preferredDates.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePreferredDate(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`preferredDates.${index}.date`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ro })
                                ) : (
                                  <span>Alege o dată</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              locale={ro}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`preferredDates.${index}.startTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ora de început</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează ora" />
                                <Clock className="h-4 w-4 ml-2 opacity-50" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`preferredDates.${index}.endTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ora de sfârșit</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează ora" />
                                <Clock className="h-4 w-4 ml-2 opacity-50" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Anulează
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#13361C] hover:bg-[#13361C]/90 text-white"
              >
                {isSubmitting ? "Se trimite..." : "Trimite cererea"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TutoringRequestForm;
