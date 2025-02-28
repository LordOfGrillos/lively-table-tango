
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TableProps, TableShape } from "@/components/tables/TableShape";
import { Layers, Plus, Save, X, CornerDownLeft } from "lucide-react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

type TableWithPosition = Omit<TableProps, 'onClick'> & { 
  position: { x: number; y: number };
};

type TableLayoutEditorProps = {
  tables: TableWithPosition[];
  onTablesUpdate: (tables: TableWithPosition[]) => void;
  onClose: () => void;
};

export function TableLayoutEditor({ 
  tables, 
  onTablesUpdate,
  onClose
}: TableLayoutEditorProps) {
  const [selectedTableType, setSelectedTableType] = useState<'round' | 'rectangular'>('round');
  const [selectedCapacity, setSelectedCapacity] = useState('2');
  
  const handleAddTable = () => {
    const newTableNumber = `T${tables.length + 30}`;
    const newTable: TableWithPosition = {
      id: `t${Date.now()}`,
      number: newTableNumber,
      status: 'available',
      capacity: parseInt(selectedCapacity),
      shape: selectedTableType,
      position: { x: 20, y: 20 } // Default position
    };
    
    onTablesUpdate([...tables, newTable]);
    toast.success(`Table ${newTableNumber} added`);
  };
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    // Create a copy of the tables array
    const updatedTables = [...tables];
    
    // Find the table being dragged
    const tableIndex = updatedTables.findIndex(table => table.id === draggableId);
    if (tableIndex === -1) return;
    
    // Update the position based on the drop location
    // Note: Here we calculate position based on the drop coordinates
    // In a real app, you might want to snap to a grid or check for collisions
    const newPosition = {
      x: destination.x - source.x + updatedTables[tableIndex].position.x,
      y: destination.y - source.y + updatedTables[tableIndex].position.y
    };
    
    updatedTables[tableIndex] = {
      ...updatedTables[tableIndex],
      position: newPosition
    };
    
    onTablesUpdate(updatedTables);
  };
  
  const handleRemoveTable = (tableId: string) => {
    const updatedTables = tables.filter(table => table.id !== tableId);
    onTablesUpdate(updatedTables);
    toast.success("Table removed");
  };
  
  const handleSaveLayout = () => {
    // In a real app, you would save to a database here
    toast.success("Layout saved successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Layers className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Layout Editor</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="default"
            className="bg-app-purple hover:bg-app-purple/90 flex items-center gap-2"
            onClick={handleSaveLayout}
          >
            <Save className="h-4 w-4" />
            Save Layout
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="w-64 border-r p-4 bg-gray-50">
          <h3 className="text-sm font-medium mb-4">Add New Table</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Table Shape</label>
              <Select 
                value={selectedTableType} 
                onValueChange={(val) => setSelectedTableType(val as 'round' | 'rectangular')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round">Round</SelectItem>
                  <SelectItem value="rectangular">Rectangular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Capacity</label>
              <Select 
                value={selectedCapacity}
                onValueChange={setSelectedCapacity}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  {[2, 4, 6, 8, 10, 12].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} seats
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full flex items-center justify-center gap-2 bg-app-purple hover:bg-app-purple/90"
              onClick={handleAddTable}
            >
              <Plus className="h-4 w-4" />
              Add Table
            </Button>
          </div>
          
          <div className="mt-8">
            <h3 className="text-sm font-medium mb-4">Instructions</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <CornerDownLeft className="h-4 w-4 text-gray-400" />
                Drag tables to position them
              </li>
              <li className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-gray-400" />
                Add tables from the panel
              </li>
              <li className="flex items-center gap-2">
                <Save className="h-4 w-4 text-gray-400" />
                Save when finished
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto bg-gray-100 relative">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tables-layout" type="TABLE">
              {(provided) => (
                <div
                  className="min-h-full w-full relative"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tables.map((table, index) => (
                    <Draggable key={table.id} draggableId={table.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            position: 'absolute',
                            left: table.position.x,
                            top: table.position.y,
                            ...provided.draggableProps.style,
                          }}
                          className="group"
                        >
                          <TableShape
                            {...table}
                            className="shadow-md"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveTable(table.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
