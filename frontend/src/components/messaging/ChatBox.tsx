
import React, { useState, useEffect } from 'react';
import { Conversation, Contact, Message, Attachment } from '@/types/messaging';
import { User } from '@/types/user';
import { 
  getConversationMessages, 
  sendMessage, 
  markMessagesAsRead 
} from '@/services/messagingService';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import AttachmentsPreview from './AttachmentsPreview';
import MessageInput from './MessageInput';

interface ChatBoxProps {
  conversation: Conversation;
  contact: Contact;
  currentUser: User;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  conversation,
  contact,
  currentUser
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    // Load messages for conversation
    const conversationMessages = getConversationMessages(conversation.id);
    setMessages(conversationMessages);
    
    // Mark messages as read
    markMessagesAsRead(conversation.id, currentUser.id);
    
    // Set up polling to check for new messages (in a real app, this would be websockets)
    const interval = setInterval(() => {
      const updatedMessages = getConversationMessages(conversation.id);
      if (updatedMessages.length !== messages.length) {
        setMessages(updatedMessages);
        markMessagesAsRead(conversation.id, currentUser.id);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [conversation.id, currentUser.id, messages.length]);

  const handleSendMessage = () => {
    if (messageText.trim() === '' && attachments.length === 0) return;
    
    // Send message
    const newMessage = sendMessage(
      conversation.id,
      currentUser.id,
      contact.id,
      messageText,
      attachments
    );
    
    // Update UI
    setMessages([...messages, newMessage]);
    setMessageText('');
    setAttachments([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Convert File objects to Attachment objects
    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(2),
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
      fileSize: file.size
    }));
    
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatAttachmentSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(0)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader contact={contact} />
      
      <MessagesList 
        messages={messages}
        currentUser={currentUser}
        formatMessageTime={formatMessageTime}
        formatAttachmentSize={formatAttachmentSize}
      />
      
      <AttachmentsPreview 
        attachments={attachments} 
        onRemoveAttachment={handleRemoveAttachment} 
      />
      
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
        handleFileChange={handleFileChange}
        attachments={attachments}
      />
    </div>
  );
};

export default ChatBox;
