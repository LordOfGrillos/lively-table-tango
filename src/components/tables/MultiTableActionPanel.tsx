
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableWithPosition } from "@/components/tables/manager/useTableManager";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TableMergeIcon } from "@/components/tables/icons/TableMergeIcon";
import { 
  MoveRight, 
  X, 
  ListChecks
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiTableActionPanelProps {
  selectedTables: TableWithPosition[];
  availableTables: TableWithPosition[];
  onTransferTables: (targetTableId: string) => void;
  onCombineTables: (targetTableId: string) => void;
  onClose: () => void;
}

export function MultiTableActionPanel({
  selectedTables,
  availableTables,
  onTransferTables,
  onCombineTables,
  onClose
}: MultiTableActionPanelProps) {
  const [actionType, setActionType] = useState<'transfer' | 'combine'>('transfer');
  const [targetTable, setTargetTable] = useState<string>("");
  
  // Filter out selected tables from available target tables when transferring
  const transferTargetTables = availableTables.filter(
    table => !selectedTables.some(st => st.id === table.id)
  );
  
  // For combining, only use one of the selected tables as target
  const combineTargetTables = selectedTables;
  
  const handleActionSubmit = () => {
    if (!targetTable) return;
    
    if (actionType === 'transfer') {
      onTransferTables(targetTable);
    } else {
      onCombineTables(targetTable);
    }
  };
  
  if (selectedTables.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50 animate-slide-up">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-app-purple" />
            <h3 className="font-medium text-lg">Multiple Tables Selected</h3>
            <Badge className="bg-app-purple">{selectedTables.length}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm font-medium mb-2">Selected Tables:</p>
            <div className="flex flex-wrap gap-2">
              {selectedTables.map(table => (
                <Badge 
                  key={table.id} 
                  className={cn(
                    "text-sm",
                    table.status === 'available' ? "bg-green-100 text-green-800" :
                    table.status === 'reserved' ? "bg-red-100 text-red-800" :
                    table.status === 'occupied' ? "bg-amber-100 text-amber-800" :
                    "bg-gray-100 text-gray-800"
                  )}
                >
                  Table {table.number} ({table.capacity} seats)
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Action Type:</p>
            <div className="flex gap-2">
              <Button
                variant={actionType === 'transfer' ? 'default' : 'outline'}
                className={actionType === 'transfer' ? 'bg-app-purple hover:bg-app-purple/90' : ''}
                onClick={() => {
                  setActionType('transfer');
                  setTargetTable("");
                }}
              >
                <MoveRight className="h-4 w-4 mr-2" /> 
                Transfer Tables
              </Button>
              <Button
                variant={actionType === 'combine' ? 'default' : 'outline'}
                className={actionType === 'combine' ? 'bg-app-purple hover:bg-app-purple/90' : ''}
                onClick={() => {
                  setActionType('combine');
                  setTargetTable("");
                }}
              >
                <TableMergeIcon className="h-4 w-4 mr-2" /> 
                Combine Orders
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2">
            <p className="text-sm font-medium mb-2">
              {actionType === 'transfer' 
                ? 'Select Target Table for Transfer:' 
                : 'Select Table to Keep for Combined Order:'}
            </p>
            <Select value={targetTable} onValueChange={setTargetTable}>
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {(actionType === 'transfer' ? transferTargetTables : combineTargetTables).map(table => (
                  <SelectItem key={table.id} value={table.id}>
                    Table {table.number} ({table.capacity} seats)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="bg-app-purple hover:bg-app-purple/90"
            disabled={!targetTable}
            onClick={handleActionSubmit}
          >
            {actionType === 'transfer' 
              ? 'Transfer Orders' 
              : 'Combine Orders'}
          </Button>
        </div>
      </div>
    </div>
  );
}
