
import { TableFilterBar } from "@/components/tables/TableFilterBar";
import { TablePositioning } from "./TablePositioning";
import { TableStatus } from "@/components/tables/TableShape";
import { TableWithPosition } from "./useTableManager";

type TableContentProps = {
  filteredTables: TableWithPosition[];
  selectedTable: string | null;
  selectedFilters: TableStatus[];
  onTableClick: (tableId: string) => void;
  onFilterChange: (filters: TableStatus[]) => void;
  onSearch: (query: string) => void;
  multiSelectMode?: boolean;
  selectedTables?: string[];
};

export function TableContent({
  filteredTables,
  selectedTable,
  selectedFilters,
  onTableClick,
  onFilterChange,
  onSearch,
  multiSelectMode = false,
  selectedTables = []
}: TableContentProps) {
  return (
    <>
      <TableFilterBar
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
        onSearch={onSearch}
      />
      
      <div className="relative min-h-[500px] bg-gray-50 border rounded-lg p-6">
        <TablePositioning
          tables={filteredTables}
          selectedTable={selectedTable}
          onTableClick={onTableClick}
          multiSelectMode={multiSelectMode}
          selectedTables={selectedTables}
        />
      </div>
    </>
  );
}
