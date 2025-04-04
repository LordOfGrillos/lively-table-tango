
import { useState } from "react";
import { useStaff, StaffMember } from "./StaffContext";
import { Button } from "@/components/ui/button";
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
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface AddStaffWizardProps {
  onClose: () => void;
}

type FormData = Omit<StaffMember, "id" | "createdAt" | "updatedAt" | "lastLogin">;

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  roleId: "",
  branchId: "",
  shift: "",
  notes: "",
  status: "active",
};

export function AddStaffWizard({ onClose }: AddStaffWizardProps) {
  const { roles, branches, permissions, addStaffMember, getPermissionsByRole } = useStaff();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [emailError, setEmailError] = useState("");

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Limpiar errores cuando se modifica el campo correspondiente
    if (field === "email") {
      setEmailError("");
    }
  };

  const validateStep1 = () => {
    let isValid = true;
    
    if (!formData.name.trim()) {
      toast.error("Por favor ingresa el nombre del empleado");
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      toast.error("Por favor ingresa el correo electrónico");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError("Por favor ingresa un correo electrónico válido");
      isValid = false;
    }
    
    return isValid;
  };

  const validateStep2 = () => {
    if (!formData.roleId) {
      toast.error("Por favor selecciona un rol para el empleado");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    addStaffMember(formData);
    toast.success("Empleado agregado correctamente");
    onClose();
  };

  const selectedRole = roles.find(r => r.id === formData.roleId);
  const selectedRolePermissions = selectedRole ? getPermissionsByRole(selectedRole.id) : [];
  
  // Agrupar permisos por categoría
  const permissionsByCategory = selectedRolePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof selectedRolePermissions>);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Encabezado del wizard */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">Agregar Nuevo Empleado</h2>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === step 
                  ? "bg-app-purple" 
                  : i < step 
                    ? "bg-gray-400" 
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Contenido del wizard */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Paso 1: Información Básica */}
        {step === 1 && (
          <div className="max-w-xl mx-auto space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-1">Información personal</h3>
              <p className="text-sm text-gray-500 mb-4">
                Ingresa la información básica del nuevo empleado
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Nombre y apellidos"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Correo electrónico <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={emailError ? "border-red-500" : ""}
                />
                {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Sucursal</Label>
                <Select
                  value={formData.branchId}
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

              <div className="space-y-2">
                <Label htmlFor="shift">Turno</Label>
                <Select
                  value={formData.shift}
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
            </div>
          </div>
        )}

        {/* Paso 2: Rol y Permisos */}
        {step === 2 && (
          <div className="max-w-xl mx-auto space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-1">Asignación de rol</h3>
              <p className="text-sm text-gray-500 mb-4">
                Selecciona el rol que tendrá el empleado en el sistema
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">
                  Rol <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.roleId}
                  onValueChange={(value) => handleChange("roleId", value)}
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

              {selectedRole && (
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">{selectedRole.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{selectedRole.description}</p>
                  
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium">Permisos incluidos</h5>
                    {Object.entries(permissionsByCategory).length > 0 ? (
                      Object.entries(permissionsByCategory).map(([category, perms]) => (
                        <div key={category} className="space-y-1">
                          <h6 className="text-xs text-gray-500">{category}</h6>
                          <div className="flex flex-wrap gap-2">
                            {perms.map(permission => (
                              <Badge key={permission.id} variant="outline" className="bg-white gap-1">
                                <Check className="h-3 w-3" />
                                {permission.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Este rol no tiene permisos asignados.</p>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Paso 3: Resumen y Confirmación */}
        {step === 3 && (
          <div className="max-w-xl mx-auto space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-1">Confirmar información</h3>
              <p className="text-sm text-gray-500 mb-4">
                Revisa la información antes de crear el nuevo empleado
              </p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nombre</h4>
                  <p>{formData.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Correo</h4>
                  <p>{formData.email}</p>
                </div>
                {formData.phone && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Teléfono</h4>
                    <p>{formData.phone}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Rol</h4>
                  <p>{selectedRole?.name}</p>
                </div>
                {formData.branchId && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Sucursal</h4>
                    <p>{branches.find(b => b.id === formData.branchId)?.name}</p>
                  </div>
                )}
                {formData.shift && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Turno</h4>
                    <p>{formData.shift}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <Label htmlFor="notes">Notas adicionales</Label>
                <Textarea
                  id="notes"
                  placeholder="Agrega notas adicionales si es necesario"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="h-20 mt-2"
                />
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Pie del wizard */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="flex justify-between">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={prevStep}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Cancelar
            </Button>
          )}

          {step < 3 ? (
            <Button 
              onClick={nextStep}
              className="gap-2 bg-app-purple hover:bg-app-purple/90"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="gap-2 bg-app-purple hover:bg-app-purple/90"
            >
              <Check className="h-4 w-4" />
              Crear Empleado
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
