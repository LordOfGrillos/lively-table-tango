
import { useState } from "react";
import { useStaff } from "./StaffContext";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { StaffMemberDetail } from "./StaffMemberDetail";
import { StaffMemberEdit } from "./StaffMemberEdit";
import { toast } from "sonner";
import { StaffTable } from "./table/StaffTable";
import { DeleteConfirmDialog } from "./dialogs/DeleteConfirmDialog";
import { QuickEditRoleDialog } from "./dialogs/QuickEditRoleDialog";
import { QuickEditStatusDialog } from "./dialogs/QuickEditStatusDialog";

interface StaffListProps {
  onAddEmployee: () => void;
}

export function StaffList({ onAddEmployee }: StaffListProps) {
  const { deleteStaffMember, updateStaffMember } = useStaff();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Dialog states
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string} | null>(null);
  
  // Quick edit states
  const [quickEditRole, setQuickEditRole] = useState<{id: string, name: string, roleId: string} | null>(null);
  const [quickEditStatus, setQuickEditStatus] = useState<{id: string, name: string, status: "active" | "suspended" | "inactive"} | null>(null);
  
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    
    deleteStaffMember(deleteConfirm.id);
    setDeleteConfirm(null);
    toast.success("Empleado eliminado correctamente");
  };

  const handleRoleUpdate = (newRoleId: string) => {
    if (!quickEditRole) return;
    
    updateStaffMember(quickEditRole.id, { roleId: newRoleId });
    toast.success(`Rol de ${quickEditRole.name} actualizado correctamente`);
    setQuickEditRole(null);
  };

  const handleStatusUpdate = (newStatus: "active" | "suspended" | "inactive") => {
    if (!quickEditStatus) return;
    
    updateStaffMember(quickEditStatus.id, { status: newStatus });
    toast.success(`Estado de ${quickEditStatus.name} actualizado correctamente`);
    setQuickEditStatus(null);
  };

  return (
    <div className="space-y-4">
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

      <StaffTable 
        searchQuery={searchQuery}
        sortBy={sortBy}
        sortOrder={sortOrder}
        toggleSort={toggleSort}
        onQuickEditRole={(id, name, roleId) => 
          setQuickEditRole({ id, name, roleId })
        }
        onQuickEditStatus={(id, name, status) => 
          setQuickEditStatus({ id, name, status })
        }
        onViewDetails={(id) => setSelectedStaff(id)}
        onEdit={(id) => setEditingStaff(id)}
        onDelete={(id, name) => setDeleteConfirm({ id, name })}
      />

      {/* Staff Member Detail Dialog */}
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
                const member = useStaff().staff.find(m => m.id === selectedStaff);
                if (member) {
                  setDeleteConfirm({id: member.id, name: member.name});
                  setSelectedStaff(null);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Staff Member Edit Dialog */}
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <DeleteConfirmDialog 
          isOpen={!!deleteConfirm}
          name={deleteConfirm.name}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* Quick Edit Role Dialog */}
      {quickEditRole && (
        <QuickEditRoleDialog 
          isOpen={!!quickEditRole}
          staffId={quickEditRole.id}
          name={quickEditRole.name}
          currentRoleId={quickEditRole.roleId}
          onClose={() => setQuickEditRole(null)}
          onConfirm={handleRoleUpdate}
        />
      )}

      {/* Quick Edit Status Dialog */}
      {quickEditStatus && (
        <QuickEditStatusDialog 
          isOpen={!!quickEditStatus}
          staffId={quickEditStatus.id}
          name={quickEditStatus.name}
          currentStatus={quickEditStatus.status}
          onClose={() => setQuickEditStatus(null)}
          onConfirm={handleStatusUpdate}
        />
      )}
    </div>
  );
}
