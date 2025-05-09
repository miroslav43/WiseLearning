
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CodeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  codeContent: string;
  setCodeContent: (content: string) => void;
  codeLang: string;
  setCodeLang: (lang: string) => void;
  onInsert: () => void;
}

export const CodeDialog: React.FC<CodeDialogProps> = ({
  open,
  setOpen,
  codeContent,
  setCodeContent,
  codeLang,
  setCodeLang,
  onInsert
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Textarea
              id="code-content"
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              placeholder="// Introdu codul tău aici"
              className="w-full p-2 border rounded-md font-mono text-sm h-40"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anulează
          </Button>
          <Button onClick={onInsert}>
            Adaugă bloc de cod
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
