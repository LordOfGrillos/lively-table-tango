
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SplitCustomer } from "../PaymentModal";
import { Order } from "@/components/tables/TableActionPanel";
import { User, Percent, DollarSign } from "lucide-react";
import { TipType } from "../hooks/useSplitBill";

interface CustomerItemProps {
  customer: SplitCustomer;
  index: number;
  order: Order;
  splitType: "equal" | "custom";
  handleSetCustomerName: (customerId: string, name: string) => void;
  handleCustomerTipTypeChange: (customerId: string, tipType: TipType) => void;
  handleCustomerTipValueChange: (customerId: string, tipValue: string) => void;
  getCustomerTotalWithTip: (customerId: string) => number;
}

export function CustomerItem({
  customer,
  index,
  order,
  splitType,
  handleSetCustomerName,
  handleCustomerTipTypeChange,
  handleCustomerTipValueChange,
  getCustomerTotalWithTip
}: CustomerItemProps) {
  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={`Customer ${index + 1}`}
          value={customer.name}
          onChange={(e) => handleSetCustomerName(customer.id, e.target.value)}
          className="h-8 text-sm"
        />
        <Badge variant="outline" className="ml-auto">
          ${getCustomerTotalWithTip(customer.id).toFixed(2)}
        </Badge>
      </div>
      
      {splitType === "custom" && customer.items.length > 0 && (
        <div className="pl-6 text-sm text-muted-foreground space-y-1">
          {customer.items.map((item) => {
            const orderItem = order.items.find(i => i.id === item.itemId);
            return orderItem ? (
              <div key={item.itemId} className="flex justify-between">
                <span>{orderItem.name}</span>
                <span>${(orderItem.price * orderItem.quantity).toFixed(2)}</span>
              </div>
            ) : null;
          })}
        </div>
      )}
      
      {/* Individual Tip Section */}
      <div className="mt-3 pt-3 border-t border-dashed space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>${customer.total.toFixed(2)}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Tip:</span>
            <span>${customer.tipAmount.toFixed(2)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <RadioGroup 
              value={customer.tipType} 
              onValueChange={(value) => handleCustomerTipTypeChange(customer.id, value as TipType)}
              className="flex gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="percent" id={`percent-${customer.id}`} />
                <Label htmlFor={`percent-${customer.id}`} className="flex items-center text-xs">
                  <Percent className="h-3 w-3 mr-1" /> %
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="amount" id={`amount-${customer.id}`} />
                <Label htmlFor={`amount-${customer.id}`} className="flex items-center text-xs">
                  <DollarSign className="h-3 w-3 mr-1" /> $
                </Label>
              </div>
            </RadioGroup>
            
            <Input
              type="number"
              placeholder={customer.tipType === "percent" ? "20%" : "$5.00"}
              value={customer.tipValue}
              onChange={(e) => handleCustomerTipValueChange(customer.id, e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        </div>
        
        <div className="flex justify-between text-sm font-medium">
          <span>Total:</span>
          <span>${getCustomerTotalWithTip(customer.id).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
