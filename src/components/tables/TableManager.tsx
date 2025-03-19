
import { useState, useEffect } from "react";
import { TableShape, TableStatus, TableProps } from "@/components/tables/TableShape";
import { TableFilterBar } from "@/components/tables/TableFilterBar";
import { TableActionPanel, Order } from "@/components/tables/TableActionPanel";
import { FloorManager, Floor } from "@/components/tables/FloorManager";
import { TableLayoutEditor } from "@/components/tables/TableLayoutEditor";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

// Type extending TableProps with position
type TableWithPosition = Omit<TableProps, 'onClick'> & {
  position: { x: number; y: number };
  floorId?: string;
};

// Extend the props interface for TableManager
interface TableManagerProps {
  onTableSelect?: (tableId: string, tableNumber: string) => void;
}

// Mock data for tables with positions
const generateInitialTables = (): TableWithPosition[] => {
  // Convert initial tables to include positions
  return [
    { id: 't12', number: 'T12', status: 'available', capacity: 2, shape: 'round', position: { x: 50, y: 50 }, floorId: 'floor-main' },
    { id: 't13', number: 'T13', status: 'reserved', capacity: 4, shape: 'round', position: { x: 200, y: 50 }, floorId: 'floor-main' },
    { id: 't14', number: 'T14', status: 'occupied', capacity: 8, shape: 'rectangular', timer: 30, position: { x: 350, y: 50 }, floorId: 'floor-main' },
    { id: 't15', number: 'T15', status: 'reserved', capacity: 2, shape: 'round', position: { x: 50, y: 180 }, floorId: 'floor-main' },
    { id: 't16', number: 'T16', status: 'available', capacity: 4, shape: 'rectangular', position: { x: 200, y: 180 }, floorId: 'floor-main' },
    { id: 't17', number: 'T17', status: 'available', capacity: 2, shape: 'round', position: { x: 350, y: 180 }, floorId: 'floor-main' },
    { id: 't18', number: 'T18', status: 'occupied', capacity: 6, shape: 'rectangular', timer: 45, position: { x: 50, y: 310 }, floorId: 'floor-main' },
    { id: 't19', number: 'T19', status: 'available', capacity: 4, shape: 'rectangular', position: { x: 200, y: 310 }, floorId: 'floor-main' },
    { id: 't20', number: 'T20', status: 'available', capacity: 2, shape: 'round', position: { x: 350, y: 310 }, floorId: 'floor-main' },
    { id: 't21', number: 'T21', status: 'filled', capacity: 4, shape: 'round', position: { x: 100, y: 100 }, floorId: 'floor-outdoor' },
    { id: 't22', number: 'T22', status: 'available', capacity: 8, shape: 'rectangular', position: { x: 250, y: 100 }, floorId: 'floor-outdoor' },
    { id: 't23', number: 'T23', status: 'reserved', capacity: 2, shape: 'round', position: { x: 100, y: 230 }, floorId: 'floor-outdoor' },
    { id: 't24', number: 'T24', status: 'filled', capacity: 4, shape: 'rectangular', position: { x: 250, y: 230 }, floorId: 'floor-outdoor' },
    { id: 't25', number: 'T25', status: 'available', capacity: 2, shape: 'round', position: { x: 100, y: 100 }, floorId: 'floor-private' },
    { id: 't26', number: 'T26', status: 'available', capacity: 2, shape: 'round', position: { x: 230, y: 100 }, floorId: 'floor-private' },
    { id: 't27', number: 'T27', status: 'available', capacity: 6, shape: 'rectangular', position: { x: 360, y: 100 }, floorId: 'floor-private' },
    { id: 't28', number: 'T28', status: 'available', capacity: 4, shape: 'round', position: { x: 120, y: 50 }, floorId: 'floor-bar' },
    { id: 't29', number: 'T29', status: 'available', capacity: 4, shape: 'round', position: { x: 320, y: 50 }, floorId: 'floor-bar' },
  ];
};

// Initial floors
const initialFloors: Floor[] = [
  { id: 'floor-main', name: 'Main Dining' },
  { id: 'floor-outdoor', name: 'Outdoor' },
  { id: 'floor-private', name: 'Private Rooms' },
  { id: 'floor-bar', name: 'Bar Area' },
];

