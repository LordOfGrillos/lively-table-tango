
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type Floor = {
  id: string;
  name: string;
  description?: string;
};

type FloorManagerProps = {
  floors: Floor[];
  currentFloor: string;
  onFloorChange: (floorId: string) => void;
  onFloorsUpdate: (floors: Floor[]) => void;
};

export function FloorManager({ 
  floors, 
  currentFloor, 
  onFloorChange, 
  onFloorsUpdate 
}: FloorManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [floorName, setFloorName] = useState("");
  const [floorDescription, setFloorDescription] = useState("");
  const [editingFloorId, setEditingFloorId] = useState<string | null>(null);

  const handleAddFloor = () => {
    if (!floorName.trim()) {
      toast.error("Floor name is required");
      return;
    }

    const newFloor: Floor = {
      id: `floor-${Date.now()}`,
      name: floorName.trim(),
      description: floorDescription.trim() || undefined
    };

    const updatedFloors = [...floors, newFloor];
    onFloorsUpdate(updatedFloors);
    
    // Reset form
    setFloorName("");
    setFloorDescription("");
    setIsDialogOpen(false);
    
    toast.success("Floor added successfully");
  };

  const handleEditFloor = () => {
    if (!editingFloorId || !floorName.trim()) {
      toast.error("Floor name is required");
      return;
    }

    const updatedFloors = floors.map(floor => 
      floor.id === editingFloorId 
        ? { 
            ...floor, 
            name: floorName.trim(), 
            description: floorDescription.trim() || undefined 
          } 
        : floor
    );
    
    onFloorsUpdate(updatedFloors);
    
    // Reset form
    setFloorName("");
    setFloorDescription("");
    setEditingFloorId(null);
    setIsEditMode(false);
    setIsDialogOpen(false);
    
    toast.success("Floor updated successfully");
  };

  const handleDeleteFloor = (floorId: string) => {
    if (floors.length <= 1) {
      toast.error("You must have at least one floor");
      return;
    }
    
    // If deleting the current floor, switch to the first available floor
    if (floorId === currentFloor) {
      const nextFloor = floors.find(f => f.id !== floorId);
      if (nextFloor) {
        onFloorChange(nextFloor.id);
      }
    }
    
    const updatedFloors = floors.filter(floor => floor.id !== floorId);
    onFloorsUpdate(updatedFloors);
    
    toast.success("Floor deleted successfully");
  };

  const openEditDialog = (floor: Floor) => {
    setEditingFloorId(floor.id);
    setFloorName(floor.name);
    setFloorDescription(floor.description || "");
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setFloorName("");
    setFloorDescription("");
    setEditingFloorId(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="flex-1 flex items-center space-x-2 overflow-x-auto pb-2 hide-scrollbar">
        {floors.map(floor => (
          <div key={floor.id} className="flex-shrink-0">
            <Button
              variant={currentFloor === floor.id ? "default" : "outline"}
              className={`h-9 px-4 ${currentFloor === floor.id ? "bg-app-purple hover:bg-app-purple/90" : ""}`}
              onClick={() => onFloorChange(floor.id)}
            >
              {floor.name}
            </Button>
          </div>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="flex-shrink-0"
            onClick={openAddDialog}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Floor" : "Add New Floor"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="floor-name">Floor Name</Label>
              <Input
                id="floor-name"
                value={floorName}
                onChange={(e) => setFloorName(e.target.value)}
                placeholder="e.g. Ground Floor, Outdoor Area"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="floor-description">Description (Optional)</Label>
              <Input
                id="floor-description"
                value={floorDescription}
                onChange={(e) => setFloorDescription(e.target.value)}
                placeholder="Brief description of the floor"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={isEditMode ? handleEditFloor : handleAddFloor}
              className="bg-app-purple hover:bg-app-purple/90"
            >
              {isEditMode ? "Save Changes" : "Add Floor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {floors.length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="flex-shrink-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Manage Floors</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {floors.map(floor => (
                  <div 
                    key={floor.id} 
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div>
                      <h4 className="font-medium">{floor.name}</h4>
                      {floor.description && (
                        <p className="text-sm text-gray-500">{floor.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(floor)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteFloor(floor.id)}
                        disabled={floors.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
