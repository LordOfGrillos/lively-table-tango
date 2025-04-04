
import { useState } from "react";
import { useStaff } from "./StaffContext";
import { Search, Filter, ArrowUpDown, Edit, Trash, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { StaffMemberDetail } from "./StaffMemberDetail";
import { StaffMemberEdit } from "./StaffMemberEdit";
import { toast } from "sonner";

interface StaffListProps {
  onAddEmployee: () => void;
}

export function StaffList({ onAddEmployee }: StaffListProps) {
  const { staff, getRoleById, getBranchById, deleteStaffMember } = useStaff();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string} | null>(null);
  const [confirmText, setConfirmText] = useState("");
  
  // Función para filtrar y ordenar
  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.phone && member.phone.includes(searchQuery))
  );

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    let valueA: any = a[sortBy as keyof typeof a];
    let valueB: any = b[sortBy as keyof typeof b];

    // Manejar casos especiales
    if (sortBy === "role") {
      valueA = getRoleById(a.roleId)?.name || "";
      valueB = getRoleById(b.roleId)?.name || "";
    } else if (sortBy === "branch") {
      valueA = getBranchById(a.branchId || "")?.name || "";
      valueB = getBranchById(b.branchId || "")?.name || "";
    }

    if (valueA === undefined) return 0;
    if (valueB === undefined) return 0;

    // Comparar valores
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else if (valueA instanceof Date && valueB instanceof Date) {
      return sortOrder === "asc" 
        ? valueA.getTime() - valueB.getTime() 
        : valueB.getTime() - valueA.getTime();
    } else {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  // Función para cambiar el orden
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

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

  // Manejar eliminación de empleado
  const handleDelete = () => {
    if (!deleteConfirm) return;
    
    // Verificar que el texto de confirmación coincide con el nombre
    if (confirmText.trim().toLowerCase() !== deleteConfirm.name.toLowerCase()) {
      toast.error("El nombre ingresado no coincide con el nombre del empleado");
      return;
    }
    
    deleteStaffMember(deleteConfirm.id);
    setDeleteConfirm(null);
    setConfirmText("");
    toast.success("Empleado eliminado correctamente");
  };
  
  // Verificar si no hay empleados
  if (staff.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium">No hay empleados registrados</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            No hay ningún empleado registrado en el sistema. Puedes agregar un nuevo empleado con el botón de abajo.
          </p>
        </div>
        <Button 
          onClick={onAddEmployee}
          className="bg-app-purple hover:bg-app-purple/90"
        >
          Agregar Empleado
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar empleados..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>

      {/* Tabla de empleados */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <button
                    className="flex items-center gap-1 hover:text-app-purple"
                    onClick={() => toggleSort("name")}
                  >
                    Nombre
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-app-purple"
                    onClick={() => toggleSort("role")}
                  >
                    Rol
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-app-purple"
                    onClick={() => toggleSort("branch")}
                  >
                    Sucursal
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-app-purple"
                    onClick={() => toggleSort("status")}
                  >
                    Estado
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-app-purple"
                    onClick={() => toggleSort("lastLogin")}
                  >
                    Último acceso
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No se encontraron empleados. Intenta ajustar tu búsqueda.
                  </TableCell>
                </TableRow>
              ) : (
                sortedStaff.map((member) => (
                  <TableRow 
                    key={member.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedStaff(member.id)}
                  >
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{getRoleById(member.roleId)?.name}</TableCell>
                    <TableCell>{getBranchById(member.branchId || "")?.name || "-"}</TableCell>
                    <TableCell>{renderStatusBadge(member.status)}</TableCell>
                    <TableCell>
                      {member.lastLogin
                        ? formatDistanceToNow(new Date(member.lastLogin), {
                            addSuffix: true,
                            locale: es
                          })
                        : "Nunca"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingStaff(member.id);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({id: member.id, name: member.name});
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modal de detalle de empleado */}
      {selectedStaff && (
        <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
          <DialogContent className="sm:max-w-lg">
            <StaffMemberDetail 
              staffId={selectedStaff} 
              onEdit={() => {
                setEditingStaff(selectedStaff);
                setSelectedStaff(null);
              }}
              onDelete={() => {
                const member = staff.find(m => m.id === selectedStaff);
                if (member) {
                  setDeleteConfirm({id: member.id, name: member.name});
                  setSelectedStaff(null);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de edición de empleado */}
      {editingStaff && (
        <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
          <DialogContent className="sm:max-w-xl">
            <StaffMemberEdit 
              staffId={editingStaff}
              onSave={() => setEditingStaff(null)}
              onCancel={() => setEditingStaff(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600">Eliminar empleado</DialogTitle>
              <DialogDescription>
                Estás a punto de eliminar al empleado <span className="font-semibold">{deleteConfirm.name}</span>. 
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700 mb-4">
                Para confirmar la eliminación, escribe el nombre del empleado:
              </p>
              <Input
                placeholder={`Escribe "${deleteConfirm.name}" para confirmar`}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => {
                  setDeleteConfirm(null);
                  setConfirmText("");
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmText.trim().toLowerCase() !== deleteConfirm.name.toLowerCase()}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
