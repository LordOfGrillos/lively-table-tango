
import { useState } from "react";
import { Floor } from "@/components/tables/FloorManager";
import { Button } from "@/components/ui/button";
import { PencilRuler, Plus } from "lucide-react";
import { FloorSelector } from "@/components/tables/FloorSelector";
import { ReactNode } from "react";

interface TableHeaderProps {
  floors: Floor[];
  currentFloor: string;
  isEditMode: boolean;
  onFloorChange: (floorId: string) => void;
  onFloorsUpdate: (floors: Floor[]) => void;
  toggleEditMode: () => void;
  rightAction?: ReactNode;
}

export function TableHeader({ 
  floors, 
  currentFloor, 
  isEditMode,
  onFloorChange,
  onFloorsUpdate,
  toggleEditMode,
  rightAction
}: TableHeaderProps) {
  const [isManagingFloors, setIsManagingFloors] = useState(false);
  
  const handleFloorSelection = (floorId: string) => {
    onFloorChange(floorId);
    setIsManagingFloors(false);
  };
  
  const handleFloorsUpdate = (updatedFloors: Floor[]) => {
    onFloorsUpdate(updatedFloors);
    setIsManagingFloors(false);
  };
  
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <FloorSelector
          floors={floors}
          currentFloor={currentFloor}
          isManaging={isManagingFloors}
          onFloorSelect={handleFloorSelection}
          onFloorsUpdate={handleFloorsUpdate}
          onManageToggle={() => setIsManagingFloors(!isManagingFloors)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        {rightAction}
        
        <Button 
          variant={isEditMode ? "default" : "outline"}
          className={isEditMode ? "bg-app-purple hover:bg-app-purple/90" : ""}
          onClick={toggleEditMode}
        >
          <PencilRuler className="mr-2 h-4 w-4" />
          {isEditMode ? "Exit Layout Editor" : "Edit Layout"}
        </Button>
      </div>
    </div>
  );
}
