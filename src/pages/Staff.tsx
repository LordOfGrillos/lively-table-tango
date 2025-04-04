
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StaffTabs } from "@/components/staff/StaffTabs";
import { StaffProvider } from "@/components/staff/StaffContext";
import { StaffList } from "@/components/staff/StaffList";
import { RolesList } from "@/components/staff/RolesList";
import { AddStaffWizard } from "@/components/staff/AddStaffWizard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Staff() {
  const [activeTab, setActiveTab] = useState("employees");
  const [showAddWizard, setShowAddWizard] = useState(false);

  const handleAddEmployee = () => {
    setShowAddWizard(true);
  };

  const handleCloseWizard = () => {
    setShowAddWizard(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <StaffProvider>
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {showAddWizard ? (
            <AddStaffWizard onClose={handleCloseWizard} />
          ) : (
            <>
              <Header 
                title="Personal y Roles" 
                subtitle="Gestiona los empleados y sus permisos en el sistema"
                actionButton={
                  <Button 
                    onClick={handleAddEmployee}
                    className="bg-app-purple hover:bg-app-purple/90 shadow-md"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Agregar Empleado
                  </Button>
                }
              />
              
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
                <StaffTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                
                <div className="mt-4">
                  {activeTab === "employees" && <StaffList onAddEmployee={handleAddEmployee} />}
                  {activeTab === "roles" && <RolesList />}
                </div>
              </div>
            </>
          )}
        </div>
      </StaffProvider>
    </div>
  );
}
