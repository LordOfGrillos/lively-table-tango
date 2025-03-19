
import { Order } from "@/components/tables/TableActionPanel";
import { SplitCustomer } from "../PaymentModal";

interface BillSummaryProps {
  order: Order;
  customers: SplitCustomer[];
  splitType: "equal" | "custom";
  getRemainingAmount: () => number;
  getCustomerTotalWithTip: (customerId: string) => number;
  calculateAssignedTotal: () => number;
}

export function BillSummary({
  order,
  customers,
  splitType,
  getRemainingAmount,
  getCustomerTotalWithTip,
  calculateAssignedTotal
}: BillSummaryProps) {
  return (
    <div className="border rounded-lg p-3 bg-muted/20 space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Total Bill</span>
        <span className="font-bold">${order.total.toFixed(2)}</span>
      </div>
      
      {splitType === "custom" && (
        <div className="flex justify-between">
          <span className="text-sm font-medium">Assigned Amount</span>
          <span className="font-bold">${calculateAssignedTotal().toFixed(2)}</span>
        </div>
      )}
      
      {splitType === "custom" && getRemainingAmount() !== 0 && (
        <div className="flex justify-between text-orange-600">
          <span className="text-sm font-medium">Unassigned Amount</span>
          <span className="font-bold">${getRemainingAmount()}</span>
        </div>
      )}
      
      {/* Total with all tips */}
      <div className="flex justify-between pt-2 border-t">
        <span className="text-sm font-medium">Total with Tips</span>
        <span className="font-bold">
          ${customers.reduce((sum, customer) => 
            sum + getCustomerTotalWithTip(customer.id), 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
