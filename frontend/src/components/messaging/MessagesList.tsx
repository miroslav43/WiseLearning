
import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/messaging';
import MessageBubble from './MessageBubble';
import { User } from '@/types/user';

interface MessagesListProps {
  messages: Message[];
  currentUser: User;
  formatMessageTime: (date: Date) => string;
  formatAttachmentSize: (size: number) => string;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  currentUser,
  formatMessageTime,
  formatAttachmentSize
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => {
        const isCurrentUser = message.senderId === currentUser.id;
        
        return (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
            formatMessageTime={formatMessageTime}
            formatAttachmentSize={formatAttachmentSize}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
