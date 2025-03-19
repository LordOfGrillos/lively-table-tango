
import { Button } from "@/components/ui/button";
import { TableStatus } from "@/components/tables/TableShape";
import { toast } from "sonner";

interface StatusTabProps {
  selectedTable: {
    id: string;
    number: string;
    status: TableStatus;
  };
  onStatusChange: (tableId: string, status: TableStatus) => void;
}

export function StatusTab({ selectedTable, onStatusChange }: StatusTabProps) {
  const handleStatusChange = (status: TableStatus) => {
    onStatusChange(selectedTable.id, status);
    
    const statusMessages = {
      available: "Table is now available",
      reserved: "Table has been reserved",
      occupied: "Table is now occupied",
      filled: "Table is now filled"
    };
    
    toast.success(statusMessages[status], {
      description: `Table ${selectedTable.number} status updated`
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button 
        variant="outline"
        className="bg-table-available text-green-800 hover:bg-table-available/80 border-none"
        onClick={() => handleStatusChange('available')}
      >
        Available
      </Button>
      <Button 
        variant="outline"
        className="bg-table-reserved text-red-800 hover:bg-table-reserved/80 border-none"
        onClick={() => handleStatusChange('reserved')}
      >
        Reserved
      </Button>
      <Button 
        variant="outline"
        className="bg-table-filled text-gray-800 hover:bg-table-filled/80 border-none"
        onClick={() => handleStatusChange('filled')}
      >
        Filled
      </Button>
      <Button 
        variant="outline"
        className="bg-table-occupied text-amber-800 hover:bg-table-occupied/80 border-none"
        onClick={() => handleStatusChange('occupied')}
      >
        Occupied
      </Button>
    </div>
  );
}
