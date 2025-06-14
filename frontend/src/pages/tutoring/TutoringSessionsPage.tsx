import TutorCard from "@/components/tutoring/TutorCard";
import TutorProfileModal from "@/components/tutoring/TutorProfileModal";
import TutoringLoadingState from "@/components/tutoring/TutoringLoadingState";
import TutoringRequestForm from "@/components/tutoring/TutoringRequestForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useTutoringContext } from "@/contexts/TutoringContext";
import { TutoringLocationType, TutoringSession } from "@/types/tutoring";
import { Filter, Search, X } from "lucide-react";
import React, { useState } from "react";

const TutoringSessionsPage = () => {
  const {
    filteredSessions,
    isLoading,
    error,
    searchTerm,
    subjectFilter,
    locationFilter,
    priceRange,
    priceSort,
    isProfileModalOpen,
    isRequestDialogOpen,
    selectedSession,
    setSearchTerm,
    setSubjectFilter,
    setLocationFilter,
    setPriceRange,
    setPriceSort,
    resetFilters,
    openProfileModal,
    closeProfileModal,
    openRequestDialog,
    closeRequestDialog,
  } = useTutoringContext();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // List of available subjects (normally this would come from the API)
  const subjects = [
    "Matematică",
    "Fizică",
    "Chimie",
    "Biologie",
    "Informatică",
    "Limba Română",
    "Limba Engleză",
    "Istorie",
    "Geografie",
    "Economie",
  ];

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle view profile
  const handleViewProfile = (session: TutoringSession) => {
    openProfileModal(session);
  };

  // Handle contact tutor
  const handleContactTutor = (session: TutoringSession) => {
    openRequestDialog(session);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    resetFilters();
    setIsFilterOpen(false);
  };

  // Format price range for display
  const formatPriceRange = (range: [number, number]): string => {
    return `${range[0]} RON - ${range[1]} RON`;
  };

  // Count active filters
  const countActiveFilters = (): number => {
    let count = 0;
    if (subjectFilter !== "all") count++;
    if (locationFilter !== "all") count++;
    if (priceRange[0] > 0 || priceRange[1] < 200) count++;
    if (priceSort !== "none") count++;
    return count;
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sesiuni de tutoriat</h1>
          <p className="text-gray-600">
            Găsește profesori pentru sesiuni de tutoriat personalizate
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Caută după materie, profesor sau descriere..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtrează</span>
                {countActiveFilters() > 0 && (
                  <Badge className="ml-1 bg-[#13361C]">
                    {countActiveFilters()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filtre</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-[#13361C] hover:text-[#13361C]/80"
                  >
                    Resetează
                  </Button>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Materie
                    </label>
                    <Select
                      value={subjectFilter}
                      onValueChange={setSubjectFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toate materiile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toate materiile</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem
                            key={subject}
                            value={subject.toLowerCase()}
                          >
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Locație
                    </label>
                    <Select
                      value={locationFilter}
                      onValueChange={(value) =>
                        setLocationFilter(value as TutoringLocationType | "all")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toate locațiile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toate locațiile</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">În persoană</SelectItem>
                        <SelectItem value="both">Ambele</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Preț pe oră: {formatPriceRange(priceRange)}
                    </label>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={200}
                      step={5}
                      onValueChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      className="py-4"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Sortare după preț
                    </label>
                    <Select
                      value={priceSort}
                      onValueChange={(value) =>
                        setPriceSort(value as "asc" | "desc" | "none")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Fără sortare" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Fără sortare</SelectItem>
                        <SelectItem value="asc">Preț crescător</SelectItem>
                        <SelectItem value="desc">Preț descrescător</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-6 border-t mt-6">
                  <Button
                    className="w-full bg-[#13361C] hover:bg-[#13361C]/90 text-white"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Aplică filtrele
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {countActiveFilters() > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Filtre active:</span>
            {subjectFilter !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                {subjects.find((s) => s.toLowerCase() === subjectFilter)}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => setSubjectFilter("all")}
                />
              </Badge>
            )}
            {locationFilter !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                {locationFilter === "online"
                  ? "Online"
                  : locationFilter === "offline"
                  ? "În persoană"
                  : "Ambele"}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => setLocationFilter("all")}
                />
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 200) && (
              <Badge variant="outline" className="flex items-center gap-1">
                {formatPriceRange(priceRange)}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => setPriceRange([0, 200])}
                />
              </Badge>
            )}
            {priceSort !== "none" && (
              <Badge variant="outline" className="flex items-center gap-1">
                {priceSort === "asc" ? "Preț crescător" : "Preț descrescător"}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => setPriceSort("none")}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-[#13361C] hover:text-[#13361C]/80 h-7 px-2"
            >
              Resetează toate
            </Button>
          </div>
        )}

        <Separator />

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Eroare</AlertTitle>
            <AlertDescription>
              {error.message ||
                "A apărut o eroare la încărcarea sesiunilor de tutoriat. Încearcă din nou mai târziu."}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <TutoringLoadingState count={6} type="tutor" />
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              Nu am găsit sesiuni care să corespundă criteriilor tale
            </h3>
            <p className="text-gray-500 mb-4">
              Încearcă să modifici filtrele sau să folosești alte cuvinte cheie
            </p>
            <Button onClick={handleResetFilters}>Resetează filtrele</Button>
          </div>
        )}
      </div>

      {selectedSession && (
        <>
          <TutorProfileModal
            session={selectedSession}
            open={isProfileModalOpen}
            onOpenChange={closeProfileModal}
            onContact={() => openRequestDialog(selectedSession)}
          />

          <TutoringRequestForm
            session={selectedSession}
            open={isRequestDialogOpen}
            onOpenChange={closeRequestDialog}
          />
        </>
      )}
    </div>
  );
};

export default TutoringSessionsPage;
