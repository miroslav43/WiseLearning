import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import * as teacherService from "@/services/teacherService";
import { Teacher } from "@/types/user";
import { Check, Loader2, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const TeacherProfileEditPage: React.FC = () => {
  const { user, updateTeacherProfile: updateAuthTeacherProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [certificates, setCertificates] = useState<string[]>([]);
  const [newCertificate, setNewCertificate] = useState("");
  const [scheduleItems, setScheduleItems] = useState<
    Array<{ day: string; hours: string }>
  >([]);
  const [newScheduleDay, setNewScheduleDay] = useState("");
  const [newScheduleHours, setNewScheduleHours] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      bio: "",
      education: "",
      experience: "",
    },
  });

  useEffect(() => {
    // Check if user is a teacher
    if (!user || user.role !== "teacher") {
      navigate("/");
      toast({
        title: "Acces restricționat",
        description: "Trebuie să fii profesor pentru a accesa această pagină.",
        variant: "destructive",
      });
      return;
    }

    // Fetch teacher profile data
    const fetchTeacherProfile = async () => {
      try {
        setLoading(true);
        const teacherProfile = await teacherService.getMyTeacherProfile();

        // Update form with teacher data
        form.reset({
          name: `${teacherProfile.firstName} ${teacherProfile.lastName}`,
          bio: teacherProfile.bio || "",
          education: teacherProfile.education || "",
          experience:
            typeof teacherProfile.experience === "string"
              ? teacherProfile.experience
              : `${teacherProfile.experience || 0} ani`,
        });

        // Set specializations
        if (teacherProfile.specialization) {
          setSpecializations(teacherProfile.specialization);
        }

        // Set certificates
        if (teacherProfile.certificates) {
          setCertificates(
            Array.isArray(teacherProfile.certificates)
              ? teacherProfile.certificates.map((cert) =>
                  typeof cert === "string" ? cert : cert.title
                )
              : []
          );
        }

        // Set schedule items
        if (teacherProfile.schedule) {
          setScheduleItems(teacherProfile.schedule);
        } else {
          // Default schedule if none exists
          setScheduleItems([
            { day: "Luni", hours: "14:00 - 20:00" },
            { day: "Marți", hours: "14:00 - 20:00" },
            { day: "Miercuri", hours: "16:00 - 21:00" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch teacher profile:", error);
        toast({
          title: "Eroare",
          description:
            "Nu am putut încărca profilul tău. Te rugăm să încerci din nou.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [user, navigate, toast, form]);

  const onSubmit = async (data: any) => {
    if (!user) return;

    try {
      setSubmitting(true);

      // Split name into firstName and lastName
      const nameParts = data.name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      // Prepare teacher data
      const teacherData: Partial<Teacher> = {
        firstName,
        lastName,
        bio: data.bio,
        education: data.education,
        experience: data.experience,
        specialization: specializations,
        certificates: certificates,
        schedule: scheduleItems,
      };

      // Update teacher profile
      await teacherService.updateTeacherProfile(teacherData);

      // Update auth context to reflect changes
      await updateAuthTeacherProfile(teacherData);

      toast({
        title: "Profil actualizat",
        description: "Profilul tău a fost actualizat cu succes.",
        variant: "default",
      });

      // Redirect to teacher profile page
      navigate("/teacher/profile");
    } catch (error) {
      console.error("Failed to update teacher profile:", error);
      toast({
        title: "Eroare",
        description:
          "Nu am putut actualiza profilul tău. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addSpecialization = () => {
    if (
      newSpecialization.trim() &&
      !specializations.includes(newSpecialization.trim())
    ) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  const addCertificate = () => {
    if (
      newCertificate.trim() &&
      !certificates.includes(newCertificate.trim())
    ) {
      setCertificates([...certificates, newCertificate.trim()]);
      setNewCertificate("");
    }
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const addScheduleItem = () => {
    if (newScheduleDay.trim() && newScheduleHours.trim()) {
      setScheduleItems([
        ...scheduleItems,
        {
          day: newScheduleDay.trim(),
          hours: newScheduleHours.trim(),
        },
      ]);
      setNewScheduleDay("");
      setNewScheduleHours("");
    }
  };

  const removeScheduleItem = (index: number) => {
    setScheduleItems(scheduleItems.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600 mb-4" />
          <p className="text-muted-foreground">Se încarcă profilul tău...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/teacher/profile")}
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
                <AvatarImage src={user?.avatar} alt={user?.name || "Profil"} />
                <AvatarFallback className="bg-brand-500 text-white">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "TP"}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription>Profesor</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Actualizează-ți informațiile pentru a-ți personaliza profilul și
                pentru a ajuta elevii să te găsească mai ușor.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Sfaturi pentru profilul tău
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Fotografie profesională</h4>
                <p className="text-sm text-muted-foreground">
                  Adaugă o fotografie clară care să îți inspire încredere și
                  profesionalism.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Biografie completă</h4>
                <p className="text-sm text-muted-foreground">
                  Descrie-ți experiența, abordarea didactică și materiile pe
                  care le predai.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Certificări relevante</h4>
                <p className="text-sm text-muted-foreground">
                  Adaugă diplomele și certificările care îți atestă expertiza în
                  domeniu.
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
                Completează informațiile de mai jos pentru a-ți actualiza
                profilul de profesor.
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
                            <Input
                              placeholder="Numele tău complet"
                              {...field}
                            />
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
                    <h3 className="text-lg font-medium">
                      Educație și Experiență
                    </h3>

                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Educație</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Universitatea București, Facultatea de Matematică"
                              {...field}
                            />
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
                            <Input
                              placeholder="Ex: 5+ ani experiență în predare"
                              {...field}
                            />
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
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 bg-brand-100 text-brand-700"
                        >
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
                        <div
                          key={index}
                          className="flex items-start justify-between border p-2 rounded-md"
                        >
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
                        <div
                          key={index}
                          className="flex items-center justify-between border p-2 rounded-md"
                        >
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
                    onClick={() => navigate("/teacher/profile")}
                  >
                    Anulare
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Salvează modificările
                  </Button>
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
