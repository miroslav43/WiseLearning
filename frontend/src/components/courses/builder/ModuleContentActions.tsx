
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, BookOpen, FileQuestion, FileText } from 'lucide-react';
import { ContentType } from '@/types/course';

interface ModuleContentActionsProps {
  onAddContent: (type: ContentType) => void;
}

export const ModuleContentActions: React.FC<ModuleContentActionsProps> = ({ onAddContent }) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-medium text-sm text-gray-700">Conținut</h4>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Adaugă conținut
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Tipuri de conținut</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onAddContent('lesson')} className="cursor-pointer">
            <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
            <span>Lecție</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddContent('quiz')} className="cursor-pointer">
            <FileQuestion className="h-4 w-4 mr-2 text-green-500" />
            <span>Quiz</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddContent('assignment')} className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2 text-orange-500" />
            <span>Temă</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
