
import { useState, useEffect } from "react";
import { useStaff, Permission } from "../StaffContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, HelpCircle, Info, ShieldCheck, Check, ChevronDown, ChevronRight } from "lucide-react";

interface PermissionSelectorProps {
  selectedPermissions: string[];
  setSelectedPermissions: React.Dispatch<React.SetStateAction<string[]>>;
}

export function PermissionSelector({ 
  selectedPermissions, 
  setSelectedPermissions 
}: PermissionSelectorProps) {
  const { permissions } = useStaff();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [permissionStrength, setPermissionStrength] = useState(0);

  // Group permissions by category
  const permissionsByCategory: Record<string, Permission[]> = {};
  permissions.forEach((permission) => {
    if (!permissionsByCategory[permission.category]) {
      permissionsByCategory[permission.category] = [];
    }
    permissionsByCategory[permission.category].push(permission);
  });

  // Initial effect to expand all categories
  useEffect(() => {
    setExpandedCategories(Object.keys(permissionsByCategory));
  }, []);

  // Calculate permission strength
  useEffect(() => {
    const totalPermissions = permissions.length;
    const strength = Math.floor((selectedPermissions.length / totalPermissions) * 100);
    setPermissionStrength(strength);
  }, [selectedPermissions, permissions.length]);

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev: string[]) => 
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleCategory = (category: string) => {
    const categoryPermissions = permissionsByCategory[category].map((p) => p.id);
    const allSelected = categoryPermissions.every((id) => 
      selectedPermissions.includes(id)
    );

    setSelectedPermissions((prev: string[]) => {
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

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
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
      <CardContent className="space-y-3 pb-3">
        <div className="pb-2">
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
          <div className="flex items-center p-3 mb-2 text-sm text-amber-800 rounded-lg bg-amber-50">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Selecciona al menos un permiso para poder guardar el rol.</span>
          </div>
        )}

        <div className="border rounded-md max-h-[45vh] overflow-y-auto">
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
                {/* Category header */}
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

                {/* Category permissions */}
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
                            <div className="absolute right-0 top-6 z-50 w-64 p-2 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
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
  );
}
