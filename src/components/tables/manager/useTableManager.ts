
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
  
  // Multi-table selection
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  
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
    if (isEditMode) return;
    
    if (isMultiSelectMode) {
      // In multi-select mode, toggle the selected state of the clicked table
      setSelectedTables(prev => {
        if (prev.includes(tableId)) {
          return prev.filter(id => id !== tableId);
        } else {
          return [...prev, tableId];
        }
      });
    } else {
      // In single-select mode, behave as before
      setSelectedTable(tableId);
      
      if (onTableSelect) {
        const table = tables.find(t => t.id === tableId);
        if (table) {
          onTableSelect(tableId, table.number);
        }
      }
    }
  };
  
  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedTables([]);
    setSelectedTable(null);
  };
  
  const getSelectedTablesDetails = () => {
    return tables.filter(table => selectedTables.includes(table.id));
  };
  
  const getSelectedTablesOrders = () => {
    return orders.filter(order => 
      selectedTables.includes(order.tableId) && 
      (order.status === 'new' || order.status === 'in-progress')
    );
  };
  
  const handleTransferTables = (targetTableId: string) => {
    if (selectedTables.length === 0 || !targetTableId) return;
    
    // Get all orders from selected tables
    const ordersToTransfer = orders.filter(order => 
      selectedTables.includes(order.tableId) && 
      (order.status === 'new' || order.status === 'in-progress')
    );
    
    if (ordersToTransfer.length === 0) {
      toast.error("No active orders to transfer");
      return;
    }
    
    // Update all orders to the target table
    const targetTable = tables.find(t => t.id === targetTableId);
    if (!targetTable) return;
    
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (selectedTables.includes(order.tableId) && (order.status === 'new' || order.status === 'in-progress')) {
          return {
            ...order,
            tableId: targetTableId,
            tableNumber: targetTable.number
          };
        }
        return order;
      });
    });
    
    // Update status of the tables
    setTables(prevTables => {
      return prevTables.map(table => {
        if (selectedTables.includes(table.id)) {
          return {
            ...table,
            status: 'available',
            timer: undefined
          };
        } else if (table.id === targetTableId) {
          return {
            ...table,
            status: 'occupied',
            timer: 0
          };
        }
        return table;
      });
    });
    
    toast.success(`Orders transferred to Table ${targetTable.number}`, {
      description: `${ordersToTransfer.length} orders successfully moved`
    });
    
    // Reset selection
    setSelectedTables([]);
    setIsMultiSelectMode(false);
  };
  
  const handleCombineTables = (combinedTableId: string) => {
    if (selectedTables.length === 0 || !combinedTableId) return;
    
    // Get all orders from selected tables
    const ordersToCombine = orders.filter(order => 
      selectedTables.includes(order.tableId) && 
      (order.status === 'new' || order.status === 'in-progress')
    );
    
    if (ordersToCombine.length === 0) {
      toast.error("No active orders to combine");
      return;
    }
    
    // Find the target table
    const targetTable = tables.find(t => t.id === combinedTableId);
    if (!targetTable) return;
    
    // Create a new combined order
    const allItems = ordersToCombine.flatMap(order => order.items);
    const totalAmount = ordersToCombine.reduce((sum, order) => sum + order.total, 0);
    
    const combinedOrder: Order = {
      id: `order-combined-${Date.now()}`,
      tableId: combinedTableId,
      tableNumber: targetTable.number,
      status: 'in-progress',
      customerName: 'Combined Order',
      items: allItems,
      createdAt: new Date(),
      total: totalAmount
    };
    
    // Remove the original orders and add the combined one
    setOrders(prevOrders => {
      const remainingOrders = prevOrders.filter(order => 
        !(selectedTables.includes(order.tableId) && (order.status === 'new' || order.status === 'in-progress'))
      );
      return [...remainingOrders, combinedOrder];
    });
    
    // Update table statuses
    setTables(prevTables => {
      return prevTables.map(table => {
        if (selectedTables.includes(table.id) && table.id !== combinedTableId) {
          return {
            ...table,
            status: 'available',
            timer: undefined
          };
        } else if (table.id === combinedTableId) {
          return {
            ...table,
            status: 'occupied',
            timer: 0
          };
        }
        return table;
      });
    });
    
    toast.success(`Orders combined on Table ${targetTable.number}`, {
      description: `${ordersToCombine.length} orders successfully combined`
    });
    
    // Reset selection
    setSelectedTables([]);
    setIsMultiSelectMode(false);
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
    // Multi-select related
    isMultiSelectMode,
    selectedTables,
    toggleMultiSelectMode,
    getSelectedTablesDetails,
    getSelectedTablesOrders,
    handleTransferTables,
    handleCombineTables,
    // Original functions
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
