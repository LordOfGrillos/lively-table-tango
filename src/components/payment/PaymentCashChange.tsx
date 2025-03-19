
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Calculator, CheckCircle } from "lucide-react";
import { Order } from "@/components/tables/TableActionPanel";

interface PaymentCashChangeProps {
  order: Order;
  tipAmount: number;
  cashReceived: string;
  changeAmount: number;
  calculateTotalWithTip: () => number;
  handleCashPaymentComplete: () => void;
}

export function PaymentCashChange({
  order,
  tipAmount,
  cashReceived,
  changeAmount,
  calculateTotalWithTip,
  handleCashPaymentComplete
}: PaymentCashChangeProps) {
  return (
    <div className="py-4 space-y-4">
      <div className="flex justify-center items-center py-4">
        <div className="rounded-full bg-green-100 p-3">
          <Calculator className="h-8 w-8 text-green-600" />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">Change Due</h3>
        <p className="text-3xl font-bold text-green-600 mb-2">
          ${changeAmount.toFixed(2)}
        </p>
        <p className="text-gray-500 text-sm mb-4">
          Please return ${changeAmount.toFixed(2)} to the customer
        </p>
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
          <span className="font-bold">${parseFloat(cashReceived).toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t mt-2">
          <span className="text-sm font-medium">Change</span>
          <span className="font-bold">${changeAmount.toFixed(2)}</span>
        </div>
      </div>
      
      <DialogFooter className="pt-2">
        <Button 
          className="bg-green-600 hover:bg-green-700 w-full"
          onClick={handleCashPaymentComplete}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Complete Payment
        </Button>
      </DialogFooter>
    </div>
  );
}
