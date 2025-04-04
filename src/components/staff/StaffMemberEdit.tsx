
import { useState } from "react";
import { useStaff, StaffMember } from "./StaffContext";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface StaffMemberEditProps {
  staffId: string;
  onSave: () => void;
  onCancel: () => void;
}

export function StaffMemberEdit({ staffId, onSave, onCancel }: StaffMemberEditProps) {
  const { staff, roles, branches, updateStaffMember } = useStaff();
  const member = staff.find((m) => m.id === staffId);

  if (!member) {
    return <div>No se encontró el empleado</div>;
  }

  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: member.name,
    email: member.email,
    phone: member.phone || "",
    roleId: member.roleId,
    branchId: member.branchId,
    shift: member.shift || "",
    notes: member.notes || "",
    status: member.status,
  });

  const handleChange = (field: keyof StaffMember, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.name?.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (!formData.email?.trim()) {
      toast.error("El correo electrónico es obligatorio");
      return;
    }

    if (!formData.roleId) {
      toast.error("Debes seleccionar un rol");
      return;
    }

    // Actualizar empleado
    updateStaffMember(staffId, formData);
    toast.success("Empleado actualizado correctamente");
    onSave();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar Empleado</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Select
              value={formData.roleId}
              onValueChange={(value) => handleChange("roleId", value)}
              required
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sucursal */}
          <div className="space-y-2">
            <Label htmlFor="branch">Sucursal</Label>
            <Select
              value={formData.branchId || ""}
              onValueChange={(value) => handleChange("branchId", value)}
            >
              <SelectTrigger id="branch">
                <SelectValue placeholder="Selecciona una sucursal" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Turno */}
          <div className="space-y-2">
            <Label htmlFor="shift">Turno</Label>
            <Select
              value={formData.shift || ""}
              onValueChange={(value) => handleChange("shift", value)}
            >
              <SelectTrigger id="shift">
                <SelectValue placeholder="Selecciona un turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Matutino">Matutino</SelectItem>
                <SelectItem value="Vespertino">Vespertino</SelectItem>
                <SelectItem value="Nocturno">Nocturno</SelectItem>
                <SelectItem value="Mixto">Mixto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="status">Estado *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "suspended" | "inactive") =>
                handleChange("status", value)
              }
              required
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="suspended">Suspendido</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notas */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Información adicional sobre el empleado"
            className="h-20"
          />
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar cambios</Button>
        </DialogFooter>
      </form>
    </>
  );
}
