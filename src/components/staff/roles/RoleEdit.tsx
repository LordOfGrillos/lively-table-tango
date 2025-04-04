
import { useState } from "react";
import { useStaff } from "../StaffContext";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { roleFormSchema, RoleFormValues, RoleFormBasic } from "./RoleFormBasic";
import { PermissionSelector } from "./PermissionSelector";
import { StepIndicator } from "./StepIndicator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface RoleEditProps {
  roleId?: string; // If undefined, it's a new role
  onSave: () => void;
  onCancel: () => void;
}

export function RoleEdit({ roleId, onSave, onCancel }: RoleEditProps) {
  const { roles, addRole, updateRole } = useStaff();
  const existingRole = roleId ? roles.find((r) => r.id === roleId) : undefined;
  
  // State for selected permissions
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    existingRole?.permissions || []
  );
  
  const [currentStep, setCurrentStep] = useState(1);

  // Form with validation
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: existingRole?.name || "",
      description: existingRole?.description || "",
      isDefault: existingRole?.isDefault || false,
    },
  });

  const nextStep = () => {
    // Validation for step 1
    if (currentStep === 1) {
      const { name, description } = form.getValues();
      if (!name || !description) {
        toast.error("Por favor completa todos los campos obligatorios");
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (values: RoleFormValues) => {
    // Validations
    if (selectedPermissions.length === 0) {
      toast.error("Debes asignar al menos un permiso al rol");
      return;
    }

    const roleData = {
      name: values.name,
      description: values.description,
      permissions: selectedPermissions,
      isDefault: values.isDefault,
    };

    if (roleId) {
      // Update existing role
      updateRole(roleId, roleData);
      toast.success("Rol actualizado correctamente");
    } else {
      // Create new role
      addRole(roleData);
      toast.success("Rol creado correctamente");
    }

    onSave();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{roleId ? "Editar Rol" : "Crear Nuevo Rol"}</DialogTitle>
      </DialogHeader>

      <StepIndicator currentStep={currentStep} totalSteps={2} />

      <div className="py-4 space-y-6">
        {/* Step 1: Basic role information */}
        {currentStep === 1 && (
          <form className="space-y-6">
            <RoleFormBasic form={form} />

            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button 
                type="button"
                className="ml-2 bg-app-purple hover:bg-app-purple/90"
                onClick={nextStep}
              >
                Continuar a Permisos
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Permission selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <PermissionSelector 
              selectedPermissions={selectedPermissions}
              setSelectedPermissions={setSelectedPermissions}
            />

            <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <div className="flex justify-start space-x-2 mt-4 sm:mt-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  Volver
                </Button>
              </div>
              <Button 
                type="button"
                className="bg-app-purple hover:bg-app-purple/90 w-full sm:w-auto"
                onClick={() => handleSubmit(form.getValues())}
                disabled={selectedPermissions.length === 0}
              >
                {roleId ? "Guardar cambios" : "Crear rol"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </div>
    </>
  );
}
