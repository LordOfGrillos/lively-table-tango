
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Percent, DollarSign, Split } from "lucide-react";
import { Order } from "@/components/tables/TableActionPanel";

interface PaymentTipProps {
  order: Order;
  tipType: "percent" | "amount";
  tipValue: string;
  tipAmount: number;
  calculateTotalWithTip: () => number;
  handleTipTypeChange: (value: string) => void;
  handleTipValueChange: (value: string) => void;
  handlePaymentSubmit: () => void;
  handleSplitBill: () => void;
}

export function PaymentTip({
  order,
  tipType,
  tipValue,
  tipAmount,
  calculateTotalWithTip,
  handleTipTypeChange,
  handleTipValueChange,
  handlePaymentSubmit,
  handleSplitBill
}: PaymentTipProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="border rounded-lg p-4 bg-muted/30">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-medium">Order Total</span>
          <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
        </div>
        
        {/* Tip Selection Section */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tip</span>
            <ToggleGroup type="single" value={tipType} onValueChange={handleTipTypeChange} className="border rounded-md">
              <ToggleGroupItem value="percent" aria-label="Toggle percentage tip">
                <Percent className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="amount" aria-label="Toggle amount tip">
                <DollarSign className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              {tipType === "percent" ? (
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={tipValue}
                    onChange={(e) => handleTipValueChange(e.target.value)}
                    placeholder="0"
                    className="pr-7"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    value={tipValue}
                    onChange={(e) => handleTipValueChange(e.target.value)}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => handleTipValueChange("15")}
            >
              15%
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => handleTipValueChange("20")}
            >
              20%
            </Button>
          </div>
          
          {tipAmount > 0 && (
            <div className="text-xs text-right mt-1 text-green-600">
              Adding ${tipAmount.toFixed(2)} tip
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm font-medium">Total with Tip</span>
          <span className="text-lg font-bold">${calculateTotalWithTip().toFixed(2)}</span>
        </div>
        
        {/* Split bill button */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 border-dashed"
            onClick={handleSplitBill}
          >
            <Split className="h-4 w-4" />
            Split the Bill
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          Table #{order.tableNumber} • {order.items.length} items
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          className="bg-app-purple hover:bg-app-purple/90"
          onClick={handlePaymentSubmit}
        >
          Process Payment
        </Button>
      </DialogFooter>
    </div>
  );
}
