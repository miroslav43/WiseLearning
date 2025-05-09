
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  Heading2
} from 'lucide-react';

interface FormatCommands {
  formatBold: () => void;
  formatItalic: () => void;
  formatUnderline: () => void;
  formatH1: () => void;
  formatH2: () => void;
  formatParagraph?: () => void;
  formatAlignLeft: () => void;
  formatAlignCenter: () => void;
  formatAlignRight: () => void;
  formatBulletList: () => void;
  formatNumberList: () => void;
  openLinkDialog: () => void;
  triggerImageUpload: () => void;
  openImageDialog: () => void;
  openCodeDialog: () => void;
}

interface RichTextToolbarProps {
  formatCommands: FormatCommands;
}

export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ formatCommands }) => {
  const {
    formatBold,
    formatItalic,
    formatUnderline,
    formatH1,
    formatH2,
    formatAlignLeft,
    formatAlignCenter,
    formatAlignRight,
    formatBulletList,
    formatNumberList,
    openLinkDialog,
    triggerImageUpload,
    openImageDialog,
    openCodeDialog
  } = formatCommands;

  return (
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
  );
};
