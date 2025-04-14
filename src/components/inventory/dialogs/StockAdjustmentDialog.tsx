
import { useState } from "react";
import { InventoryItem, useInventory } from "../context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PlusCircle, MinusCircle } from "lucide-react";

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem;
  adjustmentType: "add" | "reduce";
}

export function StockAdjustmentDialog({ 
  open, 
  onOpenChange, 
  item, 
  adjustmentType 
}: StockAdjustmentDialogProps) {
  const { updateStock } = useInventory();
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");

  const handleAdjustment = () => {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }

    updateStock(item.id, quantity, adjustmentType, notes);
    onOpenChange(false);
  };

  const getStockAfterAdjustment = (): number => {
    if (adjustmentType === "add") {
      return item.currentStock + quantity;
    } else {
      return Math.max(0, item.currentStock - quantity);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {adjustmentType === "add" ? "Add Stock" : "Reduce Stock"}
          </DialogTitle>
          <DialogDescription>
            {adjustmentType === "add" 
              ? "Add stock to inventory" 
              : "Reduce stock from inventory"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <div className="mb-4 p-4 border rounded-md bg-gray-50">
              <p className="text-sm font-medium">Item: <span className="font-normal">{item.name}</span></p>
              <p className="text-sm font-medium">Current Stock: <span className="font-normal">{item.currentStock} {item.unit}</span></p>
              <p className="text-sm font-medium">New Stock: <span className="font-normal">{getStockAfterAdjustment()} {item.unit}</span></p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">
              {adjustmentType === "add" ? "Quantity to Add" : "Quantity to Remove"}
            </Label>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  id="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
              <span className="text-sm font-medium">{item.unit}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Add reason or additional information"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdjustment} className="gap-2">
            {adjustmentType === "add" ? (
              <>
                <PlusCircle className="h-4 w-4" />
                Add Stock
              </>
            ) : (
              <>
                <MinusCircle className="h-4 w-4" />
                Reduce Stock
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
