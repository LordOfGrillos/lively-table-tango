
import { PaymentMethod } from "./PaymentModal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
}

export function PaymentMethods({
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod
}: PaymentMethodsProps) {
  return (
    <div className="space-y-2 py-4">
      <Label className="text-base">Select Payment Method</Label>
      <RadioGroup
        value={selectedPaymentMethod}
        onValueChange={setSelectedPaymentMethod}
        className="gap-3"
      >
        {paymentMethods.map((method) => (
          <div key={method.id} className={cn(
            "flex items-center space-x-3 space-y-0 rounded-lg border p-4 cursor-pointer transition-all",
            selectedPaymentMethod === method.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
          )}>
            <RadioGroupItem value={method.id} id={method.id} />
            <div className="flex flex-1 items-center justify-between">
              <Label
                htmlFor={method.id}
                className="flex items-center gap-3 cursor-pointer font-normal"
              >
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  {method.icon}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{method.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
