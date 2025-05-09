
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Send } from 'lucide-react';
import { Attachment } from '@/types/messaging';

interface MessageInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  attachments: Attachment[];
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageText,
  setMessageText,
  handleSendMessage,
  handleKeyPress,
  handleFileChange,
  attachments
}) => {
  return (
    <div className="p-4 border-t">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Scrie un mesaj..."
            className="min-h-[50px] py-2"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Paperclip className="h-5 w-5" />
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          
          <Button 
            size="icon"
            onClick={handleSendMessage}
            disabled={messageText.trim() === '' && attachments.length === 0}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
