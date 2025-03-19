
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Building2, Plus, Edit } from "lucide-react";
import { Floor } from "@/components/tables/FloorManager";

interface FloorSelectorProps {
  floors: Floor[];
  currentFloor: string;
  isManaging: boolean;
  onFloorSelect: (floorId: string) => void;
  onFloorsUpdate: (floors: Floor[]) => void;
  onManageToggle: () => void;
}

export function FloorSelector({
  floors,
  currentFloor,
  isManaging,
  onFloorSelect,
  onFloorsUpdate,
  onManageToggle
}: FloorSelectorProps) {
  const currentFloorDetails = floors.find(f => f.id === currentFloor);
  
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Building2 className="h-4 w-4" />
            {currentFloorDetails?.name || "Select Floor"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select Floor</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {floors.map(floor => (
            <DropdownMenuItem 
              key={floor.id}
              className={currentFloor === floor.id ? "bg-gray-100" : ""}
              onClick={() => onFloorSelect(floor.id)}
            >
              {floor.name}
              {floor.description && (
                <span className="text-xs text-gray-500 ml-2">
                  {floor.description}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="ghost" 
        size="icon"
        onClick={onManageToggle}
        className={isManaging ? "bg-gray-100" : ""}
      >
        {isManaging ? <Plus className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
      </Button>
    </div>
  );
}
