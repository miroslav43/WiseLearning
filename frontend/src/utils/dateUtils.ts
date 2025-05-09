
import { format, formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(new Date(date), 'dd.MM.yyyy', { locale: ro });
};

export const formatDateTime = (date: Date): string => {
  return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: ro });
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ro });
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minute`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'oră' : 'ore'}`;
  }
  
  return `${hours} ${hours === 1 ? 'oră' : 'ore'} și ${remainingMinutes} minute`;
};
