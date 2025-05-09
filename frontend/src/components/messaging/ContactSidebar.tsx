
import React, { useState } from 'react';
import { Contact, AllowedContact } from '@/types/messaging';
import { UserRole } from '@/types/user';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { getAllowedContacts, getOrCreateConversation } from '@/services/messagingService';

interface ContactSidebarProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  currentUserId: string;
  currentUserRole: UserRole;
}

const ContactSidebar: React.FC<ContactSidebarProps> = ({
  contacts,
  selectedContact,
  onSelectContact,
  currentUserId,
  currentUserRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [allowedContacts, setAllowedContacts] = useState<AllowedContact[]>([]);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date/time for last message
  const formatMessageTime = (date?: Date) => {
    if (!date) return '';
    
    const now = new Date();
    const messageDate = new Date(date);
    
    // Same day - show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // This week - show day name
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Older - show date
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Handle opening search dialog
  const handleOpenSearchDialog = () => {
    const contacts = getAllowedContacts(currentUserRole);
    setAllowedContacts(contacts);
    setIsSearchDialogOpen(true);
  };

  // Handle selecting a contact from search
  const handleSelectSearchContact = (contactInfo: AllowedContact) => {
    // Check if contact already exists in the list
    const existingContact = contacts.find(c => c.id === contactInfo.userId);
    
    if (existingContact) {
      onSelectContact(existingContact);
    } else {
      // Create a new contact entry
      const newContact: Contact = {
        id: contactInfo.userId,
        name: contactInfo.userName,
        avatar: contactInfo.userAvatar,
        role: contactInfo.userRole,
        unreadCount: 0
      };
      
      // In a real app, we would save this to the backend
      onSelectContact(newContact);
    }
    
    setIsSearchDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Button 
            variant="outline" 
            className="w-full justify-start text-left font-normal"
            onClick={handleOpenSearchDialog}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Caută un contact...</span>
          </Button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-50" />
            <p>Nu ai conversații active</p>
            <p className="text-sm">Caută un contact pentru a începe o conversație</p>
          </div>
        ) : (
          <ul>
            {filteredContacts.map(contact => (
              <li 
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`
                  flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-colors
                  ${selectedContact?.id === contact.id ? 'bg-muted' : ''}
                  ${contact.unreadCount > 0 ? 'font-medium' : ''}
                `}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium truncate">{contact.name}</span>
                    {contact.lastMessageTime && (
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        {formatMessageTime(contact.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    {contact.lastMessage ? (
                      <span className="text-xs text-muted-foreground truncate">
                        {contact.lastMessage}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Nu există mesaje
                      </span>
                    )}
                    
                    {contact.unreadCount > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <CommandDialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <CommandInput placeholder="Caută un utilizator..." />
        <CommandList>
          <CommandEmpty>Nu au fost găsite contacte.</CommandEmpty>
          <CommandGroup heading="Contacte disponibile">
            {allowedContacts.map(contact => (
              <CommandItem
                key={contact.userId}
                onSelect={() => handleSelectSearchContact(contact)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contact.userAvatar} alt={contact.userName} />
                  <AvatarFallback>{contact.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span>{contact.userName}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {contact.userRole === 'teacher' ? 'Profesor' : 
                     contact.userRole === 'student' ? 'Student' : 
                     'Administrator'}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default ContactSidebar;
