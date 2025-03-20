
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { UsersRound } from "lucide-react";

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
    <DialogFooter className="pt-2">
      <Button
        variant="outline"
        onClick={() => setPaymentStatus("idle")}
      >
        Back
      </Button>
      <Button 
        className="bg-app-purple hover:bg-app-purple/90"
        onClick={handleCompleteSplit}
        disabled={!isCustomSplitValid}
      >
        <UsersRound className="mr-2 h-4 w-4" />
        {isCustomSplitValid 
          ? "Continue to Split Payment"
          : `Assign Remaining Items ($${getRemainingAmount().toFixed(2)})`
        }
      </Button>
    </DialogFooter>
  );
}
