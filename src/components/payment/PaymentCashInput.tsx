
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, Wallet } from "lucide-react";
import { Order } from "@/components/tables/TableActionPanel";
import { PaymentStatus } from "./PaymentModal";

interface PaymentCashInputProps {
  order: Order;
  tipAmount: number;
  cashReceived: string;
  setCashReceived: (amount: string) => void;
  calculateTotalWithTip: () => number;
  handleCashAmountSubmit: () => void;
  setPaymentStatus: (status: PaymentStatus) => void;
}

export function PaymentCashInput({
  order,
  tipAmount,
  cashReceived,
  setCashReceived,
  calculateTotalWithTip,
  handleCashAmountSubmit,
  setPaymentStatus
}: PaymentCashInputProps) {
  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cash-amount" className="text-base">Cash Received</Label>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="cash-amount"
              type="number"
              step="0.01"
              min={calculateTotalWithTip()}
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              className="pl-7"
              placeholder="0.00"
              autoFocus
            />
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-muted/30">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Order Total</span>
          <span className="font-bold">${order.total.toFixed(2)}</span>
        </div>
        {tipAmount > 0 && (
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Tip</span>
            <span className="font-bold text-green-600">${tipAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Total with Tip</span>
          <span className="font-bold">${calculateTotalWithTip().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Cash Received</span>
          <span className="font-bold">${parseFloat(cashReceived || "0").toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t mt-2">
          <span className="text-sm font-medium">Change</span>
          <span className="font-bold">
            ${Math.max(0, parseFloat(cashReceived || "0") - calculateTotalWithTip()).toFixed(2)}
          </span>
        </div>
      </div>
      
      <DialogFooter className="pt-2">
        <Button
          variant="outline"
          onClick={() => setPaymentStatus("idle")}
        >
          Back
        </Button>
        <Button 
          className="bg-app-purple hover:bg-app-purple/90"
          onClick={handleCashAmountSubmit}
          disabled={parseFloat(cashReceived || "0") < calculateTotalWithTip()}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Calculate Change
        </Button>
      </DialogFooter>
    </div>
  );
}
