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
import { TutoringRequest, TutoringSession } from "@/types/tutoring";
import { Calendar, Clock } from "lucide-react";
import React from "react";

interface TutoringRequestCardProps {
  request: TutoringRequest;
  sessions: TutoringSession[];
  onView: (request: TutoringRequest) => void;
}

const TutoringRequestCard: React.FC<TutoringRequestCardProps> = ({
  request,
  sessions,
  onView,
}) => {
  // Safe student name helper
  const getStudentName = () => request.studentName || "Student necunoscut";

  // Safe avatar initials helper
  const getAvatarInitials = () => {
    const name = getStudentName();
    return name.substring(0, 2).toUpperCase();
  };

  // Format preferred dates for display
  const formatPreferredDates = (dates: any[]) => {
    if (!dates || dates.length === 0) return "Nicio dată specificată";

    const formattedDate = new Date(dates[0]).toLocaleDateString();
    return dates.length > 1
      ? `${formattedDate} și încă ${dates.length - 1}`
      : formattedDate;
  };

  return (
    <Card key={request.id} className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={request.studentAvatar}
                alt={request.studentName}
              />
              <AvatarFallback>{getAvatarInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{getStudentName()}</CardTitle>
              <CardDescription className="text-xs">
                {request.studentId}
              </CardDescription>
            </div>
          </div>
          {request.status === "pending" && <Badge>În așteptare</Badge>}
          {request.status === "accepted" && (
            <Badge variant="secondary">Acceptat</Badge>
          )}
          {request.status === "rejected" && (
            <Badge variant="destructive">Respins</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-2 text-sm text-muted-foreground flex-grow">
        <p className="font-medium mb-1">
          Pentru:{" "}
          {sessions.find((s) => s.id === request.sessionId)?.subject ||
            "Sesiune necunoscută"}
        </p>
        <p className="line-clamp-2 mb-2">{request.message}</p>
        <div className="flex items-center mb-1">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Data: {new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            Disponibilitate: {formatPreferredDates(request.preferredDates)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => onView(request)}
        >
          Vezi detalii
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TutoringRequestCard;
