
import { useState, useEffect } from "react";
import { TableShape, TableStatus, TableProps } from "@/components/tables/TableShape";
import { TableFilterBar } from "@/components/tables/TableFilterBar";
import { TableActionPanel } from "@/components/tables/TableActionPanel";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for tables
const initialTables: Omit<TableProps, 'onClick'>[] = [
  { id: 't12', number: 'T12', status: 'available', capacity: 2, shape: 'round' },
  { id: 't13', number: 'T13', status: 'reserved', capacity: 4, shape: 'round' },
  { id: 't14', number: 'T14', status: 'occupied', capacity: 8, shape: 'rectangular', timer: 30 },
  { id: 't15', number: 'T15', status: 'reserved', capacity: 2, shape: 'round' },
  { id: 't16', number: 'T16', status: 'available', capacity: 4, shape: 'rectangular' },
  { id: 't17', number: 'T17', status: 'available', capacity: 2, shape: 'round' },
  { id: 't18', number: 'T18', status: 'occupied', capacity: 6, shape: 'rectangular', timer: 45 },
  { id: 't19', number: 'T19', status: 'available', capacity: 4, shape: 'rectangular' },
  { id: 't20', number: 'T20', status: 'available', capacity: 2, shape: 'round' },
  { id: 't21', number: 'T21', status: 'filled', capacity: 4, shape: 'round' },
  { id: 't22', number: 'T22', status: 'available', capacity: 8, shape: 'rectangular' },
  { id: 't23', number: 'T23', status: 'reserved', capacity: 2, shape: 'round' },
  { id: 't24', number: 'T24', status: 'filled', capacity: 4, shape: 'rectangular' },
  { id: 't25', number: 'T25', status: 'available', capacity: 2, shape: 'round' },
  { id: 't26', number: 'T26', status: 'available', capacity: 2, shape: 'round' },
  { id: 't27', number: 'T27', status: 'available', capacity: 6, shape: 'rectangular' },
  { id: 't28', number: 'T28', status: 'available', capacity: 4, shape: 'round' },
  { id: 't29', number: 'T29', status: 'available', capacity: 4, shape: 'round' },
];

// Areas/zones for the restaurant
const areas = [
  { id: 'main', name: 'Main Dining' },
  { id: 'outdoor', name: 'Outdoor' },
  { id: 'private', name: 'Private Rooms' },
  { id: 'bar', name: 'Bar Area' },
];

export function TableManager() {
  const [tables, setTables] = useState<Omit<TableProps, 'onClick'>[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<TableStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentArea, setCurrentArea] = useState('main');
  
  // Get selected table details for action panel
  const selectedTableDetails = selectedTable
    ? tables.find(table => table.id === selectedTable)
    : undefined;
  
  // Filter tables based on selected filters and search query
  const filteredTables = tables.filter(table => {
    // Apply status filters if any are selected
    const statusMatch = selectedFilters.length === 0 || selectedFilters.includes(table.status);
    
    // Apply search filter
    const searchMatch = !searchQuery || 
      table.number.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });
  
  // Handle table click
  const handleTableClick = (tableId: string) => {
    setSelectedTable(tableId);
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
      <Tabs defaultValue="main" onValueChange={setCurrentArea}>
        <TabsList className="mb-6">
          {areas.map(area => (
            <TabsTrigger 
              key={area.id} 
              value={area.id}
              className="px-6"
            >
              {area.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {areas.map(area => (
          <TabsContent key={area.id} value={area.id} className="outline-none">
            <TableFilterBar
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
              onSearch={setSearchQuery}
            />
            
            <div className="table-grid p-1">
              {filteredTables.map(table => (
                <TableShape
                  key={table.id}
                  {...table}
                  selected={selectedTable === table.id}
                  onClick={handleTableClick}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {selectedTable && (
        <TableActionPanel
          selectedTable={selectedTableDetails as any}
          onClose={() => setSelectedTable(null)}
          onStatusChange={handleStatusChange}
          onReservationCreate={handleReservationCreate}
        />
      )}
    </div>
  );
}
