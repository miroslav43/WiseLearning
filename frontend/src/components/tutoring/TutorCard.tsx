import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTutoringContext } from "@/contexts/TutoringContext";
import { TutoringSession } from "@/types/tutoring";
import { formatSubjectName, getSubjectIcon } from "@/utils/subjectUtils";
import { Clock, MapPin, Star } from "lucide-react";
import React from "react";

interface TutorCardProps {
  session: TutoringSession;
  onViewProfile?: () => void;
  onContact?: () => void;
}

const TutorCard: React.FC<TutorCardProps> = ({
  session,
  onViewProfile,
  onContact,
}) => {
  const { formatLocationType } = useTutoringContext();

  // Use getSubjectIcon with the string subject - it's now updated to handle both string and Subject type
  const SubjectIcon = getSubjectIcon(session.subject);

  // Calculate how many days per week the tutor is available
  const availabilityDays = session.availability
    ? [...new Set(session.availability.map((a) => a.dayOfWeek))].length
    : 0;

  // Get rating information safely
  const rating = session.rating ?? 0;
  const hasRating = session.rating !== undefined && session.rating > 0;

  // Safely get teacher name with fallback
  const teacherName = session.teacherName || "Profesor necunoscut";

  // Safely get other properties with fallbacks
  const pricePerHour = session.pricePerHour || 0;
  const subject = session.subject || "Materie necunoscută";
  const locationType = session.locationType || "online";

  // Use avatar with fallback
  const avatarSrc =
    session.teacherAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      teacherName
    )}&background=13361C&color=fff`;

  // Handle click events
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile();
    }
  };

  const handleContact = () => {
    if (onContact) {
      onContact();
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border border-gray-200 hover:border-[#13361C]/20">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-[#13361C]/90 to-[#212717]/80"></div>
        <Avatar className="absolute -bottom-6 left-4 h-16 w-16 border-4 border-white shadow-sm">
          <AvatarImage src={avatarSrc} alt={teacherName} />
          <AvatarFallback className="bg-[#13361C]/10 text-[#13361C]">
            {teacherName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Badge className="absolute top-4 right-4 bg-white text-[#13361C]">
          {pricePerHour} RON/oră
        </Badge>
      </div>

      <CardContent className="pt-10 pb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {teacherName}
            </h3>
            <p className="text-[#13361C] font-medium">
              {formatSubjectName(subject)}
            </p>
          </div>
          {hasRating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {session.description || "Nicio descriere disponibilă"}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>{availabilityDays} zile/săptămână</span>
          </div>
          <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
            <MapPin className="h-3 w-3" />
            <span>{formatLocationType(locationType)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          className="flex-1 border-gray-300 hover:bg-gray-50 hover:text-[#13361C]"
          onClick={handleViewProfile}
        >
          Vezi profil
        </Button>
        <Button
          className="flex-1 bg-[#13361C] hover:bg-[#13361C]/90 text-white"
          onClick={handleContact}
        >
          Contactează
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TutorCard;
