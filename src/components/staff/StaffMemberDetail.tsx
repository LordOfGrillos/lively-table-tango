
import { useStaff } from "./StaffContext";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Mail, Phone, MapPin, Clock, FileText, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StaffMemberDetailProps {
  staffId: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function StaffMemberDetail({ staffId, onEdit, onDelete }: StaffMemberDetailProps) {
  const { staff, getRoleById, getBranchById, getPermissionsByRole } = useStaff();
  const member = staff.find(m => m.id === staffId);

  if (!member) {
    return <div>No se encontró el empleado</div>;
  }

  const role = getRoleById(member.roleId);
  const branch = member.branchId ? getBranchById(member.branchId) : undefined;
  const permissions = getPermissionsByRole(member.roleId);

  // Función para mostrar el badge de estado
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      "active": { label: "Activo", color: "bg-green-100 text-green-800" },
      "suspended": { label: "Suspendido", color: "bg-yellow-100 text-yellow-800" },
      "inactive": { label: "Inactivo", color: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      color: "bg-gray-100 text-gray-800" 
    };

    return (
      <Badge className={`font-medium ${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  // Agrupar permisos por categoría
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl flex items-center justify-between">
          <span>Detalles del Empleado</span>
          {renderStatusBadge(member.status)}
        </DialogTitle>
      </DialogHeader>

      <div className="py-4 space-y-6">
        {/* Información básica */}
        <div>
          <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{member.email}</span>
            </div>
            {member.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{member.phone}</span>
              </div>
            )}
            {branch && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{branch.name}</span>
              </div>
            )}
            {member.shift && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Turno: {member.shift}</span>
              </div>
            )}
          </div>
        </div>

        {/* Rol y permisos */}
        <div>
          <h4 className="text-sm font-medium mb-2">Rol asignado</h4>
          <div className="p-3 rounded-md bg-gray-50 mb-4">
            <div className="font-medium">{role?.name}</div>
            <div className="text-sm text-gray-600">{role?.description}</div>
          </div>

          <h4 className="text-sm font-medium mb-2">Permisos</h4>
          <div className="space-y-3">
            {Object.entries(permissionsByCategory).map(([category, perms]) => (
              <div key={category}>
                <h5 className="text-xs text-gray-500 uppercase mb-1">{category}</h5>
                <div className="flex flex-wrap gap-2">
                  {perms.map(permission => (
                    <Badge key={permission.id} variant="outline" className="bg-gray-50">
                      {permission.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notas */}
        {member.notes && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notas
            </h4>
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              {member.notes}
            </div>
          </div>
        )}

        {/* Información del sistema */}
        <div className="border-t pt-4 text-xs text-gray-500">
          <div>Creado: {format(new Date(member.createdAt), "PPP", { locale: es })}</div>
          <div>Última actualización: {format(new Date(member.updatedAt), "PPP", { locale: es })}</div>
          {member.lastLogin && (
            <div>Último acceso: {format(new Date(member.lastLogin), "PPP 'a las' p", { locale: es })}</div>
          )}
        </div>
      </div>

      <DialogFooter className="sm:justify-between">
        <Button variant="destructive" onClick={onDelete} className="gap-2">
          <Trash className="h-4 w-4" />
          Eliminar
        </Button>
        <Button onClick={onEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </DialogFooter>
    </>
  );
}
