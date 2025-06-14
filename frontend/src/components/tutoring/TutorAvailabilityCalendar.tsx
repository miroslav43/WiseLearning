import { Card, CardContent } from "@/components/ui/card";
import { useTutoringContext } from "@/contexts/TutoringContext";
import { AvailabilitySlot } from "@/types/tutoring";
import React from "react";

interface TutorAvailabilityCalendarProps {
  availability: AvailabilitySlot[];
}

const TutorAvailabilityCalendar: React.FC<TutorAvailabilityCalendarProps> = ({
  availability,
}) => {
  const { getDayOfWeek } = useTutoringContext();

  // Create a 2D array representing the weekly calendar
  // Hours from 8:00 to 20:00 (8am to 8pm)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  // Days of week (0 = Sunday, 6 = Saturday)
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 0]; // Starting with Monday

  // Helper to check if a slot is available
  const isSlotAvailable = (day: number, hour: number): boolean => {
    return availability.some((slot) => {
      // Parse start and end times
      const startHour = parseInt(slot.startTime.split(":")[0]);
      const endHour = parseInt(slot.endTime.split(":")[0]);

      // Check if this slot includes the current hour
      return slot.dayOfWeek === day && hour >= startHour && hour < endHour;
    });
  };

  // Helper to get time string
  const getTimeString = (hour: number): string => {
    return `${hour}:00`;
  };

  // If no availability data, show a message
  if (!availability || availability.length === 0) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">
            Nu există disponibilitate setată pentru acest profesor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border bg-gray-50"></th>
            {daysOfWeek.map((day) => (
              <th
                key={day}
                className="p-2 border bg-gray-50 text-center font-medium"
              >
                {getDayOfWeek(day)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="p-2 border text-center text-sm text-gray-600">
                {getTimeString(hour)}
              </td>
              {daysOfWeek.map((day) => (
                <td
                  key={`${day}-${hour}`}
                  className={`p-2 border text-center ${
                    isSlotAvailable(day, hour)
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {isSlotAvailable(day, hour) ? "✓" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-100 border border-green-200"></div>
          <span>Disponibil</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200"></div>
          <span>Indisponibil</span>
        </div>
      </div>
    </div>
  );
};

export default TutorAvailabilityCalendar;
