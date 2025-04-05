
import { useState } from "react";
import { QuickEditDialog } from "../QuickEditDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuickEditStatusDialogProps {
  isOpen: boolean;
  staffId: string;
  name: string;
  currentStatus: "active" | "suspended" | "inactive";
  onClose: () => void;
  onConfirm: (newStatus: "active" | "suspended" | "inactive") => void;
}

export function QuickEditStatusDialog({ 
  isOpen, 
  staffId, 
  name, 
  currentStatus, 
  onClose, 
  onConfirm 
}: QuickEditStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<"active" | "suspended" | "inactive">(currentStatus);

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };
  
  if (!isOpen) return null;

  return (
    <QuickEditDialog
      title="Actualizar estado de empleado"
      description={`Estás cambiando el estado de ${name}. ¿Estás seguro?`}
      onClose={onClose}
      onConfirm={handleConfirm}
    >
      <div className="py-4 space-y-4">
        <Select 
          defaultValue={currentStatus}
          onValueChange={(value: "active" | "suspended" | "inactive") => setSelectedStatus(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="suspended">Suspendido</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </QuickEditDialog>
  );
}
