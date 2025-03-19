
import { TableShape, TableProps } from "@/components/tables/TableShape";

type TableWithPositionProps = {
  tables: Array<Omit<TableProps, 'onClick'> & {
    position: { x: number; y: number };
    floorId?: string;
  }>;
  selectedTable: string | null;
  onTableClick: (tableId: string) => void;
  multiSelectMode?: boolean;
  selectedTables?: string[];
};

export function TablePositioning({ 
  tables, 
  selectedTable, 
  onTableClick,
  multiSelectMode = false,
  selectedTables = []
}: TableWithPositionProps) {
  if (tables.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
        No tables on this floor. Use the layout editor to add tables.
      </div>
    );
  }

  return (
    <>
      {tables.map(table => (
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
            selected={multiSelectMode ? selectedTables.includes(table.id) : selectedTable === table.id}
            onClick={onTableClick}
            multiSelect={multiSelectMode}
          />
        </div>
      ))}
    </>
  );
}
