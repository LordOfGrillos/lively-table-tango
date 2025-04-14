
import { ArrowUpDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InventoryTableHeaderProps {
  toggleSort: (field: string) => void;
}

export function InventoryTableHeader({ toggleSort }: InventoryTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[250px]">
          <button
            className="flex items-center gap-1 hover:text-app-purple"
            onClick={() => toggleSort("name")}
          >
            Item Name
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </TableHead>
        <TableHead>
          <button
            className="flex items-center gap-1 hover:text-app-purple"
            onClick={() => toggleSort("type")}
          >
            Type
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </TableHead>
        <TableHead>
          <button
            className="flex items-center gap-1 hover:text-app-purple"
            onClick={() => toggleSort("category")}
          >
            Category
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </TableHead>
        <TableHead className="text-right">
          <button
            className="flex items-center gap-1 hover:text-app-purple ml-auto"
            onClick={() => toggleSort("currentStock")}
          >
            Stock
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </TableHead>
        <TableHead className="text-right">
          <button
            className="flex items-center gap-1 hover:text-app-purple ml-auto"
            onClick={() => toggleSort("cost")}
          >
            Cost
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </TableHead>
        <TableHead>
          <button
            className="flex items-center gap-1 hover:text-app-purple"
            onClick={() => toggleSort("status")}
          >
            Status
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </TableHead>
        <TableHead>
          <button
            className="flex items-center gap-1 hover:text-app-purple"
            onClick={() => toggleSort("lastRestocked")}
          >
            Last Restocked
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
