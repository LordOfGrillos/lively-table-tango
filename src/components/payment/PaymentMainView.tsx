
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Order } from "@/components/tables/TableActionPanel";
import { cn } from "@/lib/utils";
import { CreditCard, Wallet, CircleDollarSign, Split, Percent, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PaymentMainViewProps {
  order: Order;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  tipAmount: number;
  calculateTotalWithTip: () => number;
  handleTipValueChange: (value: string) => void;
  handleTipTypeChange: (value: string) => void;
  handleSplitBill: () => void;
  handlePaymentSubmit: () => void;
  onClose: () => void;
}

export function PaymentMainView({
  order,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  tipAmount,
  calculateTotalWithTip,
  handleTipValueChange,
  handleTipTypeChange,
  handleSplitBill,
  handlePaymentSubmit,
  onClose
}: PaymentMainViewProps) {
  
  const paymentMethods = [
    {
      id: "cash",
      name: "Cash",
      icon: <Wallet className="h-6 w-6" />,
      description: "Pay with cash at the table"
    },
    {
      id: "card",
      name: "Card",
      icon: <CreditCard className="h-6 w-6" />,
      description: "Pay with credit or debit card"
    },
    {
      id: "other",
      name: "Other",
      icon: <CircleDollarSign className="h-6 w-6" />,
      description: "Other payment methods"
    }
  ];

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="border rounded-lg p-4 bg-muted/30">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium">Order Total</span>
            <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
          </div>
          
          {/* Tip Selection Section */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tip</span>
              <ToggleGroup type="single" value={selectedPaymentMethod === "cash" ? "percent" : "amount"} onValueChange={handleTipTypeChange} className="border rounded-md">
                <ToggleGroupItem value="percent" aria-label="Toggle percentage tip">
                  <Percent className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="amount" aria-label="Toggle amount tip">
                  <DollarSign className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                {selectedPaymentMethod === "cash" ? (
                  <div className="flex items-center">
                    <Input
                      type="number"
                      onChange={(e) => handleTipValueChange(e.target.value)}
                      placeholder="0"
                      className="pr-7"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      onChange={(e) => handleTipValueChange(e.target.value)}
                      placeholder="0.00"
                      className="pl-7"
                    />
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => handleTipValueChange("15")}
              >
                15%
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => handleTipValueChange("20")}
              >
                20%
              </Button>
            </div>
            
            {tipAmount > 0 && (
              <div className="text-xs text-right mt-1 text-green-600">
                Adding ${tipAmount.toFixed(2)} tip
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
            <span className="text-sm font-medium">Total with Tip</span>
            <span className="text-lg font-bold">${calculateTotalWithTip().toFixed(2)}</span>
          </div>
          
          {/* Split bill button */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 border-dashed"
              onClick={handleSplitBill}
            >
              <Split className="h-4 w-4" />
              Split the Bill
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            Table #{order.tableNumber} • {order.items.length} items
          </div>
        </div>
        
        <div className="space-y-2">
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
      </div>
      
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          className="bg-app-purple hover:bg-app-purple/90"
          onClick={handlePaymentSubmit}
        >
          Process Payment
        </Button>
      </DialogFooter>
    </>
  );
}
