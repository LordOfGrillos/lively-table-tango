
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { KitchenDisplaySystem } from "@/components/kitchen-display/KitchenDisplaySystem";
import { Button } from "@/components/ui/button";
import { LogOut, Coffee, ChefHat } from "lucide-react";

export default function KitchenDisplay() {
  const navigate = useNavigate();
  
  const handleExit = () => {
    navigate('/');  // Navigate back to the main dashboard
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Sistema de Visualización de Cocina" 
          subtitle="Monitorea y gestiona órdenes por departamento"
          actionButton={
            <Button 
              variant="outline"
              onClick={handleExit}
              className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          }
        />
        <div className="flex-1 overflow-hidden p-4">
          <KitchenDisplaySystem />
        </div>
      </div>
    </div>
  );
}
