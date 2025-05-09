
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinkDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  onInsert: () => void;
}

export const LinkDialog: React.FC<LinkDialogProps> = ({
  open,
  setOpen,
  linkUrl,
  setLinkUrl,
  onInsert
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anulează
          </Button>
          <Button onClick={onInsert}>
            Adaugă link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
