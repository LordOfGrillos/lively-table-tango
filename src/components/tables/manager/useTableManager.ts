import { useState, useEffect } from "react";
import { TableStatus } from "@/components/tables/TableShape";
import { Order } from "@/components/tables/TableActionPanel";
import { Floor } from "@/components/tables/FloorManager";
import { toast } from "sonner";

// Type extending TableProps with position
export type TableWithPosition = {
  id: string;
  number: string;
  status: TableStatus;
  capacity: number;
  shape: 'round' | 'rectangular';
  timer?: number;
  position: { x: number; y: number };
  floorId?: string;
};

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

export function useTableManager(onTableSelect?: (tableId: string, tableNumber: string) => void) {
  const [tables, setTables] = useState<TableWithPosition[]>(generateInitialTables());
  const [floors, setFloors] = useState<Floor[]>(initialFloors);
  const [currentFloor, setCurrentFloor] = useState<string>(floors[0].id);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<TableStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const selectedTableDetails = selectedTable
    ? tables.find(table => table.id === selectedTable)
    : undefined;
    
  const existingOrder = selectedTable 
    ? orders.find(order => order.tableId === selectedTable && order.status !== 'completed')
    : null;
  
  const filteredTables = tables.filter(table => {
    const floorMatch = table.floorId === currentFloor;
    
    const statusMatch = selectedFilters.length === 0 || selectedFilters.includes(table.status);
    
    const searchMatch = !searchQuery || 
      table.number.toLowerCase().includes(searchQuery.toLowerCase());
    
    return floorMatch && statusMatch && searchMatch;
  });
  
  const handleTableClick = (tableId: string) => {
    if (!isEditMode) {
      setSelectedTable(tableId);
      
      if (onTableSelect) {
        const table = tables.find(t => t.id === tableId);
        if (table) {
          onTableSelect(tableId, table.number);
        }
      }
    }
  };
  
  const handleStatusChange = (tableId: string, newStatus: TableStatus) => {
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId 
          ? { 
              ...table, 
              status: newStatus,
              timer: newStatus === 'occupied' ? 0 : (newStatus === 'available' ? undefined : table.timer)
            } 
          : table
      )
    );
    
    setSelectedTable(null);
  };
  
  const handleReservationCreate = (tableId: string, data: any) => {
    console.log("Reservation created:", data);
    
    toast.success("Reservation created successfully", {
      description: `Table ${data.tableId} reserved for ${data.customerName}`
    });
    
    setSelectedTable(null);
  };
  
  const handleOrderCreate = (tableId: string, order: Order) => {
    setOrders(prevOrders => [...prevOrders, order]);
    
    setSelectedTable(null);
  };
  
  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    
    if (updatedOrder.status === 'completed') {
      handleStatusChange(updatedOrder.tableId, 'available');
    }
  };

  const handleFloorChange = (floorId: string) => {
    setCurrentFloor(floorId);
    setSelectedTable(null);
  };

  const handleFloorsUpdate = (updatedFloors: Floor[]) => {
    setFloors(updatedFloors);
  };

  const handleTablesUpdate = (updatedTables: TableWithPosition[]) => {
    const otherFloorTables = tables.filter(table => table.floorId !== currentFloor);
    
    const floorsUpdatedTables = updatedTables.map(table => ({
      ...table,
      floorId: currentFloor
    }));
    
    const tablesWithPositions = floorsUpdatedTables.map(table => ({
      ...table,
      position: table.position
    }));
    
    setTables([...otherFloorTables, ...tablesWithPositions]);
  };
  
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedTable(null);
  };
  
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTables(prevTables => 
        prevTables.map(table => 
          table.status === 'occupied' && typeof table.timer === 'number'
            ? { ...table, timer: table.timer + 1 }
            : table
        )
      );
    }, 60000);
    
    return () => clearInterval(timerInterval);
  }, []);

  return {
    tables,
    filteredTables,
    floors,
    currentFloor,
    selectedTable,
    selectedFilters,
    isEditMode,
    selectedTableDetails,
    existingOrder,
    handleTableClick,
    handleStatusChange,
    handleReservationCreate,
    handleOrderCreate,
    handleOrderUpdate,
    handleFloorChange,
    handleFloorsUpdate,
    handleTablesUpdate,
    toggleEditMode,
    setSelectedFilters,
    setSearchQuery,
    setSelectedTable
  };
}
