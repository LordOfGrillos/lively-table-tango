
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

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
        disabled={splitType === "custom" && getRemainingAmount() !== 0}
      >
        Apply Split
      </Button>
    </DialogFooter>
  );
}
