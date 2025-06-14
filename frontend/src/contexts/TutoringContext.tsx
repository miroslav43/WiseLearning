import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTutoringService } from "@/services/tutoringService";
import {
  TutoringLocationType,
  TutoringReview,
  TutoringSession,
} from "@/types/tutoring";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface TutoringContextType {
  // Sessions state
  sessions: TutoringSession[];
  filteredSessions: TutoringSession[];
  isLoading: boolean;
  error: Error | null;
  selectedSession: TutoringSession | null;

  // Filters state
  searchTerm: string;
  subjectFilter: string;
  locationFilter: TutoringLocationType | "all";
  priceRange: [number, number];
  priceSort: "asc" | "desc" | "none";

  // Modal states
  isProfileModalOpen: boolean;
  isRequestDialogOpen: boolean;

  // Actions
  setSearchTerm: (term: string) => void;
  setSubjectFilter: (subject: string) => void;
  setLocationFilter: (location: TutoringLocationType | "all") => void;
  setPriceRange: (range: [number, number]) => void;
  setPriceSort: (sort: "asc" | "desc" | "none") => void;
  resetFilters: () => void;
  selectSession: (session: TutoringSession | null) => void;
  openProfileModal: (session: TutoringSession) => void;
  closeProfileModal: () => void;
  openRequestDialog: (session: TutoringSession) => void;
  closeRequestDialog: () => void;

  // Helper functions
  getTeacherSessions: (teacherId: string) => Promise<TutoringSession[]>;
  getSessionReviews: (sessionId: string) => Promise<TutoringReview[]>;
  sendTutoringRequest: (request: {
    sessionId: string;
    message: string;
    preferredDates: Array<{
      date: string;
      startTime: string;
      endTime: string;
    }>;
  }) => Promise<void>;
  formatLocationType: (type: string) => string;
  getDayOfWeek: (day: number) => string;
}

const TutoringContext = createContext<TutoringContextType | undefined>(
  undefined
);

