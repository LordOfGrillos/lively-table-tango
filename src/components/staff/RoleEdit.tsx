
import { useState, useEffect } from "react";
import { useStaff, Role, Permission } from "./StaffContext";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Check, 
  Info, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight 
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface RoleEditProps {
  roleId?: string; // Si es undefined, es un nuevo rol
  onSave: () => void;
  onCancel: () => void;
}

// Esquema de validación para el formulario
const roleFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre del rol debe tener al menos 2 caracteres.",
  }),
  description: z.string().min(5, {
    message: "La descripción debe tener al menos 5 caracteres.",
  }),
  isDefault: z.boolean().default(false),
});

export function RoleEdit({ roleId, onSave, onCancel }: RoleEditProps) {
  const { roles, permissions, addRole, updateRole } = useStaff();
  const existingRole = roleId ? roles.find((r) => r.id === roleId) : undefined;
  
  // State para los permisos seleccionados
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    existingRole?.permissions || []
  );
  
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [permissionStrength, setPermissionStrength] = useState(0);

  // Formulario con validación
  const form = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: existingRole?.name || "",
      description: existingRole?.description || "",
      isDefault: existingRole?.isDefault || false,
    },
  });

  // Agrupar permisos por categoría
  const permissionsByCategory: Record<string, Permission[]> = {};
  permissions.forEach((permission) => {
    if (!permissionsByCategory[permission.category]) {
      permissionsByCategory[permission.category] = [];
    }
    permissionsByCategory[permission.category].push(permission);
  });

  // Efecto inicial para expandir todas las categorías
  useEffect(() => {
    setExpandedCategories(Object.keys(permissionsByCategory));
  }, []);

  // Calcular la fuerza de los permisos elegidos
  useEffect(() => {
    // Calcular qué tan completos son los permisos seleccionados
    const totalPermissions = permissions.length;
    const strength = Math.floor((selectedPermissions.length / totalPermissions) * 100);
    setPermissionStrength(strength);
  }, [selectedPermissions, permissions.length]);

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      return prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId];
    });
  };

  const toggleCategory = (category: string) => {
    const categoryPermissions = permissionsByCategory[category].map((p) => p.id);
    const allSelected = categoryPermissions.every((id) => 
      selectedPermissions.includes(id)
    );

    setSelectedPermissions((prev) => {
      if (allSelected) {
        return prev.filter((id) => !categoryPermissions.includes(id));
      } else {
        return [...new Set([...prev, ...categoryPermissions])];
      }
    });
  };

  const toggleExpandCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const nextStep = () => {
    // Validación para el paso 1
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

  const handleSubmit = (values: z.infer<typeof roleFormSchema>) => {
    // Validaciones
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
      // Actualizar rol existente
      updateRole(roleId, roleData);
      toast.success("Rol actualizado correctamente");
    } else {
      // Crear nuevo rol
      addRole(roleData);
      toast.success("Rol creado correctamente");
    }

    onSave();
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-2">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? "bg-app-purple text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div className={`w-10 h-1 ${currentStep >= 2 ? "bg-app-purple" : "bg-gray-200"}`}></div>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? "bg-app-purple text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{roleId ? "Editar Rol" : "Crear Nuevo Rol"}</DialogTitle>
      </DialogHeader>

      {renderStepIndicator()}

      <div className="py-4 space-y-6">
        {/* Paso 1: Información básica del rol */}
        {currentStep === 1 && (
          <Form {...form}>
            <form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-app-purple" />
                    Información del Rol
                  </CardTitle>
                  <CardDescription>
                    Define el nombre y propósito de este rol en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nombre del rol <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. Gerente de Sucursal"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Este nombre aparecerá en todo el sistema para identificar al rol
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Descripción <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe brevemente las responsabilidades de este rol"
                            className="h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Explica qué tipo de usuario debería tener este rol y sus responsabilidades
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Rol predeterminado</FormLabel>
                          <FormDescription>
                            Este rol se asignará automáticamente a nuevos usuarios
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

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
          </Form>
        )}

        {/* Paso 2: Selección de permisos */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-app-purple" />
                      Permisos del Rol
                    </CardTitle>
                    <CardDescription>
                      Selecciona qué acciones podrán realizar los usuarios con este rol
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1 py-1">
                    <Check className="h-3 w-3" />
                    {selectedPermissions.length} seleccionados
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span>Nivel de acceso</span>
                    </div>
                    <span className="text-sm font-medium">
                      {permissionStrength < 30 
                        ? "Básico" 
                        : permissionStrength < 70 
                          ? "Intermedio" 
                          : "Completo"}
                    </span>
                  </div>
                  <Progress 
                    value={permissionStrength} 
                    className="h-2"
                    // Colores según el nivel de permisos
                    style={{
                      background: "#e5e7eb",
                      "--tw-bg-opacity": "1", 
                      "--progress-color": permissionStrength < 30 
                        ? "#10b981" // Verde para básico
                        : permissionStrength < 70 
                          ? "#f59e0b" // Amarillo para intermedio
                          : "#8b5cf6" // Morado para completo
                    } as React.CSSProperties}
                  />
                </div>

                {selectedPermissions.length === 0 && (
                  <div className="flex items-center p-4 mb-4 text-sm text-amber-800 rounded-lg bg-amber-50">
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Selecciona al menos un permiso para poder guardar el rol.</span>
                  </div>
                )}

                <div className="border rounded-md">
                  {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => {
                    const isCategoryExpanded = expandedCategories.includes(category);
                    const allCategorySelected = categoryPermissions.every((p) =>
                      selectedPermissions.includes(p.id)
                    );
                    const someCategorySelected = categoryPermissions.some((p) =>
                      selectedPermissions.includes(p.id)
                    );

                    return (
                      <div key={category} className="border-b last:border-b-0">
                        {/* Cabecera de la categoría */}
                        <div
                          className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer ${
                            isCategoryExpanded ? "border-b" : ""
                          }`}
                          onClick={() => toggleExpandCategory(category)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={allCategorySelected}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(category);
                              }}
                              className={someCategorySelected && !allCategorySelected ? "opacity-50" : ""}
                            />
                            <Label
                              htmlFor={`category-${category}`}
                              className="font-medium cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(category);
                              }}
                            >
                              {category}
                            </Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandCategory(category);
                            }}
                          >
                            <span className="sr-only">Toggle</span>
                            {isCategoryExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Permisos de la categoría */}
                        {isCategoryExpanded && (
                          <div className="p-3 bg-gray-50 space-y-2">
                            {categoryPermissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center gap-2 pl-6 hover:bg-gray-100 p-2 rounded-md transition-colors"
                              >
                                <Checkbox
                                  id={permission.id}
                                  checked={selectedPermissions.includes(permission.id)}
                                  onCheckedChange={() => togglePermission(permission.id)}
                                />
                                <div className="flex items-center gap-2 flex-1">
                                  <Label
                                    htmlFor={permission.id}
                                    className="cursor-pointer flex-1"
                                  >
                                    {permission.name}
                                  </Label>
                                  <div className="relative group">
                                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                                    <div className="absolute right-0 top-6 z-50 w-72 p-3 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                      <p className="text-sm text-gray-600">
                                        {permission.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

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
