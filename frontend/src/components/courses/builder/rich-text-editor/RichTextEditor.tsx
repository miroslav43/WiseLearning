
import React, { useRef, useState } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { RichTextToolbar } from './RichTextToolbar';
import { LinkDialog } from './dialogs/LinkDialog';
import { ImageDialog } from './dialogs/ImageDialog';
import { CodeDialog } from './dialogs/CodeDialog';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dialog states
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [codeLang, setCodeLang] = useState('javascript');
  const [currentSelection, setCurrentSelection] = useState('');

  // Update content when input changes
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Execute document command with optional value
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Save current selection for later use (with dialogs)
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setCurrentSelection(range.toString());
      return range;
    }
    return null;
  };

  // Restore previously saved selection
  const restoreSelection = (range: Range | null) => {
    if (range) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  // Handle link insertion
  const openLinkDialog = () => {
    saveSelection();
    setLinkDialogOpen(true);
  };

  const insertLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkDialogOpen(false);
      setLinkUrl('');
    }
  };

  // Handle image insertion from URL
  const openImageDialog = () => {
    setImageDialogOpen(true);
  };

  const insertImage = () => {
    if (imageUrl) {
      const img = `<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto;"/>`;
      execCommand('insertHTML', img);
      setImageDialogOpen(false);
      setImageUrl('');
    }
  };

  // Handle image upload
  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const img = `<img src="${event.target.result}" alt="Uploaded image" style="max-width: 100%; height: auto;"/>`;
          execCommand('insertHTML', img);
        }
      };
      
      reader.readAsDataURL(file);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle code block insertion
  const openCodeDialog = () => {
    saveSelection();
    setCodeDialogOpen(true);
  };

  const insertCodeBlock = () => {
    if (codeContent) {
      const escapedContent = codeContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
        
      const codeBlock = `<pre><code class="language-${codeLang}">${escapedContent}</code></pre>`;
      execCommand('insertHTML', codeBlock);
      setCodeDialogOpen(false);
      setCodeContent('');
    }
  };

  // Handle paste with image support
  const handlePaste = (e: React.ClipboardEvent) => {
    // Check if the clipboard contains images
    const hasImage = Array.from(e.clipboardData.items).some(item => item.type.indexOf('image') === 0);
    
    if (hasImage) {
      e.preventDefault();
      // Process image from clipboard
      const imageItem = Array.from(e.clipboardData.items).find(item => item.type.indexOf('image') === 0);
      if (imageItem) {
        const blob = imageItem.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target && event.target.result) {
              const img = `<img src="${event.target.result}" alt="Pasted image" style="max-width: 100%; height: auto;"/>`;
              execCommand('insertHTML', img);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    } else {
      // For text content, allow default behavior but preserve formatting
      const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
      if (text) {
        e.preventDefault();
        execCommand('insertHTML', text);
      }
    }
  };

  // Format commands
  const formatBold = () => execCommand('bold');
  const formatItalic = () => execCommand('italic');
  const formatUnderline = () => execCommand('underline');
  const formatH1 = () => execCommand('formatBlock', '<h1>');
  const formatH2 = () => execCommand('formatBlock', '<h2>');
  const formatParagraph = () => execCommand('formatBlock', '<p>');
  const formatAlignLeft = () => execCommand('justifyLeft');
  const formatAlignCenter = () => execCommand('justifyCenter');
  const formatAlignRight = () => execCommand('justifyRight');
  const formatBulletList = () => execCommand('insertUnorderedList');
  const formatNumberList = () => execCommand('insertOrderedList');

  // Combine all the format commands for the toolbar
  const formatCommands = {
    formatBold,
    formatItalic,
    formatUnderline,
    formatH1,
    formatH2,
    formatParagraph,
    formatAlignLeft,
    formatAlignCenter,
    formatAlignRight,
    formatBulletList,
    formatNumberList,
    openLinkDialog,
    triggerImageUpload,
    openImageDialog,
    openCodeDialog
  };

  return (
    <TooltipProvider>
      <div className="border rounded-md overflow-hidden">
        <RichTextToolbar formatCommands={formatCommands} />
        
        <div
          ref={editorRef}
          className="min-h-[200px] p-3 overflow-auto focus:outline-none"
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: value }}
        />
        
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleImageUpload}
        />
        
        {/* Dialogs */}
        <LinkDialog
          open={linkDialogOpen}
          setOpen={setLinkDialogOpen}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          onInsert={insertLink}
        />
        
        <ImageDialog
          open={imageDialogOpen}
          setOpen={setImageDialogOpen}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          onInsert={insertImage}
        />
        
        <CodeDialog
          open={codeDialogOpen}
          setOpen={setCodeDialogOpen}
          codeContent={codeContent}
          setCodeContent={setCodeContent}
          codeLang={codeLang}
          setCodeLang={setCodeLang}
          onInsert={insertCodeBlock}
        />
      </div>
    </TooltipProvider>
  );
};
