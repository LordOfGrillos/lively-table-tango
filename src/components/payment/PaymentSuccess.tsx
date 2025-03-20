
import { CheckCircle, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PaymentSuccessProps {
  tipAmount: number;
  calculateTotalWithTip: () => number;
  customerName?: string;
  currentCustomerIndex?: number;
  totalCustomers?: number;
  handleComplete?: () => void;
}

export function PaymentSuccess({
  tipAmount,
  calculateTotalWithTip,
  customerName,
  currentCustomerIndex,
  totalCustomers,
  handleComplete
}: PaymentSuccessProps) {
  const total = calculateTotalWithTip();
  const isForCustomer = !!customerName;

  return (
    <div className="py-8 text-center space-y-6">
      {isForCustomer && (
        <div className="bg-green-50 rounded-lg p-4 mb-2 border border-green-200">
          <div className="flex items-center gap-3 justify-center">
            <div className="bg-green-100 rounded-full p-2">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Processed For:</p>
              <p className="font-semibold text-lg text-green-600">{customerName}</p>
            </div>
            {currentCustomerIndex !== undefined && totalCustomers && (
              <Badge variant="outline" className="ml-auto bg-green-50 text-green-600 border-green-200">
                Customer {currentCustomerIndex + 1} of {totalCustomers}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-1">
          {isForCustomer 
            ? `${customerName}'s Payment Successful!` 
            : "Payment Successful!"
          }
        </h3>
        <p className="text-muted-foreground">
          {isForCustomer 
            ? `${customerName}'s portion has been paid.` 
            : "Thank you for your payment."
          }
        </p>
      </div>
      
      <div className="border rounded-lg p-4 max-w-[200px] mx-auto bg-muted/20">
        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal:</span>
          <span>${(total - tipAmount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>Tip:</span>
          <span>${tipAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium border-t pt-1 mt-1">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      {isForCustomer && handleComplete && (
        <Button 
          onClick={handleComplete}
          className="bg-app-purple hover:bg-app-purple/90"
        >
          Return to Split Summary <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
