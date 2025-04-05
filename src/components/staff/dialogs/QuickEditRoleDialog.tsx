
import { useState } from "react";
import { QuickEditDialog } from "../QuickEditDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaff } from "../StaffContext";

interface QuickEditRoleDialogProps {
  isOpen: boolean;
  staffId: string;
  name: string;
  currentRoleId: string;
  onClose: () => void;
  onConfirm: (newRoleId: string) => void;
}

export function QuickEditRoleDialog({ 
  isOpen, 
  staffId, 
  name, 
  currentRoleId, 
  onClose, 
  onConfirm 
}: QuickEditRoleDialogProps) {
  const { roles } = useStaff();
  const [selectedRoleId, setSelectedRoleId] = useState(currentRoleId);

  const handleConfirm = () => {
    onConfirm(selectedRoleId);
  };
  
  if (!isOpen) return null;

  return (
    <QuickEditDialog
      title="Actualizar rol de empleado"
      description={`Estás cambiando el rol de ${name}. ¿Estás seguro?`}
      onClose={onClose}
      onConfirm={handleConfirm}
    >
      <div className="py-4 space-y-4">
        <Select 
          defaultValue={currentRoleId}
          onValueChange={(value) => setSelectedRoleId(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </QuickEditDialog>
  );
}
