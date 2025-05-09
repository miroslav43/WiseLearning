
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'switch';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  // Always light mode
  const theme = 'light';
  const toggleTheme = () => {
    // No-op function
    console.log('Dark mode has been removed from the application');
  };
  
  if (variant === 'switch') {
    return (
      <Toggle
        className={className}
        pressed={false}
        onPressedChange={toggleTheme}
      >
        <Sun className="h-4 w-4" />
        <span className="ml-2">Mod luminos</span>
      </Toggle>
    );
  }
  
  return (
    <Button
      variant={variant === 'outline' ? 'outline' : 'ghost'}
      size="sm"
      className={className}
      onClick={toggleTheme}
    >
      <Sun className="h-4 w-4" />
      <span className="ml-2 hidden sm:inline-block">
        Mod luminos
      </span>
    </Button>
  );
};
