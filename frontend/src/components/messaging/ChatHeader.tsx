
import React from 'react';
import { Contact } from '@/types/messaging';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatHeaderProps {
  contact: Contact;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{contact.name}</div>
          <div className="text-xs text-muted-foreground capitalize">
            {contact.role === 'teacher' ? 'Profesor' : 
             contact.role === 'student' ? 'Student' : 
             'Administrator'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
