
import { formatDistanceToNow } from "date-fns";
import { Edit, PlusCircle, MinusCircle, Trash2, MoreHorizontal } from "lucide-react";
import { InventoryItem } from "../InventoryContext";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InventoryTableRowProps {
  item: InventoryItem;
  handleEditItem: (item: InventoryItem) => void;
  handleStockAdjustment: (item: InventoryItem, type: "add" | "reduce") => void;
  handleDeleteItem: (item: InventoryItem) => void;
}

export function InventoryTableRow({ 
  item, 
  handleEditItem, 
  handleStockAdjustment, 
  handleDeleteItem 
}: InventoryTableRowProps) {
  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      "in-stock": { label: "In Stock", color: "bg-green-100 text-green-800" },
      "low-stock": { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" },
      "out-of-stock": { label: "Out of Stock", color: "bg-red-100 text-red-800" },
      "expired": { label: "Expired", color: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      color: "bg-gray-100 text-gray-800" 
    };

    return (
      <Badge className={`font-medium ${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <TableRow key={item.id} className="hover:bg-gray-50">
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="capitalize">{item.type}</TableCell>
      <TableCell>{item.category}</TableCell>
      <TableCell className="text-right">
        {item.currentStock} {item.unit}
      </TableCell>
      <TableCell className="text-right">
        ${item.cost.toFixed(2)}
      </TableCell>
      <TableCell>{renderStatusBadge(item.status)}</TableCell>
      <TableCell>
        {item.lastRestocked
          ? formatDistanceToNow(new Date(item.lastRestocked), {
              addSuffix: true,
            })
          : "Never"}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handleEditItem(item)}
            title="Edit Item"
          >
            <Edit className="h-4 w-4 text-gray-500 hover:text-app-purple" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4 text-gray-500 hover:text-app-purple" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStockAdjustment(item, "add")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStockAdjustment(item, "reduce")}>
                <MinusCircle className="mr-2 h-4 w-4" />
                Reduce Stock
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteItem(item)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
