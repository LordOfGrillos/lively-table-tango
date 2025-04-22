
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { KitchenDisplaySystem } from "@/components/kitchen-display/KitchenDisplaySystem";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function KitchenDisplay() {
  const navigate = useNavigate();
  
  const handleExit = () => {
    navigate('/');  // Navigate back to the main dashboard
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Kitchen Display System" 
          subtitle="Monitor orders across departments"
          actionButton={
            <Button 
              variant="destructive" 
              onClick={handleExit}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          }
        />
        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            <KitchenDisplaySystem />
          </div>
        </div>
      </div>
    </div>
  );
}
