
import { TableActionPanel } from "@/components/tables/TableActionPanel";
import { TableLayoutEditor } from "@/components/tables/TableLayoutEditor";
import { MultiTableActionPanel } from "@/components/tables/MultiTableActionPanel";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";
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
    // Multi-select related
    isMultiSelectMode,
    selectedTables,
    toggleMultiSelectMode,
    getSelectedTablesDetails,
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
  } = useTableManager(onTableSelect);
  
  const selectedTablesDetails = getSelectedTablesDetails();
  
  return (
    <div className="h-full">
      <TableHeader
        floors={floors}
        currentFloor={currentFloor}
        isEditMode={isEditMode}
        onFloorChange={handleFloorChange}
        onFloorsUpdate={handleFloorsUpdate}
        toggleEditMode={toggleEditMode}
        rightAction={
          !isEditMode && !onTableSelect && (
            <Button
              variant={isMultiSelectMode ? "default" : "outline"}
              className={isMultiSelectMode ? "bg-app-purple hover:bg-app-purple/90" : ""}
              onClick={toggleMultiSelectMode}
            >
              <ListChecks className="mr-2 h-4 w-4" />
              {isMultiSelectMode ? "Exit Multi-Select" : "Select Multiple"}
            </Button>
          )
        }
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
          multiSelectMode={isMultiSelectMode}
          selectedTables={selectedTables}
        />
      )}
      
      {selectedTable && !isEditMode && !onTableSelect && !isMultiSelectMode && (
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
      
      {isMultiSelectMode && selectedTables.length > 0 && (
        <MultiTableActionPanel
          selectedTables={selectedTablesDetails}
          availableTables={filteredTables}
          onTransferTables={handleTransferTables}
          onCombineTables={handleCombineTables}
          onClose={toggleMultiSelectMode}
        />
      )}
    </div>
  );
}
