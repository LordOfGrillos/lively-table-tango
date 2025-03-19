
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { SplitCustomer } from "./PaymentModal";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Check } from "lucide-react";

interface PaymentSplitSummaryProps {
  customers: SplitCustomer[];
  currentCustomerIndex: number;
  getCustomerTotalWithTip: (customerId: string) => number;
  handlePayCustomer: (index: number) => void;
  customersPaid: boolean[];
  handleComplete: () => void;
  setPaymentStatus: (status: string) => void;
}

export function PaymentSplitSummary({
  customers,
  currentCustomerIndex,
  getCustomerTotalWithTip,
  handlePayCustomer,
  customersPaid,
  handleComplete,
  setPaymentStatus
}: PaymentSplitSummaryProps) {
  const allPaid = customersPaid.every(paid => paid);
  
  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Payment Summary</h3>
        <p className="text-sm text-muted-foreground">
          Each customer's check can be paid separately.
        </p>
      </div>
      
      <div className="border rounded-lg divide-y max-h-[350px] overflow-y-auto">
        {customers.map((customer, index) => {
          const isPaid = customersPaid[index];
          
          return (
            <div key={customer.id} className={`p-4 ${isPaid ? 'bg-green-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{customer.name}</span>
                  {isPaid && (
                    <Badge className="bg-green-600">
                      <Check className="h-3 w-3 mr-1" /> Paid
                    </Badge>
                  )}
                </div>
                <span className="font-medium">
                  ${getCustomerTotalWithTip(customer.id).toFixed(2)}
                </span>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <div>Subtotal: ${customer.total.toFixed(2)}</div>
                  <div>Tip: ${customer.tipAmount.toFixed(2)}</div>
                </div>
                
                {!isPaid && (
                  <Button 
                    onClick={() => handlePayCustomer(index)}
                    size="sm"
                    className="bg-app-purple hover:bg-app-purple/90"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay {customer.name}'s Bill (${getCustomerTotalWithTip(customer.id).toFixed(2)})
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setPaymentStatus("split-bill")}
        >
          Back
        </Button>
        <Button
          className={`${allPaid ? 'bg-green-600 hover:bg-green-700' : 'bg-app-purple hover:bg-app-purple/90'}`}
          onClick={handleComplete}
          disabled={!allPaid}
        >
          {allPaid ? 'Complete All Payments' : `Pay All Checks (${customersPaid.filter(p => p).length}/${customers.length})`}
        </Button>
      </DialogFooter>
    </div>
  );
}
