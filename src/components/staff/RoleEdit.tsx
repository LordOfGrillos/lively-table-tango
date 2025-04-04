
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
import { Check, Info } from "lucide-react";

interface RoleEditProps {
  roleId?: string; // Si es undefined, es un nuevo rol
  onSave: () => void;
  onCancel: () => void;
}

export function RoleEdit({ roleId, onSave, onCancel }: RoleEditProps) {
  const { roles, permissions, addRole, updateRole } = useStaff();
  const existingRole = roleId ? roles.find((r) => r.id === roleId) : undefined;
  
  const [formData, setFormData] = useState<Omit<Role, "id" | "createdAt" | "updatedAt">>({
    name: existingRole?.name || "",
    description: existingRole?.description || "",
    permissions: existingRole?.permissions || [],
    isDefault: existingRole?.isDefault || false,
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

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

  const handleChange = (field: keyof Role, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: newPermissions };
    });
  };

  const toggleCategory = (category: string) => {
    const categoryPermissions = permissionsByCategory[category].map((p) => p.id);
    const allSelected = categoryPermissions.every((id) => 
      formData.permissions.includes(id)
    );

    setFormData((prev) => {
      const newPermissions = allSelected
        ? prev.permissions.filter((id) => !categoryPermissions.includes(id))
        : [...new Set([...prev.permissions, ...categoryPermissions])];
      return { ...prev, permissions: newPermissions };
    });

    // Actualizar categorías seleccionadas
    setSelectedCategories((prev) =>
      allSelected
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleExpandCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.name.trim()) {
      toast.error("El nombre del rol es obligatorio");
      return;
    }

    if (formData.permissions.length === 0) {
      toast.error("Debes asignar al menos un permiso al rol");
      return;
    }

    if (roleId) {
      // Actualizar rol existente
      updateRole(roleId, formData);
      toast.success("Rol actualizado correctamente");
    } else {
      // Crear nuevo rol
      addRole(formData);
      toast.success("Rol creado correctamente");
    }

    onSave();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{roleId ? "Editar Rol" : "Crear Nuevo Rol"}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="py-4 space-y-6">
        {/* Información básica del rol */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre del rol <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej. Gerente de Sucursal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe brevemente las responsabilidades de este rol"
              className="h-20"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="default"
              checked={formData.isDefault || false}
              onCheckedChange={(checked) => handleChange("isDefault", checked)}
            />
            <Label htmlFor="default" className="cursor-pointer">
              Rol predeterminado
            </Label>
          </div>
        </div>

        {/* Selección de permisos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Permisos</h3>
            <Badge variant="outline" className="gap-1 py-1">
              <Check className="h-3 w-3" />
              {formData.permissions.length} seleccionados
            </Badge>
          </div>

          <div className="border rounded-md">
            {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => {
              const isCategoryExpanded = expandedCategories.includes(category);
              const allCategorySelected = categoryPermissions.every((p) =>
                formData.permissions.includes(p.id)
              );
              const someCategorySelected = categoryPermissions.some((p) =>
                formData.permissions.includes(p.id)
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`h-4 w-4 transition-transform ${
                          isCategoryExpanded ? "rotate-180" : ""
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </Button>
                  </div>

                  {/* Permisos de la categoría */}
                  {isCategoryExpanded && (
                    <div className="p-3 bg-gray-50 space-y-2">
                      {categoryPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center gap-2 pl-6"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
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
                              <Info className="h-4 w-4 text-gray-400" />
                              <div className="absolute right-0 top-6 z-10 w-72 p-3 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
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
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-app-purple hover:bg-app-purple/90"
          >
            {roleId ? "Guardar cambios" : "Crear rol"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
