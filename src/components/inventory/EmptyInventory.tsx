
import { Package, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyInventoryProps {
  onAddItem: () => void;
}

export function EmptyInventory({ onAddItem }: EmptyInventoryProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-dashed border-gray-300 mt-6">
      <Package className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">Your inventory is empty</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        Start tracking your inventory by adding your first item. You'll be able to monitor 
        stock levels, receive alerts, and manage your inventory efficiently.
      </p>
      <Button 
        onClick={onAddItem} 
        className="bg-app-purple hover:bg-app-purple/90"
        size="lg"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Your First Item
      </Button>
    </div>
  );
}
