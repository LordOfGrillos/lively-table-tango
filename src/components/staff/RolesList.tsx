import { useState } from "react";
import { useStaff, Role } from "./StaffContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash, Plus, Copy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RoleEdit } from "./roles/RoleEdit";
import { format } from "date-fns";

export function RolesList() {
  const { roles, deleteRole } = useStaff();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDuplicate = (role: Role) => {
    setEditingRole(null);
    setIsCreating(true);
    toast.success(`Rol "${role.name}" duplicado. Modifica los detalles antes de guardar.`);
  };

  const handleDelete = (id: string) => {
    const success = deleteRole(id);
    if (success) {
      toast.success("Rol eliminado correctamente");
      setDeleteConfirm(null);
    } else {
      toast.error("No se puede eliminar este rol porque tiene usuarios asignados o es el único rol administrativo");
    }
  };

  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium">No hay roles definidos</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            No hay ningún rol definido en el sistema. Puedes crear un nuevo rol con el botón de abajo.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-app-purple hover:bg-app-purple/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Crear Rol
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar roles..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          className="w-full sm:w-auto bg-app-purple hover:bg-app-purple/90"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Crear Rol
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No se encontraron roles. Intenta ajustar tu búsqueda.
          </div>
        ) : (
          filteredRoles.map((role) => (
            <Card key={role.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{role.name}</h3>
                <div className="flex gap-1">
                  {role.isDefault && (
                    <Badge variant="outline" className="bg-gray-100">
                      Predeterminado
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden">
                {role.description}
              </p>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <span>Actualizado: {format(new Date(role.updatedAt), "yyyy-MM-dd")}</span>
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => handleDuplicate(role)}
                >
                  <Copy className="mr-1 h-3.5 w-3.5" />
                  Duplicar
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setDeleteConfirm(role.id)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => setEditingRole(role.id)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {editingRole && (
        <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
            <RoleEdit 
              roleId={editingRole} 
              onSave={() => setEditingRole(null)}
              onCancel={() => setEditingRole(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {isCreating && (
        <Dialog open={isCreating} onOpenChange={() => setIsCreating(false)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
            <RoleEdit 
              onSave={() => setIsCreating(false)}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-md">
            <div className="p-6 text-center">
              <Trash className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">¿Eliminar este rol?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Esta acción no se puede deshacer. Asegúrate de que no haya usuarios con este rol asignado.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
