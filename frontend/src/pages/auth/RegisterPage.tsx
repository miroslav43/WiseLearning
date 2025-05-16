import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "Prenumele trebuie să aibă cel puțin 2 caractere" }),
    lastName: z
      .string()
      .min(2, { message: "Numele trebuie să aibă cel puțin 2 caractere" }),
    email: z.string().email({ message: "Adresa de email invalidă" }),
    password: z
      .string()
      .min(6, { message: "Parola trebuie să aibă cel puțin 6 caractere" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Parola trebuie să aibă cel puțin 6 caractere" }),
    role: z.enum(["student", "teacher"] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu corespund",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        data.role
      );
      toast({
        title: "Înregistrare reușită",
        description: "Contul tău a fost creat cu succes!",
      });
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "A apărut o eroare. Te rugăm să încerci din nou.";

      // Try to extract error message from the API response
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Înregistrare eșuată",
        description: errorMessage,
        variant: "destructive",
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
            <span className="text-2xl font-bold text-brand-600">
              WiseLearning
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Creează un cont nou
          </h2>
          <p className="mt-2 text-gray-600">
            Înregistrează-te pentru a accesa toate cursurile și materialele
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prenume</FormLabel>
                    <FormControl>
                      <Input placeholder="Prenume" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nume</FormLabel>
                    <FormControl>
                      <Input placeholder="Nume" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Input
                        type="password"
                        placeholder="Creează o parolă"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmă parola</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirmă parola"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tip de cont</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="student" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Sunt elev și vreau să învăț
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="teacher" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Sunt profesor și vreau să predau
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Sunt de acord cu{" "}
                  <Link
                    to="/terms"
                    className="font-medium text-brand-600 hover:text-brand-500"
                  >
                    Termenii și Condițiile
                  </Link>
                </label>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center gap-2"
                  disabled={isLoading}
                >
                  <UserPlus className="h-4 w-4" />
                  {isLoading ? "Se procesează..." : "Crează cont"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Ai deja cont?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Autentifică-te
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
