
import React from 'react';
import { Subject } from '@/types/course';
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  History, 
  Languages, 
  Microscope, 
  Monitor, 
  BookIcon
} from 'lucide-react';

export const getSubjectLabel = (subject: Subject): string => {
  const labels: Record<Subject, string> = {
    'computer-science': 'Informatică',
    'romanian': 'Limba Română',
    'mathematics': 'Matematică',
    'history': 'Istorie',
    'biology': 'Biologie',
    'geography': 'Geografie',
    'physics': 'Fizică',
    'chemistry': 'Chimie',
    'english': 'Limba Engleză',
    'french': 'Limba Franceză',
    'other': 'Alte materii'
  };
  
  return labels[subject] || 'Necunoscut';
};

// Fixed version of formatSubjectName that handles string subjects
export const formatSubjectName = (subject: string | Subject): string => {
  if (typeof subject === 'string') {
    // Define the mapping for string values that might not be in Subject type
    const subjectLabels: Record<string, string> = {
      'computer-science': 'Informatică',
      'romanian': 'Limba Română',
      'mathematics': 'Matematică',
      'history': 'Istorie',
      'biology': 'Biologie',
      'geography': 'Geografie',
      'physics': 'Fizică',
      'chemistry': 'Chimie',
      'english': 'Limba Engleză',
      'french': 'Limba Franceză',
      'other': 'Alte materii'
    };
    
    return subjectLabels[subject] || subject;
  }
  return getSubjectLabel(subject);
};

export const getSubjectIcon = (subject: string | Subject) => {
  // Convert the subject to a safe type
  const safeSubject = typeof subject === 'string' ? subject : subject;
  
  // Define the mapping for string values
  const icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    'computer-science': Monitor,
    'romanian': BookOpen,
    'mathematics': Calculator,
    'history': History,
    'biology': Microscope,
    'geography': Globe,
    'physics': Calculator,
    'chemistry': Microscope,
    'english': Languages,
    'french': Languages,
    'other': BookIcon
  };
  
  return icons[safeSubject] || BookIcon;
};