export function TableManager({ onTableSelect }: TableManagerProps) {
  const [tables, setTables] = useState<TableWithPosition[]>(generateInitialTables());
  const [floors, setFloors] = useState<Floor[]>(initialFloors);
  const [currentFloor, setCurrentFloor] = useState<string>(floors[0].id);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<TableStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Get selected table details for action panel
  const selectedTableDetails = selectedTable
    ? tables.find(table => table.id === selectedTable)
    : undefined;
    
  // Get existing order for the selected table
  const existingOrder = selectedTable 
    ? orders.find(order => order.tableId === selectedTable && order.status !== 'completed')
    : null;
  
  // Filter tables based on selected filters, search query, and current floor
  const filteredTables = tables.filter(table => {
    // Check if table belongs to current floor
    const floorMatch = table.floorId === currentFloor;
    
    // Apply status filters if any are selected
    const statusMatch = selectedFilters.length === 0 || selectedFilters.includes(table.status);
    
    // Apply search filter
    const searchMatch = !searchQuery || 
      table.number.toLowerCase().includes(searchQuery.toLowerCase());
    
    return floorMatch && statusMatch && searchMatch;
  });
  
  // Handle table click
  const handleTableClick = (tableId: string) => {
    // Don't select tables in edit mode
    if (!isEditMode) {
      setSelectedTable(tableId);
      
      // If onTableSelect is provided (when creating order), call it
      if (onTableSelect) {
        const table = tables.find(t => t.id === tableId);
        if (table) {
          onTableSelect(tableId, table.number);
        }
      }
    }
  };
  
  // Handle status change
  const handleStatusChange = (tableId: string, newStatus: TableStatus) => {
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId 
          ? { 
              ...table, 
              status: newStatus,
              // Add or remove timer based on status
              timer: newStatus === 'occupied' ? 0 : (newStatus === 'available' ? undefined : table.timer)
            } 
          : table
      )
    );
    
    // Auto-close action panel after status change
    setSelectedTable(null);
  };
  
  // Handle reservation creation
  const handleReservationCreate = (tableId: string, data: any) => {
    // Here you would typically send this to your backend
    console.log("Reservation created:", data);
    
    toast.success("Reservation created successfully", {
      description: `Table ${data.tableId} reserved for ${data.customerName}`
    });
    
    // Auto-close action panel after reservation
    setSelectedTable(null);
  };
  
  // Handle order creation
  const handleOrderCreate = (tableId: string, order: Order) => {
    setOrders(prevOrders => [...prevOrders, order]);
    
    // Auto-close action panel after order creation
    setSelectedTable(null);
  };
  
  // Handle order update
  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    
    // If order is completed, update table status
    if (updatedOrder.status === 'completed') {
      handleStatusChange(updatedOrder.tableId, 'available');
    }
  };

  // Handle floor change
  const handleFloorChange = (floorId: string) => {
    setCurrentFloor(floorId);
    setSelectedTable(null); // Clear selected table when changing floors
  };

  // Handle floor updates
  const handleFloorsUpdate = (updatedFloors: Floor[]) => {
    setFloors(updatedFloors);
  };

  // Handle tables update from layout editor
  const handleTablesUpdate = (updatedTables: TableWithPosition[]) => {
    // Only update tables for the current floor, preserving tables from other floors
    const otherFloorTables = tables.filter(table => table.floorId !== currentFloor);
    
    // Ensure all updated tables have the current floor ID
    const floorsUpdatedTables = updatedTables.map(table => ({
      ...table,
      floorId: currentFloor
    }));
    
    // Make sure the positions are properly maintained
    const tablesWithPositions = floorsUpdatedTables.map(table => ({
      ...table,
      position: table.position // Explicitly keep the positions
    }));
    
    setTables([...otherFloorTables, ...tablesWithPositions]);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedTable(null); // Clear selected table when toggling edit mode
  };
  
  // Update occupied table timers every minute
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTables(prevTables => 
        prevTables.map(table => 
          table.status === 'occupied' && typeof table.timer === 'number'
            ? { ...table, timer: table.timer + 1 }
            : table
        )
      );
    }, 60000); // Update every minute
    
    return () => clearInterval(timerInterval);
  }, []);
  
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <FloorManager
          floors={floors}
          currentFloor={currentFloor}
          onFloorChange={handleFloorChange}
          onFloorsUpdate={handleFloorsUpdate}
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
      
      {isEditMode ? (
        <TableLayoutEditor
          tables={filteredTables}
          onTablesUpdate={handleTablesUpdate}
          onClose={() => setIsEditMode(false)}
        />
      ) : (
        <>
          <TableFilterBar
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
            onSearch={setSearchQuery}
          />
          
          <div className="relative min-h-[500px] bg-gray-50 border rounded-lg p-6">
            {filteredTables.map(table => (
              <div
                key={table.id}
                style={{
                  position: 'absolute',
                  left: `${table.position.x}px`,
                  top: `${table.position.y}px`,
                }}
              >
                <TableShape
                  {...table}
                  selected={selectedTable === table.id}
                  onClick={handleTableClick}
                />
              </div>
            ))}
            
            {filteredTables.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                No tables on this floor. Use the layout editor to add tables.
              </div>
            )}
          </div>
        </>
      )}
      
      {selectedTable && !isEditMode && !onTableSelect && (
        <TableActionPanel
          selectedTable={selectedTableDetails as any}
          onClose={() => setSelectedTable(null)}
          onStatusChange={handleStatusChange}
          onReservationCreate={handleReservationCreate}
          onOrderCreate={handleOrderCreate}
          onOrderUpdate={handleOrderUpdate}
          existingOrder={existingOrder}
        />
      )}
    </div>
  );
}
