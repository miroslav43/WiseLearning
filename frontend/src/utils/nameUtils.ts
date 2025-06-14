/**
 * Utility functions for name processing and cleaning
 */

/**
 * Clean a student name by removing inappropriate "Elev" text
 * This handles cases where "Elev" has been accidentally inserted into names
 */
export const cleanStudentName = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return 'Student necunoscut';
  }

  // Remove "Elev" if it appears inappropriately in the middle of names
  // Common patterns: "MiroslavElev Maletici" -> "Miroslav Maletici"
  let cleanedName = name
    .replace(/([a-zA-ZăâîșțĂÂÎȘȚ]+)Elev(\s+[a-zA-ZăâîșțĂÂÎȘȚ]+)/g, '$1$2')
    .replace(/Elev([a-zA-ZăâîșțĂÂÎȘȚ]+)/g, '$1')
    .replace(/([a-zA-ZăâîșțĂÂÎȘȚ]+)Elev/g, '$1');

  // Clean up extra spaces
  cleanedName = cleanedName.replace(/\s+/g, ' ').trim();

  // If the name becomes empty or just "Elev", return fallback
  if (!cleanedName || cleanedName === 'Elev') {
    return 'Student necunoscut';
  }

  return cleanedName;
};

/**
 * Get initials from a cleaned name
 */
export const getNameInitials = (name: string): string => {
  const cleanedName = cleanStudentName(name);
  
  if (!cleanedName || cleanedName === 'Student necunoscut') {
    return 'SN';
  }

  return cleanedName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Format a name for display, ensuring it's properly cleaned
 */
export const formatDisplayName = (name: string): string => {
  return cleanStudentName(name);
}; 