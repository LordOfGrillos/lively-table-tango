
import { TableActionPanel } from "@/components/tables/TableActionPanel";
import { TableLayoutEditor } from "@/components/tables/TableLayoutEditor";
import { 
  TableHeader, 
  TableContent, 
  useTableManager 
} from "@/components/tables/manager";

// Extend the props interface for TableManager
interface TableManagerProps {
  onTableSelect?: (tableId: string, tableNumber: string) => void;
}

export function TableManager({ onTableSelect }: TableManagerProps) {
  const {
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
  } = useTableManager(onTableSelect);
  
  return (
    <div className="h-full">
      <TableHeader
        floors={floors}
        currentFloor={currentFloor}
        isEditMode={isEditMode}
        onFloorChange={handleFloorChange}
        onFloorsUpdate={handleFloorsUpdate}
        toggleEditMode={toggleEditMode}
      />
      
      {isEditMode ? (
        <TableLayoutEditor
          tables={filteredTables}
          onTablesUpdate={handleTablesUpdate}
          onClose={() => toggleEditMode()}
        />
      ) : (
        <TableContent
          filteredTables={filteredTables}
          selectedTable={selectedTable}
          selectedFilters={selectedFilters}
          onTableClick={handleTableClick}
          onFilterChange={setSelectedFilters}
          onSearch={setSearchQuery}
        />
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