export const TutoringProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    getApprovedTutoringSessions,
    getTeacherTutoringSessions,
    getTutoringReviewsBySessionId,
    createTutoringRequest,
  } = useTutoringService();
  const { toast } = useToast();
  const { user } = useAuth();

  // Sessions state
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TutoringSession[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedSession, setSelectedSession] =
    useState<TutoringSession | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState<
    TutoringLocationType | "all"
  >("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | "none">("none");

  // Modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  // Load sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const availableSessions = await getApprovedTutoringSessions();
        setSessions(availableSessions);
        setFilteredSessions(availableSessions);
      } catch (error) {
        console.error("Failed to fetch tutoring sessions:", error);
        setError(
          error instanceof Error
            ? error
            : new Error("Failed to fetch tutoring sessions")
        );
        toast({
          title: "Eroare",
          description:
            "Nu am putut încărca sesiunile disponibile. Încearcă din nou mai târziu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [getApprovedTutoringSessions, toast]);

  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...sessions];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (session) =>
          (session.subject?.toLowerCase() || "").includes(term) ||
          (session.teacherName?.toLowerCase() || "").includes(term) ||
          (session.description?.toLowerCase() || "").includes(term)
      );
    }

    // Apply subject filter
    if (subjectFilter !== "all") {
      result = result.filter((session) =>
        (session.subject?.toLowerCase() || "").includes(
          subjectFilter.toLowerCase()
        )
      );
    }

    // Apply location filter
    if (locationFilter !== "all") {
      result = result.filter(
        (session) =>
          session.locationType === locationFilter ||
          session.locationType === "both"
      );
    }

    // Apply price range filter
    result = result.filter((session) => {
      const price = session.pricePerHour || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply price sorting
    if (priceSort !== "none") {
      result.sort((a, b) => {
        const priceA = a.pricePerHour || 0;
        const priceB = b.pricePerHour || 0;
        if (priceSort === "asc") {
          return priceA - priceB;
        } else {
          return priceB - priceA;
        }
      });
    }

    setFilteredSessions(result);
  }, [
    sessions,
    searchTerm,
    subjectFilter,
    locationFilter,
    priceSort,
    priceRange,
  ]);

  // Helper function to reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSubjectFilter("all");
    setLocationFilter("all");
    setPriceRange([0, 200]);
    setPriceSort("none");
  };

  // Helper function to select a session
  const selectSession = (session: TutoringSession | null) => {
    setSelectedSession(session);
  };

  // Helper function to open profile modal
  const openProfileModal = (session: TutoringSession) => {
    setSelectedSession(session);
    setIsProfileModalOpen(true);
  };

  // Helper function to close profile modal
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  // Helper function to open request dialog
  const openRequestDialog = (session: TutoringSession) => {
    setSelectedSession(session);
    setIsRequestDialogOpen(true);
  };

  // Helper function to close request dialog
  const closeRequestDialog = () => {
    setIsRequestDialogOpen(false);
  };

  // Helper function to get teacher sessions
  const getTeacherSessions = async (
    teacherId: string
  ): Promise<TutoringSession[]> => {
    try {
      return await getTeacherTutoringSessions(teacherId);
    } catch (error) {
      console.error("Failed to fetch teacher sessions:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca sesiunile profesorului.",
        variant: "destructive",
      });
      return [];
    }
  };

  // Get session reviews
  const getSessionReviews = async (
    sessionId: string
  ): Promise<TutoringReview[]> => {
    try {
      const reviews = await getTutoringReviewsBySessionId(sessionId);
      return reviews;
    } catch (error) {
      // If reviews are not implemented yet (501) or not found (404), return empty array
      if (
        error instanceof Error &&
        (error.message.includes("Not implemented") ||
          error.message.includes("not found"))
      ) {
        console.warn(
          "Reviews feature not yet implemented for tutoring sessions"
        );
        return [];
      }
      console.error("Failed to fetch session reviews:", error);
      throw error;
    }
  };

  // Send tutoring request
  const sendTutoringRequest = async (request: {
    sessionId: string;
    message: string;
    preferredDates: Array<{
      date: string;
      startTime: string;
      endTime: string;
    }>;
  }): Promise<void> => {
    try {
      await createTutoringRequest({
        sessionId: request.sessionId,
        studentId: user!.id,
        studentName: user!.name,
        message: request.message,
        preferredDates: request.preferredDates,
      });

      toast({
        title: "Cerere trimisă",
        description: "Cererea ta de tutoriat a fost trimisă cu succes!",
      });
    } catch (error) {
      console.error("Failed to send tutoring request:", error);

      // Provide specific error messages based on the type of error
      let errorMessage = "Nu am putut trimite cererea. Încearcă din nou.";

      if (error instanceof Error) {
        if (error.message.includes("Resource not found")) {
          errorMessage =
            "Sesiunea de tutoriat nu a fost găsită. Această funcționalitate va fi disponibilă în curând.";
        } else if (error.message.includes("Not implemented")) {
          errorMessage =
            "Funcționalitatea de cereri de tutoriat va fi disponibilă în curând.";
        } else if (error.message.includes("Unauthorized")) {
          errorMessage =
            "Trebuie să fii autentificat pentru a trimite o cerere.";
        }
      }

      toast({
        title: "Eroare",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Helper function to format location type
  const formatLocationType = (type: string): string => {
    switch (type) {
      case "online":
        return "Online";
      case "offline":
        return "În persoană";
      case "both":
        return "Online & În persoană";
      default:
        return type;
    }
  };

  // Helper function to get day of week
  const getDayOfWeek = (day: number): string => {
    const days = [
      "Duminică",
      "Luni",
      "Marți",
      "Miercuri",
      "Joi",
      "Vineri",
      "Sâmbătă",
    ];
    return days[day] || "";
  };

  const contextValue: TutoringContextType = {
    sessions,
    filteredSessions,
    isLoading,
    error,
    selectedSession,
    searchTerm,
    subjectFilter,
    locationFilter,
    priceRange,
    priceSort,
    isProfileModalOpen,
    isRequestDialogOpen,
    setSearchTerm,
    setSubjectFilter,
    setLocationFilter,
    setPriceRange,
    setPriceSort,
    resetFilters,
    selectSession,
    openProfileModal,
    closeProfileModal,
    openRequestDialog,
    closeRequestDialog,
    getTeacherSessions,
    getSessionReviews,
    sendTutoringRequest,
    formatLocationType,
    getDayOfWeek,
  };

  return (
    <TutoringContext.Provider value={contextValue}>
      {children}
    </TutoringContext.Provider>
  );
};

export const useTutoringContext = (): TutoringContextType => {
  const context = useContext(TutoringContext);

  if (context === undefined) {
    throw new Error(
      "useTutoringContext must be used within a TutoringProvider"
    );
  }

  return context;
};
