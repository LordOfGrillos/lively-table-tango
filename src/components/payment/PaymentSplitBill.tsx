
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Order } from "@/components/tables/TableActionPanel";
import { SplitCustomer } from "./PaymentModal";
import { cn } from "@/lib/utils";
import { Equal, List, Minus, Plus, User, Percent, DollarSign } from "lucide-react";
import { TipType } from "./hooks/useSplitBill";

interface PaymentSplitBillProps {
  order: Order;
  customers: SplitCustomer[];
  splitType: "equal" | "custom";
  numberOfCustomers: number;
  calculateTotalWithTip: () => number;
  handleSplitTypeChange: (type: "equal" | "custom") => void;
  handleAddCustomer: () => void;
  handleRemoveCustomer: () => void;
  handleAssignItemToCustomer: (itemId: string, customerId: string) => void;
  handleSetCustomerName: (customerId: string, name: string) => void;
  handleCustomerTipTypeChange: (customerId: string, tipType: TipType) => void;
  handleCustomerTipValueChange: (customerId: string, tipValue: string) => void;
  isItemAssignedToCustomer: (itemId: string, customerId: string) => boolean;
  getRemainingAmount: () => number;
  getCustomerTotalWithTip: (customerId: string) => number;
  handleCompleteSplit: () => void;
  setPaymentStatus: (status: string) => void;
}

export function PaymentSplitBill({
  order,
  customers,
  splitType,
  numberOfCustomers,
  calculateTotalWithTip,
  handleSplitTypeChange,
  handleAddCustomer,
  handleRemoveCustomer,
  handleAssignItemToCustomer,
  handleSetCustomerName,
  handleCustomerTipTypeChange,
  handleCustomerTipValueChange,
  isItemAssignedToCustomer,
  getRemainingAmount,
  getCustomerTotalWithTip,
  handleCompleteSplit,
  setPaymentStatus
}: PaymentSplitBillProps) {
  
  // Calculate total assigned in custom split
  const calculateAssignedTotal = () => {
    let total = 0;
    customers.forEach(customer => {
      customer.items.forEach(item => {
        const orderItem = order.items.find(i => i.id === item.itemId);
        if (orderItem) {
          total += orderItem.price * orderItem.quantity;
        }
      });
    });
    return total;
  };

  return (
    <div className="py-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Split the Bill</h3>
          <div className="flex items-center space-x-1">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRemoveCustomer}
              disabled={numberOfCustomers <= 2}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-2">{numberOfCustomers}</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAddCustomer}
              disabled={numberOfCustomers >= 8}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={splitType === "equal" ? "default" : "outline"} 
            className={cn("flex-1", splitType === "equal" ? "bg-app-purple hover:bg-app-purple/90" : "")}
            onClick={() => handleSplitTypeChange("equal")}
          >
            <Equal className="mr-2 h-4 w-4" />
            Split Equally
          </Button>
          <Button 
            variant={splitType === "custom" ? "default" : "outline"} 
            className={cn("flex-1", splitType === "custom" ? "bg-app-purple hover:bg-app-purple/90" : "")}
            onClick={() => handleSplitTypeChange("custom")}
          >
            <List className="mr-2 h-4 w-4" />
            Split by Item
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2 md:order-2">
          <h4 className="font-medium">Customers</h4>
          <div className="border rounded-lg bg-muted/20 divide-y">
            {customers.map((customer, index) => (
              <div key={customer.id} className="p-3">
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
            ))}
          </div>
          
          {/* Summary information */}
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
        </div>
        
        {splitType === "custom" && (
          <div className="space-y-2 md:order-1">
            <h4 className="font-medium">Order Items</h4>
            <div className="border rounded-lg divide-y max-h-[350px] overflow-y-auto">
              {order.items.map((item) => {
                const isAssigned = customers.some(c => c.items.some(i => i.itemId === item.id));
                return (
                  <div key={item.id} className={cn(
                    "p-3 transition-colors",
                    isAssigned ? "bg-green-50" : ""
                  )}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {customers.map((customer) => (
                        <Badge 
                          key={`${item.id}-${customer.id}`}
                          variant={isItemAssignedToCustomer(item.id, customer.id) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer",
                            isItemAssignedToCustomer(item.id, customer.id) 
                              ? "bg-app-purple hover:bg-app-purple/90" 
                              : "hover:border-app-purple"
                          )}
                          onClick={() => handleAssignItemToCustomer(item.id, customer.id)}
                        >
                          {customer.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
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
    </div>
  );
}
