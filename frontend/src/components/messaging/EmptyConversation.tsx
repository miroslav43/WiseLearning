
import React from 'react';
import { MessageCircle } from 'lucide-react';

const EmptyConversation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <MessageCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">Nicio conversație selectată</h3>
      <p className="text-muted-foreground max-w-md">
        Selectează un contact din lista de conversații sau caută un nou contact pentru a începe o conversație.
      </p>
    </div>
  );
};

export default EmptyConversation;
