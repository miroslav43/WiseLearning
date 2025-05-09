
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Link, 
  Image,
  Code,
  Heading1,
  Heading2,
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [codeLang, setCodeLang] = useState('javascript');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setCurrentSelection(range.toString());
      return range;
    }
    return null;
  };

  const restoreSelection = (range: Range | null) => {
    if (range) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
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
  
  // Handle link insertion with dialog
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

  // Handle image insertion with dialog
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

  // Handle code block insertion
  const openCodeDialog = () => {
    saveSelection();
    setCodeDialogOpen(true);
  };

  const insertCodeBlock = () => {
    if (codeContent) {
      const codeBlock = `
        <pre><code class="language-${codeLang}">${codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
      `;
      execCommand('insertHTML', codeBlock);
      setCodeDialogOpen(false);
      setCodeContent('');
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

  return (
    <TooltipProvider>
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 p-2 border-b flex flex-wrap items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={formatBold} 
                className="h-8 w-8 p-0"
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={formatItalic} 
                className="h-8 w-8 p-0"
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={formatUnderline} 
                className="h-8 w-8 p-0"
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>
          
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={formatH1} 
                className="h-8 w-8 p-0"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={formatH2} 
                className="h-8 w-8 p-0"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>
          
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={formatAlignLeft} 
                className="h-8 w-8 p-0"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={formatAlignCenter} 
                className="h-8 w-8 p-0"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={formatAlignRight} 
                className="h-8 w-8 p-0"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
          
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={formatBulletList} 
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={formatNumberList} 
                className="h-8 w-8 p-0"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>
          
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={openLinkDialog} 
                className="h-8 w-8 p-0"
              >
                <Link className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Link</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={triggerImageUpload} 
                className="h-8 w-8 p-0"
              >
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload Image</TooltipContent>
          </Tooltip>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*" 
            onChange={handleImageUpload}
          />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={openImageDialog} 
                className="h-8 w-8 p-0"
              >
                <span className="text-xs">URL</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Image from URL</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={openCodeDialog} 
                className="h-8 w-8 p-0"
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Code Block</TooltipContent>
          </Tooltip>
        </div>
        
        <div
          ref={editorRef}
          className="min-h-[200px] p-3 overflow-auto focus:outline-none"
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: value }}
        />
        
        {/* Link Dialog */}
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adaugă un link</DialogTitle>
              <DialogDescription>
                Introdu URL-ul pentru a crea un link.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link-url" className="text-right">
                  URL
                </Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Anulează
              </Button>
              <Button onClick={insertLink}>
                Adaugă link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Image Dialog */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adaugă o imagine folosind URL</DialogTitle>
              <DialogDescription>
                Introdu URL-ul imaginii pe care dorești să o adaugi.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image-url" className="text-right">
                  URL Imagine
                </Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                Anulează
              </Button>
              <Button onClick={insertImage}>
                Adaugă imagine
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Code Block Dialog */}
        <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adaugă un bloc de cod</DialogTitle>
              <DialogDescription>
                Adaugă codul tău și setează limbajul de programare.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code-lang" className="text-right">
                  Limbaj
                </Label>
                <select
                  id="code-lang"
                  value={codeLang}
                  onChange={(e) => setCodeLang(e.target.value)}
                  className="col-span-3 w-full p-2 border rounded-md"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="cpp">C++</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="sql">SQL</option>
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Label htmlFor="code-content">
                  Cod
                </Label>
                <textarea
                  id="code-content"
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  placeholder="// Introdu codul tău aici"
                  className="w-full p-2 border rounded-md font-mono text-sm h-40"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCodeDialogOpen(false)}>
                Anulează
              </Button>
              <Button onClick={insertCodeBlock}>
                Adaugă bloc de cod
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};
