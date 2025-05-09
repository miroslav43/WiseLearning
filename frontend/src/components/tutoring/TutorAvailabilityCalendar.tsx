
import React from 'react';
import { TutoringAvailability } from '@/types/tutoring';

interface TutorAvailabilityCalendarProps {
  availability: TutoringAvailability[];
}

const TutorAvailabilityCalendar: React.FC<TutorAvailabilityCalendarProps> = ({ availability }) => {
  // Format day of week for display
  const getDayOfWeek = (day: number): string => {
    const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    return days[day];
  };
  
  // Group by day
  const groupedByDay: { [key: number]: TutoringAvailability[] } = {};
  
  availability.forEach(slot => {
    if (!groupedByDay[slot.dayOfWeek]) {
      groupedByDay[slot.dayOfWeek] = [];
    }
    groupedByDay[slot.dayOfWeek].push(slot);
  });
  
  // Create hours array (from 8AM to 8PM)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  
  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-8 gap-2">
          {/* Empty cell for hours column header */}
          <div className="border-b border-gray-200 p-2 text-center font-medium text-gray-500">
            Oră
          </div>
          
          {/* Day headers */}
          {[0, 1, 2, 3, 4, 5, 6].map(day => (
            <div 
              key={day} 
              className={`border-b border-gray-200 p-2 text-center font-medium ${
                groupedByDay[day] ? 'text-[#13361C]' : 'text-gray-400'
              }`}
            >
              {getDayOfWeek(day)}
            </div>
          ))}
          
          {/* Hours and availability cells */}
          {hours.map(hour => (
            <React.Fragment key={hour}>
              {/* Hour label */}
              <div className="border-b border-gray-100 p-2 text-center text-sm text-gray-500">
                {hour}:00
              </div>
              
              {/* Day cells */}
              {[0, 1, 2, 3, 4, 5, 6].map(day => {
                const isAvailable = groupedByDay[day]?.some(slot => {
                  const startHour = parseInt(slot.startTime.split(':')[0]);
                  const endHour = parseInt(slot.endTime.split(':')[0]);
                  return hour >= startHour && hour < endHour;
                });
                
                return (
                  <div 
                    key={`${day}-${hour}`} 
                    className={`border-b border-gray-100 p-2 text-center ${
                      isAvailable 
                        ? 'bg-[#13361C]/10 text-[#13361C]' 
                        : 'bg-gray-50 text-gray-300'
                    }`}
                  >
                    {isAvailable ? '✓' : '-'}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-gray-500 text-center">
          ✓ - Profesor disponibil | - - Profesor indisponibil
        </div>
      </div>
    </div>
  );
};

export default TutorAvailabilityCalendar;
