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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, LogIn } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Adresa de email invalidă" }),
  password: z
    .string()
    .min(6, { message: "Parola trebuie să aibă cel puțin 6 caractere" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await login(data.email, data.password);
      toast({
        title: "Autentificare reușită",
        description: "Bine ai revenit!",
      });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Email sau parolă incorectă.";

      // Try to extract error message from the API response
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setLoginError(errorMessage);
      toast({
        title: "Autentificare eșuată",
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
            Autentificare
          </h2>
          <p className="mt-2 text-gray-600">
            Intră în cont pentru a accesa cursurile tale
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loginError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              </div>
            </div>
          )}

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
                      <Input
                        type="password"
                        placeholder="Introduceți parola"
                        {...field}
                      />
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
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Ține-mă minte
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-brand-600 hover:text-brand-500"
                  >
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
                  {isLoading ? "Se procesează..." : "Autentificare"}
                </Button>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Nu ai cont?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-brand-600 hover:text-brand-500"
                  >
                    Înregistrează-te
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
