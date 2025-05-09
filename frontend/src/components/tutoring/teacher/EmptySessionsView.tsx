
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptySessionsViewProps {
  onCreateSession: () => void;
}

const EmptySessionsView: React.FC<EmptySessionsViewProps> = ({ onCreateSession }) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium mb-2">
        Nu ai nicio sesiune de tutoriat
      </h3>
      <p className="text-muted-foreground mb-6">
        Creează prima ta sesiune de tutoriat pentru a ajuta studenții.
      </p>
      <Button onClick={onCreateSession} className="gap-2">
        <Plus className="h-4 w-4" /> Creează sesiune nouă
      </Button>
    </div>
  );
};

export default EmptySessionsView;
