
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { FloorManager, Floor } from "@/components/tables/FloorManager";

type TableHeaderProps = {
  floors: Floor[];
  currentFloor: string;
  isEditMode: boolean;
  onFloorChange: (floorId: string) => void;
  onFloorsUpdate: (floors: Floor[]) => void;
  toggleEditMode: () => void;
};

export function TableHeader({ 
  floors, 
  currentFloor, 
  isEditMode, 
  onFloorChange, 
  onFloorsUpdate, 
  toggleEditMode 
}: TableHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <FloorManager
        floors={floors}
        currentFloor={currentFloor}
        onFloorChange={onFloorChange}
        onFloorsUpdate={onFloorsUpdate}
      />
      
      <Button
        variant={isEditMode ? "default" : "outline"}
        className={`${isEditMode ? "bg-app-purple hover:bg-app-purple/90" : ""} flex items-center gap-2`}
        onClick={toggleEditMode}
      >
        <Edit className="h-4 w-4" />
        {isEditMode ? "Exit Layout Editor" : "Edit Layout"}
      </Button>
    </div>
  );
}
