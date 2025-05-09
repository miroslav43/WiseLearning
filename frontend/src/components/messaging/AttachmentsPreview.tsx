
import React from 'react';
import { Paperclip } from 'lucide-react';
import { Attachment } from '@/types/messaging';

interface AttachmentsPreviewProps {
  attachments: Attachment[];
  onRemoveAttachment: (id: string) => void;
}

const AttachmentsPreview: React.FC<AttachmentsPreviewProps> = ({
  attachments,
  onRemoveAttachment
}) => {
  if (attachments.length === 0) return null;
  
  return (
    <div className="p-2 border-t flex gap-2 overflow-x-auto">
      {attachments.map(attachment => (
        <div 
          key={attachment.id}
          className="flex-shrink-0 bg-muted rounded p-2 text-xs"
        >
          <div className="flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
            <span className="truncate max-w-[150px]">{attachment.fileName}</span>
            <button 
              onClick={() => onRemoveAttachment(attachment.id)}
              className="ml-1 text-muted-foreground hover:text-foreground"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttachmentsPreview;
