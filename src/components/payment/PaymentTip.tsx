
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Order } from "@/components/tables/TableActionPanel";
import { DollarSign, Percent, Users } from "lucide-react";

interface PaymentTipProps {
  order: Order;
  tipType: "percent" | "amount";
  tipValue: string;
  tipAmount: number;
  calculateTotalWithTip: () => number;
  handleTipTypeChange: (value: "percent" | "amount") => void;
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
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <Label className="text-base">Add Tip</Label>
        <div className="flex flex-col space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <RadioGroup
              value={tipType}
              onValueChange={(value) => handleTipTypeChange(value as "percent" | "amount")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percent" id="tip-percent" />
                <Label htmlFor="tip-percent" className="flex items-center cursor-pointer">
                  <Percent className="h-4 w-4 mr-1" /> Percentage
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amount" id="tip-amount" />
                <Label htmlFor="tip-amount" className="flex items-center cursor-pointer">
                  <DollarSign className="h-4 w-4 mr-1" /> Amount
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={tipValue}
              onChange={(e) => handleTipValueChange(e.target.value)}
              className="w-24"
              min="0"
              step={tipType === "percent" ? "1" : "0.01"}
              placeholder={tipType === "percent" ? "15%" : "$5.00"}
            />
            <span className="text-sm text-muted-foreground">
              {tipType === "percent" ? "% of total" : "fixed amount"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>Tip ({tipType === "percent" ? `${tipValue}%` : "fixed"}):</span>
          <span>${tipAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <span>${calculateTotalWithTip().toFixed(2)}</span>
        </div>
      </div>
      
      <DialogFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          className="sm:w-full flex-1"
          onClick={handleSplitBill}
        >
          <Users className="mr-2 h-4 w-4" />
          Split Bill
        </Button>
        <Button 
          className="sm:w-full flex-1 bg-app-purple hover:bg-app-purple/90"
          onClick={handlePaymentSubmit}
        >
          Pay ${calculateTotalWithTip().toFixed(2)}
        </Button>
      </DialogFooter>
    </div>
  );
}
