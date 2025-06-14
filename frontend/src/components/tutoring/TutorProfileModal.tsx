import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useTutoringContext } from "@/contexts/TutoringContext";
import { useTutoringService } from "@/services/tutoringService";
import { TutoringReview, TutoringSession } from "@/types/tutoring";
import { Calendar, Clock, Mail, MapPin, Plus, Star, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import TutorAvailabilityCalendar from "./TutorAvailabilityCalendar";
import TutoringReviewForm from "./TutoringReviewForm";
import TutoringReviews from "./TutoringReviews";

interface TutorProfileModalProps {
  session: TutoringSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContact: () => void;
}

const TutorProfileModal: React.FC<TutorProfileModalProps> = ({
  session,
  open,
  onOpenChange,
  onContact,
}) => {
  const [activeTab, setActiveTab] = useState("about");
  const [reviews, setReviews] = useState<TutoringReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { getDayOfWeek, formatLocationType } = useTutoringContext();
  const { getTutoringReviewsBySessionId } = useTutoringService();
  const { user } = useAuth();

  // Fetch reviews when the modal opens and the session changes
  useEffect(() => {
    if (open && session?.id && activeTab === "reviews") {
      fetchReviews();
    }
  }, [open, session?.id, activeTab]);

  // Fetch reviews for the session
  const fetchReviews = async () => {
    if (!session?.id) return;

    setIsLoadingReviews(true);
    setError(null);

    try {
      const sessionReviews = await getTutoringReviewsBySessionId(session.id);
      setReviews(sessionReviews);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch reviews")
      );
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Generate avatar initials with null safety
  const getInitials = (name?: string): string => {
    if (!name || typeof name !== "string") {
      return "PN"; // Profesor Necunoscut
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get avatar URL with fallback and null safety
  const getAvatarUrl = (name?: string, avatar?: string): string => {
    const safeName = name || "Profesor Necunoscut";
    return (
      avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        safeName
      )}&background=ffffff&color=13361C`
    );
  };

  // Handle contact button click
  const handleContact = () => {
    onContact();
    onOpenChange(false);
  };

  const handleReviewAdded = () => {
    setShowReviewForm(false);
    fetchReviews(); // Refresh reviews
  };

  // Helper functions for safe data access
  const teacherName = session.teacherName || "Profesor necunoscut";
  const teacherAvatar = session.teacherAvatar;
  const subject = session.subject || "Materie necunoscută";
  const pricePerHour = session.pricePerHour || session.hourlyRate || 0;
  const locationType = session.locationType || "online";
  const rating = session.rating ?? 0;
  const reviewsCount = session.reviews?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Sidebar */}
          <div className="bg-[#13361C] text-white p-6 flex flex-col">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-white text-xl font-bold">
                Detalii profesor
              </DialogTitle>
              <DialogDescription className="text-white/80">
                Informații complete despre profesor și sesiunile disponibile
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center py-6">
              <Avatar className="h-24 w-24 border-4 border-white/10">
                <AvatarImage
                  src={getAvatarUrl(teacherName, teacherAvatar)}
                  alt={teacherName}
                />
                <AvatarFallback className="bg-white/10">
                  {getInitials(teacherName)}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{teacherName}</h2>
              <p className="text-white/80">{subject}</p>

              {session.rating !== undefined && (
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  <span className="text-white/70 text-sm">
                    ({reviewsCount} recenzii)
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4 mt-4 flex-grow">
              <div className="flex items-center gap-3">
                <Badge className="bg-white text-[#13361C]">
                  {pricePerHour} RON/oră
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  {formatLocationType(locationType)}
                </Badge>
              </div>

              <Separator className="bg-white/20" />

              <div className="space-y-3">
                <h3 className="font-semibold text-white/90">Disponibilitate</h3>
                {session.availability && session.availability.length > 0 ? (
                  <div className="space-y-2">
                    {session.availability.map((slot, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Calendar className="h-4 w-4 text-white/70" />
                        <span>{getDayOfWeek(slot.dayOfWeek)}</span>
                        <Clock className="h-4 w-4 ml-2 text-white/70" />
                        <span>
                          {slot.startTime}-{slot.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/70 text-sm">
                    Nu este specificată disponibilitatea.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="w-full bg-white text-[#13361C] hover:bg-white/90"
                onClick={handleContact}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contactează profesor
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-2 overflow-hidden flex flex-col max-h-[80vh]">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-col h-full"
            >
              <div className="px-6 pt-6 border-b">
                <TabsList className="grid grid-cols-3 w-full mb-2">
                  <TabsTrigger value="about">Despre</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="reviews">Recenzii</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-grow px-6 py-4">
                <TabsContent value="about" className="mt-0 h-full">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Despre sesiune
                      </h3>
                      <p className="text-gray-700">
                        {session.description ||
                          "Nu există descriere disponibilă"}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        De ce să alegi această sesiune
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="bg-[#13361C]/10 p-1 rounded-full mt-0.5">
                            <User className="h-4 w-4 text-[#13361C]" />
                          </div>
                          <div className="text-gray-700">
                            Profesor cu experiență în predarea {subject}
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="bg-[#13361C]/10 p-1 rounded-full mt-0.5">
                            <Clock className="h-4 w-4 text-[#13361C]" />
                          </div>
                          <div className="text-gray-700">
                            Flexibilitate în programarea sesiunilor, conform
                            disponibilității tale
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="bg-[#13361C]/10 p-1 rounded-full mt-0.5">
                            <MapPin className="h-4 w-4 text-[#13361C]" />
                          </div>
                          <div className="text-gray-700">
                            Sesiuni{" "}
                            {formatLocationType(locationType).toLowerCase()}{" "}
                            pentru confort maxim
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="calendar" className="mt-0 h-full">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Disponibilitate săptămânală
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Vizualizează disponibilitatea profesorului și alege
                      intervalul care ți se potrivește.
                    </p>

                    <TutorAvailabilityCalendar
                      availability={session.availability || []}
                    />

                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2">Notă:</h4>
                      <p className="text-sm text-gray-600">
                        După ce trimiți o cerere de tutoriat, vei putea discuta
                        direct cu profesorul pentru a stabili data și ora exactă
                        a sesiunii.
                      </p>

                      {user && user.id !== session.teacherId && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600 mb-2">
                            Ai lucrat deja cu acest profesor?
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveTab("reviews");
                              setShowReviewForm(true);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Star className="h-4 w-4" />
                            Lasă o recenzie
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 h-full">
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>
                        {error.message ||
                          "Nu am putut încărca recenziile. Încearcă din nou mai târziu."}
                      </AlertDescription>
                    </Alert>
                  )}

                  {isLoadingReviews ? (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-32 mb-4" />
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="p-4 border rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-5 w-32" />
                            </div>
                            <div className="flex mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Skeleton key={star} className="h-4 w-4 mr-1" />
                              ))}
                            </div>
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-5/6 mb-1" />
                            <Skeleton className="h-4 w-4/6" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Recenzii și feedback
                        </h3>

                        {user && user.id !== session.teacherId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Adaugă recenzie
                          </Button>
                        )}
                      </div>

                      {showReviewForm && user && (
                        <div className="mb-6">
                          <TutoringReviewForm
                            sessionId={session.id}
                            teacherName={teacherName}
                            onReviewAdded={handleReviewAdded}
                          />
                        </div>
                      )}

                      {reviews.length > 0 ? (
                        <TutoringReviews reviews={reviews} />
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600 mb-4">
                            Nu există recenzii disponibile pentru această
                            sesiune.
                          </p>
                          {user &&
                            user.id !== session.teacherId &&
                            !showReviewForm && (
                              <Button
                                variant="outline"
                                onClick={() => setShowReviewForm(true)}
                              >
                                Fii primul care lasă o recenzie
                              </Button>
                            )}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorProfileModal;
