
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { UsersRound, ArrowLeft, ArrowRight } from "lucide-react";

interface PaymentSplitBillFooterProps {
  splitType: "equal" | "custom";
  getRemainingAmount: () => number;
  handleCompleteSplit: () => void;
  setPaymentStatus: (status: string) => void;
}

export function PaymentSplitBillFooter({
  splitType,
  getRemainingAmount,
  handleCompleteSplit,
  setPaymentStatus
}: PaymentSplitBillFooterProps) {
  const isCustomSplitValid = splitType !== "custom" || getRemainingAmount() === 0;

  return (
    <DialogFooter className="flex flex-col sm:flex-row justify-between w-full gap-2 pt-4 border-t">
      <Button
        variant="outline"
        onClick={() => setPaymentStatus("idle")}
        className="flex items-center w-full sm:w-auto justify-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Payment Options
      </Button>
      <Button 
        className="bg-app-purple hover:bg-app-purple/90 w-full sm:w-auto"
        onClick={handleCompleteSplit}
        disabled={!isCustomSplitValid}
      >
        {isCustomSplitValid 
          ? (
            <>
              Continue to Customer Payments <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )
          : (
            <>
              <UsersRound className="mr-2 h-4 w-4" />
              Assign Remaining ${getRemainingAmount().toFixed(2)}
            </>
          )
        }
      </Button>
    </DialogFooter>
  );
}
