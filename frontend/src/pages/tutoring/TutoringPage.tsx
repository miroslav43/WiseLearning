import SearchFilters from "@/components/tutoring/SearchFilters";
import TutorCard from "@/components/tutoring/TutorCard";
import TutorProfileModal from "@/components/tutoring/TutorProfileModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTutoringContext } from "@/contexts/TutoringContext";
import { ArrowRight, BookOpen, Clock, Search, Users } from "lucide-react";
import React, { useState } from "react";

const TutoringPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    sessions,
    filteredSessions,
    isLoading,
    selectedSession,
    searchTerm,
    subjectFilter,
    locationFilter,
    priceSort,
    priceRange,
    isProfileModalOpen,
    isRequestDialogOpen,
    setSearchTerm,
    setSubjectFilter,
    setLocationFilter,
    setPriceSort,
    setPriceRange,
    resetFilters,
    openProfileModal,
    closeProfileModal,
    openRequestDialog,
    closeRequestDialog,
    sendTutoringRequest,
  } = useTutoringContext();

  const [message, setMessage] = useState("");

  // Extract unique subjects for filter dropdown
  const uniqueSubjects = [
    ...new Set(
      sessions
        .filter((session) => session.subject)
        .map((session) => session.subject)
    ),
  ];

  // Stats for the top section
  const stats = [
    { label: "Profesori activi", value: sessions.length, icon: Users },
    {
      label: "Materii disponibile",
      value: uniqueSubjects.length,
      icon: BookOpen,
    },
    { label: "Sesiuni finalizate", value: "250+", icon: Clock },
  ];

  const handleViewProfile = (session: any) => {
    openProfileModal(session);
  };

  const handleContactTutor = (session: any) => {
    if (!user) {
      toast({
        title: "Autentificare necesară",
        description:
          "Trebuie să fii autentificat pentru a contacta un profesor.",
        variant: "destructive",
      });
      return;
    }

    openRequestDialog(session);
  };

  const handleSendRequest = async () => {
    if (!user || !selectedSession) return;

    try {
      await sendTutoringRequest({
        sessionId: selectedSession.id,
        studentId: user.id,
        studentName: user.name,
        studentAvatar: user.avatar,
        message: message,
        preferredDates: [],
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send tutoring request:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-[#13361C] to-[#212717] rounded-xl overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 py-16 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold mb-4">
                  Tutoriat Personalizat
                </h1>
                <p className="text-lg mb-6 opacity-90">
                  Învață cu cei mai buni profesori în sesiuni private adaptate
                  nevoilor tale. Îmbunătățește-ți performanțele școlare și
                  pregătește-te eficient pentru examene.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-[#13361C] hover:bg-gray-100 shadow-md"
                  >
                    Găsește un profesor
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative h-80">
                <div className="absolute -top-16 -right-16 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <img
                  src="/lovable-uploads/96091ce4-0627-453c-a4d8-5a6fd57a562c.png"
                  alt="Tutoring"
                  className="relative z-10 rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-[#13361C]/20 transition-all"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#13361C]/10 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-[#13361C]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#13361C]">
                      {stat.value}
                    </p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Search and Filters */}
      <section className="mb-8">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Găsește sesiunea perfectă</CardTitle>
            <CardDescription>
              Filtrează după materie, tip de sesiune și preț pentru a găsi
              profesorul potrivit pentru tine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              subjectFilter={subjectFilter}
              setSubjectFilter={setSubjectFilter}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              priceSort={priceSort}
              setPriceSort={setPriceSort}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              uniqueSubjects={uniqueSubjects}
              resetFilters={resetFilters}
            />
          </CardContent>
        </Card>
      </section>

      {/* Results */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredSessions.length}{" "}
            {filteredSessions.length === 1 ? "rezultat" : "rezultate"}{" "}
            disponibile
          </h2>
          <div className="flex items-center gap-2">
            <Tabs defaultValue="grid" className="w-auto">
              <TabsList className="bg-gray-100">
                <TabsTrigger
                  value="grid"
                  className="data-[state=active]:bg-white"
                >
                  <Users className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-white"
                >
                  <BookOpen className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <Card key={i} className="h-64 animate-pulse">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="bg-gray-200 h-1/3 rounded-t-lg"></div>
                  <div className="p-4 flex-grow">
                    <div className="bg-gray-200 h-4 w-2/3 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded mb-4"></div>
                    <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-full rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <TutorCard
                key={session.id}
                session={session}
                onViewProfile={() => handleViewProfile(session)}
                onContact={() => handleContactTutor(session)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Niciun rezultat găsit
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Nu am găsit sesiuni de tutoriat care să corespundă criteriilor
              tale de căutare.
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Resetează filtrele
            </Button>
          </div>
        )}
      </section>

      {/* Become a Tutor Section - Only show to non-teachers */}
      {user?.role !== "teacher" && (
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#13361C] to-[#212717] rounded-xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Devino profesor de tutoriat
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Împărtășește cunoștințele tale, ajută alți elevi să exceleze și
                obține venituri suplimentare în timpul liber.
              </p>
              <Button
                size="lg"
                className="bg-white text-[#13361C] hover:bg-gray-100 shadow-md"
              >
                Înscrie-te ca profesor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* How it Works Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Cum funcționează</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            WiseLearning facilitează procesul de găsire și conectare cu
            profesori de calitate pentru meditații personalizate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Caută profesorul potrivit",
              description:
                "Explorează profilurile profesorilor și filtrează în funcție de materie, preț și disponibilitate.",
              icon: Search,
            },
            {
              title: "Programează o sesiune",
              description:
                "Contactează profesorul și stabilește detaliile pentru prima sesiune de tutoriat.",
              icon: Clock,
            },
            {
              title: "Învață și progresează",
              description:
                "Primește meditații personalizate și îmbunătățește-ți performanțele academice.",
              icon: BookOpen,
            },
          ].map((step, index) => (
            <Card
              key={index}
              className="text-center border-gray-200 hover:border-[#13361C]/20 transition-all"
            >
              <CardContent className="pt-8">
                <div className="bg-[#13361C]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-[#13361C]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={closeRequestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#13361C]">
              Contactează profesorul
            </DialogTitle>
            <DialogDescription>
              Trimite un mesaj profesorului pentru a programa o sesiune de
              tutoriat
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-[#13361C]/10">
                <AvatarImage
                  src={
                    selectedSession?.teacherAvatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedSession?.teacherName || ""
                    )}&background=13361C&color=fff`
                  }
                  alt={selectedSession?.teacherName}
                />
                <AvatarFallback className="bg-[#13361C]/10 text-[#13361C]">
                  {selectedSession?.teacherName
                    ?.substring(0, 2)
                    .toUpperCase() || "TC"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-800">
                  {selectedSession?.teacherName}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedSession?.subject}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
              <div className="font-semibold text-gray-700">Preț:</div>
              <div className="text-[#13361C] font-medium">
                {selectedSession?.pricePerHour} RON / oră
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-800">
                Mesaj pentru profesor:
              </label>
              <Textarea
                placeholder="Descrie ce dorești să înveți, când ești disponibil, întrebări specifice etc."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="resize-none border-gray-300 focus:border-[#13361C] focus:ring-[#13361C]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeRequestDialog}>
              Anulează
            </Button>
            <Button
              onClick={handleSendRequest}
              disabled={!message.trim()}
              className="bg-[#13361C] hover:bg-[#13361C]/90"
            >
              Trimite cerere
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tutor Profile Modal */}
      {selectedSession && (
        <TutorProfileModal
          session={selectedSession}
          open={isProfileModalOpen}
          onOpenChange={closeProfileModal}
          onContact={() => {
            closeProfileModal();
            handleContactTutor(selectedSession);
          }}
        />
      )}
    </div>
  );
};

export default TutoringPage;
