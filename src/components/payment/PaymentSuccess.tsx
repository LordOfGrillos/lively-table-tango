
import { CheckCircle } from "lucide-react";

interface PaymentSuccessProps {
  tipAmount: number;
  calculateTotalWithTip: () => number;
}

export function PaymentSuccess({
  tipAmount,
  calculateTotalWithTip
}: PaymentSuccessProps) {
  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <div className="rounded-full bg-green-100 p-3 mb-4">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <h3 className="text-xl font-medium mb-2">Payment Completed!</h3>
      <p className="text-center text-muted-foreground mb-4">
        The payment for ${calculateTotalWithTip().toFixed(2)} has been successfully processed.
        {tipAmount > 0 && <span className="block mt-1">Including ${tipAmount.toFixed(2)} tip</span>}
      </p>
    </div>
  );
}
