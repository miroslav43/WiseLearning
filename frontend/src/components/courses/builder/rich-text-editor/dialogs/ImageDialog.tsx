
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  onInsert: () => void;
}

export const ImageDialog: React.FC<ImageDialogProps> = ({
  open,
  setOpen,
  imageUrl,
  setImageUrl,
  onInsert
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anulează
          </Button>
          <Button onClick={onInsert}>
            Adaugă imagine
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
