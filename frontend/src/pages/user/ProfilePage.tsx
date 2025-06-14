import ProfileAchievements from "@/components/achievements/ProfileAchievements";
import ProfileCertificates from "@/components/certificates/ProfileCertificates";
import PointsDisplay from "@/components/points/PointsDisplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubscriptionCard from "@/components/user/SubscriptionCard";
import UserBundleCard from "@/components/user/UserBundleCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  mockUserBundles,
  mockUserSubscriptions,
} from "@/data/mockSubscriptionData";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, CreditCard, Mail, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cont inaccesibil</h1>
          <p>Te rugăm să te autentifici pentru a-ți accesa profilul.</p>
        </div>
      </div>
    );
  }

  // Safe name getter function
  const getUserName = (user: any) => {
    // First check if we have the full name
    if (user.name && user.name !== "undefined undefined") {
      return user.name;
    }

    // If firstName and lastName exist separately (legacy)
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    // Fallback to individual parts
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;

    // Last fallback
    return "Utilizator";
  };

  // Extract firstName from name
  const getFirstName = (user: any) => {
    if (user.firstName) return user.firstName;
    if (user.name && user.name !== "undefined undefined") {
      return user.name.split(" ")[0] || "";
    }
    return "";
  };

  // Extract lastName from name
  const getLastName = (user: any) => {
    if (user.lastName) return user.lastName;
    if (user.name && user.name !== "undefined undefined") {
      const nameParts = user.name.split(" ");
      return nameParts.slice(1).join(" ") || "";
    }
    return "";
  };

  // Safe function to get user initials
  const getUserInitials = (userName: string) => {
    if (!userName) return "U";
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Safe avatar getter function
  const getUserAvatar = (user: any) => {
    return user.avatar || user.avatarUrl || "";
  };

  const userName = getUserName(user);
  const userInitials = getUserInitials(userName);
  const userAvatar = getUserAvatar(user);
  const firstName = getFirstName(user);
  const lastName = getLastName(user);

  // Format the createdAt date safely
  const formatDate = (dateValue: string | Date) => {
    if (!dateValue) return "N/A";

    try {
      // If it's already a Date object, use it directly
      if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString();
      }
      // Otherwise convert the string to a Date object
      return new Date(dateValue).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data necunoscută";
    }
  };

  // Get subscriptions and bundles for this user
  const userSubscriptions = mockUserSubscriptions.filter(
    (sub) => sub.userId === user.id && sub.isActive
  );
  const userBundles = mockUserBundles.filter(
    (bundle) => bundle.userId === user.id
  );

  const handleManageSubscription = () => {
    toast({
      title: "Funcționalitate demonstrativă",
      description:
        "Într-o aplicație reală, ai fi redirecționat către pagina de management a abonamentului.",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Profilul meu</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="text-xl bg-brand-500 text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{userName}</CardTitle>
              <CardDescription>
                {user.role === "student"
                  ? "Elev/Student"
                  : user.role === "teacher"
                  ? "Profesor"
                  : "Administrator"}
              </CardDescription>
              <div className="mt-2 flex justify-center">
                <PointsDisplay />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 opacity-70" />
                  <span>Membru din {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 opacity-70" />
                  <span>{user.email}</span>
                </div>
                {user.role === "student" && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 opacity-70" />
                    <span>
                      {(user as any).enrolledCourses?.length || 0} cursuri
                      înscrise
                    </span>
                  </div>
                )}
                {user.role === "teacher" && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 opacity-70" />
                    <span>
                      {(user as any).courses?.length || 0} cursuri create
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Editează profilul
              </Button>
            </CardFooter>
          </Card>

          {/* Subscriptions section for students */}
          {user.role === "student" && userSubscriptions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Abonamentul meu</h2>
              <SubscriptionCard
                subscription={userSubscriptions[0]}
                onManage={handleManageSubscription}
              />

              {userBundles.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Pachetele mele</h2>
                  <div className="space-y-4">
                    {userBundles.map((bundle) => (
                      <UserBundleCard key={bundle.id} userBundle={bundle} />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Link to="/subscriptions">
                  <Button variant="default" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Gestionează abonamente și pachete
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {user.role === "student" && (
            <div className="mt-6 space-y-6">
              <ProfileAchievements />
              <ProfileCertificates />
            </div>
          )}

          {/* Teacher-specific profile section */}
          {user.role === "teacher" && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profil Profesor</CardTitle>
                  <CardDescription>
                    Informații specifice pentru activitatea didactică
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Specializări</label>
                    <div className="flex flex-wrap gap-2">
                      {(user as any).teacherProfile?.specialization?.length >
                      0 ? (
                        (user as any).teacherProfile.specialization.map(
                          (spec: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-brand-100 text-brand-700 rounded-md text-sm"
                            >
                              {spec}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Nu sunt setate specializări
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Educație</label>
                    <div className="text-sm">
                      {(user as any).teacherProfile?.education ||
                        "Nu este setată"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experiență</label>
                    <div className="text-sm">
                      {(user as any).teacherProfile?.experience ||
                        "Nu este setată"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Certificări</label>
                    <div className="space-y-1">
                      {(user as any).teacherProfile?.certificates?.length >
                      0 ? (
                        (user as any).teacherProfile.certificates.map(
                          (cert: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
                              <span className="text-sm">{cert}</span>
                            </div>
                          )
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Nu sunt setate certificări
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-600">
                        {(user as any).teacherProfile?.rating?.toFixed(1) ||
                          "N/A"}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-600">
                        {(user as any).teacherProfile?.students || 0}
                      </div>
                      <div className="text-sm text-gray-600">Studenți</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/teacher/profile/edit" className="w-full">
                    <Button variant="default" className="w-full">
                      Completează profilul de profesor
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informații personale</CardTitle>
              <CardDescription>
                Modifică detaliile profilului tău
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    Prenume
                  </label>
                  <Input id="firstName" defaultValue={firstName} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Nume de familie
                  </label>
                  <Input id="lastName" defaultValue={lastName} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" defaultValue={user.email} />
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Biografie
                </label>
                <Textarea
                  id="bio"
                  defaultValue={user.bio || ""}
                  className="min-h-32"
                  placeholder="Spune-ne câteva cuvinte despre tine..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Anulează</Button>
              <Button>Salvează modificările</Button>
            </CardFooter>
          </Card>

          {/* Student-specific additional settings */}
          {user.role === "student" && (
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferințe de studiu</CardTitle>
                  <CardDescription>
                    Personalizează experiența ta de învățare
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Study preferences form content */}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Anulează</Button>
                  <Button>Salvează preferințele</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
