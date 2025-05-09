
import React from 'react';
import { Paperclip } from 'lucide-react';
import { Message, Attachment } from '@/types/messaging';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  formatMessageTime: (date: Date) => string;
  formatAttachmentSize: (size: number) => string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  formatMessageTime,
  formatAttachmentSize
}) => {
  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`
        max-w-[80%] md:max-w-[70%]
        ${isCurrentUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
        }
        rounded-lg p-3
      `}>
        {/* Message content */}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        
        {/* Attachments if any */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map(attachment => (
              <div 
                key={attachment.id}
                className="flex items-center p-2 rounded bg-background/10"
              >
                <Paperclip className="h-4 w-4 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">
                    {attachment.fileName}
                  </div>
                  <div className="text-xs opacity-70">
                    {formatAttachmentSize(attachment.fileSize)}
                  </div>
                </div>
                <a 
                  href={attachment.fileUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs underline"
                >
                  Descarcă
                </a>
              </div>
            ))}
          </div>
        )}
        
        {/* Timestamp */}
        <div className={`
          text-xs mt-1
          ${isCurrentUser 
            ? 'text-primary-foreground/80' 
            : 'text-muted-foreground'
          }
          text-right
        `}>
          {formatMessageTime(message.timestamp)}
          {isCurrentUser && (
            <span className="ml-1">
              {message.read ? '• Citit' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
