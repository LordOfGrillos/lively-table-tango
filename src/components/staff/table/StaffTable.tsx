
import { useState } from "react";
import { useStaff } from "../StaffContext";
import { Search, Filter, ArrowUpDown, Edit, Trash, AlertCircle, UserCog, Activity } from "lucide-react";
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

interface StaffTableProps {
  searchQuery: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  toggleSort: (field: string) => void;
  onQuickEditRole: (id: string, name: string, roleId: string) => void;
  onQuickEditStatus: (id: string, name: string, status: "active" | "suspended" | "inactive") => void;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function StaffTable({
  searchQuery,
  sortBy,
  sortOrder,
  toggleSort,
  onQuickEditRole,
  onQuickEditStatus,
  onViewDetails,
  onEdit,
  onDelete
}: StaffTableProps) {
  const { staff, getRoleById, getBranchById } = useStaff();

  // Filter staff based on search query
  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.phone && member.phone.includes(searchQuery))
  );

  // Sort staff based on sort field and order
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    let valueA: any = a[sortBy as keyof typeof a];
    let valueB: any = b[sortBy as keyof typeof b];

    if (sortBy === "role") {
      valueA = getRoleById(a.roleId)?.name || "";
      valueB = getRoleById(b.roleId)?.name || "";
    } else if (sortBy === "branch") {
      valueA = getBranchById(a.branchId || "")?.name || "";
      valueB = getBranchById(b.branchId || "")?.name || "";
    }

    if (valueA === undefined) return 0;
    if (valueB === undefined) return 0;

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
      </div>
    );
  }

  return (
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
                  onClick={() => onViewDetails(member.id)}
                >
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {getRoleById(member.roleId)?.name}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickEditRole(member.id, member.name, member.roleId);
                      }}
                    >
                      <UserCog className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                  <TableCell>{getBranchById(member.branchId || "")?.name || "-"}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {renderStatusBadge(member.status)}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickEditStatus(member.id, member.name, member.status);
                      }}
                    >
                      <Activity className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
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
                        onEdit(member.id);
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
                        onDelete(member.id, member.name);
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
  );
}
