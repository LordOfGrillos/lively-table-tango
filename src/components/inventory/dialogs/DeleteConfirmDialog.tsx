
import { InventoryItem, useInventory } from "../context";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem;
}

export function DeleteConfirmDialog({ open, onOpenChange, item }: DeleteConfirmDialogProps) {
  const { deleteItem } = useInventory();

  const handleDelete = () => {
    deleteItem(item.id);
    
    toast.success(`${item.name} deleted successfully`, {
      description: "The item has been removed from inventory"
    });
    
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{item.name}</span>? 
            This action cannot be undone and will permanently remove this item from your inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 my-3">
          <div className="flex items-start">
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Item Details:</p>
              <p className="text-sm text-yellow-700">Category: {item.category}</p>
              <p className="text-sm text-yellow-700">Current Stock: {item.currentStock} {item.unit}</p>
              <p className="text-sm text-yellow-700">Value: ${(item.cost * item.currentStock).toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
