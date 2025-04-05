
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ isOpen, name, onClose, onConfirm }: DeleteConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  
  const handleConfirm = () => {
    onConfirm();
    setConfirmText("");
  };
  
  const handleClose = () => {
    onClose();
    setConfirmText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Eliminar empleado</DialogTitle>
          <DialogDescription>
            Estás a punto de eliminar al empleado <span className="font-semibold">{name}</span>. 
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-700 mb-4">
            Para confirmar la eliminación, escribe el nombre del empleado:
          </p>
          <Input
            placeholder={`Escribe "${name}" para confirmar`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmText.trim().toLowerCase() !== name.toLowerCase()}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
