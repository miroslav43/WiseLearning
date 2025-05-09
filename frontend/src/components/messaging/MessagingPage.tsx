
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Contact } from '@/types/messaging';
import { getContactsByRole, getOrCreateConversation } from '@/services/messagingService';
import ChatBox from './ChatBox';
import ContactSidebar from './ContactSidebar';
import EmptyConversation from './EmptyConversation';

const MessagingPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(() => {
    // Initialize contacts based on user role
    return user ? getContactsByRole(user.id, user.role) : [];
  });

  // Handle selecting a contact
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Get or create conversation
    if (user) {
      getOrCreateConversation(user.id, contact.id);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-medium">Please log in to access messaging</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Mesaje</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh] border rounded-lg overflow-hidden">
        {/* Contact sidebar */}
        <div className="md:col-span-1 border-r">
          <ContactSidebar
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            currentUserId={user.id}
            currentUserRole={user.role}
          />
        </div>
        
        {/* Chat area */}
        <div className="md:col-span-2">
          {selectedContact ? (
            <ChatBox
              conversation={getOrCreateConversation(user.id, selectedContact.id)}
              contact={selectedContact}
              currentUser={user}
            />
          ) : (
            <EmptyConversation />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
