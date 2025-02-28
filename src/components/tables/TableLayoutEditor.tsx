
import { useState, useRef } from "react";
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
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Track positions for proper drag handling
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    tables.reduce((acc, table) => {
      acc[table.id] = table.position;
      return acc;
    }, {} as Record<string, { x: number; y: number }>)
  );
  
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
    
    const updatedTables = [...tables, newTable];
    onTablesUpdate(updatedTables);
    
    // Add the new table position to our positions state
    setPositions(prev => ({
      ...prev,
      [newTable.id]: newTable.position
    }));
    
    toast.success(`Table ${newTableNumber} added`);
  };
  
  const handleDragStart = (tableId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedTable(tableId);
    
    // Store the initial mouse position
    const initialMousePos = { x: e.clientX, y: e.clientY };
    
    // Find the initial position of the table
    const initialTablePos = positions[tableId];
    
    // Handler for mouse movement
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!draggedTable) return;
      
      // Calculate how far the mouse has moved
      const deltaX = moveEvent.clientX - initialMousePos.x;
      const deltaY = moveEvent.clientY - initialMousePos.y;
      
      // Update the table position
      const newPositions = {
        ...positions,
        [tableId]: {
          x: initialTablePos.x + deltaX,
          y: initialTablePos.y + deltaY
        }
      };
      
      setPositions(newPositions);
    };
    
    // Handler for mouse up (end drag)
    const handleMouseUp = () => {
      if (!draggedTable) return;
      
      // Update tables with new positions
      const updatedTables = tables.map(table => 
        table.id === tableId
          ? { ...table, position: positions[tableId] }
          : table
      );
      
      // Apply the changes
      onTablesUpdate(updatedTables);
      setDraggedTable(null);
      
      // Remove event listeners
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Add event listeners for dragging
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleRemoveTable = (tableId: string) => {
    const updatedTables = tables.filter(table => table.id !== tableId);
    onTablesUpdate(updatedTables);
    
    // Remove from positions state
    const newPositions = { ...positions };
    delete newPositions[tableId];
    setPositions(newPositions);
    
    toast.success("Table removed");
  };
  
  const handleSaveLayout = () => {
    // Create a new array that preserves the positions
    const updatedTables = tables.map(table => ({
      ...table,
      position: positions[table.id] // Use the positions from our state
    }));
    
    // Update the tables with their current positions
    onTablesUpdate(updatedTables);
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
        
        <div 
          ref={canvasRef}
          className="flex-1 p-4 overflow-auto bg-gray-100 relative" 
        >
          {tables.map((table) => (
            <div
              key={table.id}
              style={{
                position: 'absolute',
                left: `${positions[table.id]?.x || table.position.x}px`,
                top: `${positions[table.id]?.y || table.position.y}px`,
                cursor: draggedTable === table.id ? 'grabbing' : 'grab'
              }}
              className="group"
              onMouseDown={(e) => handleDragStart(table.id, e)}
            >
              <TableShape
                {...table}
                className="shadow-md z-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTable(table.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {tables.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              No tables on this floor. Use the controls to add tables.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
