import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CreditCard, Wallet, CircleDollarSign, CheckCircle, Calculator, ArrowRight, Percent, DollarSign, Split, Users, List, Equal, Plus, Minus, User } from "lucide-react";
import { Order, OrderItem } from "@/components/tables/TableActionPanel";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PaymentModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (paymentMethod: string) => void;
}

type PaymentMethod = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

type SplitCustomer = {
  id: string;
  name: string;
  items: {
    itemId: string;
    quantity: number;
  }[];
  total: number;
};

export function PaymentModal({ order, isOpen, onClose, onPaymentComplete }: PaymentModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("cash");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "cash-input" | "cash-change" | "split-bill">("idle");
  const [cashReceived, setCashReceived] = useState<string>("");
  const [changeAmount, setChangeAmount] = useState<number>(0);
  
  // Tip state
  const [tipType, setTipType] = useState<"percent" | "amount">("percent");
  const [tipValue, setTipValue] = useState<string>("");
  const [tipAmount, setTipAmount] = useState<number>(0);
  
  // Split bill state
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [numberOfCustomers, setNumberOfCustomers] = useState<number>(2);
  const [customers, setCustomers] = useState<SplitCustomer[]>([
    { id: "c1", name: "Customer 1", items: [], total: 0 },
    { id: "c2", name: "Customer 2", items: [], total: 0 }
  ]);
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState(0);
  
  const paymentMethods: PaymentMethod[] = [
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
  
  // Calculate the total with tip
  const calculateTotalWithTip = () => {
    return order.total + tipAmount;
  };
  
  // Calculate tip amount based on type and value
  const calculateTipAmount = (type: "percent" | "amount", value: string): number => {
    if (!value || isNaN(parseFloat(value))) return 0;
    
    if (type === "percent") {
      const percentage = parseFloat(value);
      return (percentage / 100) * order.total;
    } else {
      return parseFloat(value);
    }
  };
  
  // Handle tip value change
  const handleTipValueChange = (value: string) => {
    setTipValue(value);
    const calculatedTipAmount = calculateTipAmount(tipType, value);
    setTipAmount(calculatedTipAmount);
  };
  
  // Handle tip type change
  const handleTipTypeChange = (value: string) => {
    if (value === "percent" || value === "amount") {
      setTipType(value);
      // Recalculate tip amount with new type
      const calculatedTipAmount = calculateTipAmount(value as "percent" | "amount", tipValue);
      setTipAmount(calculatedTipAmount);
    }
  };
  
  const handlePaymentSubmit = () => {
    if (selectedPaymentMethod === "cash") {
      setPaymentStatus("cash-input");
    } else {
      setPaymentStatus("processing");
      
      // Simulate payment processing for non-cash payments
      setTimeout(() => {
        setPaymentStatus("success");
        
        // After showing success message, close modal and notify parent
        setTimeout(() => {
          onPaymentComplete(selectedPaymentMethod);
        }, 1500);
      }, 2000);
    }
  };
  
  const handleSplitBill = () => {
    // Initialize equal split
    if (splitType === "equal") {
      const equalAmount = calculateTotalWithTip() / numberOfCustomers;
      const updatedCustomers = Array.from({ length: numberOfCustomers }, (_, i) => ({
        id: `c${i+1}`,
        name: `Customer ${i+1}`,
        items: [],
        total: parseFloat(equalAmount.toFixed(2))
      }));
      setCustomers(updatedCustomers);
    } else {
      // For custom split, start with empty assignments
      const updatedCustomers = Array.from({ length: numberOfCustomers }, (_, i) => ({
        id: `c${i+1}`,
        name: `Customer ${i+1}`,
        items: [],
        total: 0
      }));
      setCustomers(updatedCustomers);
    }
    
    setPaymentStatus("split-bill");
  };
  
  const handleCashAmountSubmit = () => {
    const receivedAmount = parseFloat(cashReceived);
    const totalWithTip = calculateTotalWithTip();
    
    if (isNaN(receivedAmount) || receivedAmount < totalWithTip) {
      return; // Don't proceed if invalid amount or less than total with tip
    }
    
    const change = receivedAmount - totalWithTip;
    setChangeAmount(change);
    setPaymentStatus("cash-change");
  };
  
  const handleCashPaymentComplete = () => {
    setPaymentStatus("success");
    
    // After showing success message, close modal and notify parent
    setTimeout(() => {
      onPaymentComplete(selectedPaymentMethod);
    }, 1500);
  };
  
  // Functions for split bill
  const handleAddCustomer = () => {
    if (numberOfCustomers < 8) {
      setNumberOfCustomers(prev => prev + 1);
      const updatedCustomers = [
        ...customers,
        { id: `c${numberOfCustomers + 1}`, name: `Customer ${numberOfCustomers + 1}`, items: [], total: 0 }
      ];
      setCustomers(updatedCustomers);
      
      // Recalculate totals for equal split
      if (splitType === "equal") {
        const equalAmount = calculateTotalWithTip() / (numberOfCustomers + 1);
        setCustomers(updatedCustomers.map(c => ({ ...c, total: parseFloat(equalAmount.toFixed(2)) })));
      }
    }
  };
  
  const handleRemoveCustomer = () => {
    if (numberOfCustomers > 2) {
      setNumberOfCustomers(prev => prev - 1);
      const updatedCustomers = customers.slice(0, -1);
      setCustomers(updatedCustomers);
      
      // Recalculate totals for equal split
      if (splitType === "equal") {
        const equalAmount = calculateTotalWithTip() / (numberOfCustomers - 1);
        setCustomers(updatedCustomers.map(c => ({ ...c, total: parseFloat(equalAmount.toFixed(2)) })));
      }
    }
  };
  
  const handleSplitTypeChange = (type: "equal" | "custom") => {
    setSplitType(type);
    
    if (type === "equal") {
      const equalAmount = calculateTotalWithTip() / numberOfCustomers;
      setCustomers(customers.map(c => ({ ...c, items: [], total: parseFloat(equalAmount.toFixed(2)) })));
    } else {
      // Reset totals for custom split
      setCustomers(customers.map(c => ({ ...c, items: [], total: 0 })));
    }
  };
  
  const handleAssignItemToCustomer = (itemId: string, customerId: string) => {
    // Only for custom split
    if (splitType !== "custom") return;
    
    const item = order.items.find(i => i.id === itemId);
    if (!item) return;
    
    // Check if the item is already assigned to any customer
    const isAssigned = customers.some(c => c.items.some(i => i.itemId === itemId));
    
    // Create new customer state
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        // If item already assigned to this customer, remove it
        if (customer.items.some(i => i.itemId === itemId)) {
          return {
            ...customer,
            items: customer.items.filter(i => i.itemId !== itemId),
            total: parseFloat((customer.total - (item.price * item.quantity)).toFixed(2))
          };
        }
        // Otherwise, add it to this customer
        return {
          ...customer,
          items: [...customer.items, { itemId, quantity: item.quantity }],
          total: parseFloat((customer.total + (item.price * item.quantity)).toFixed(2))
        };
      }
      // If item was previously assigned to another customer, remove it
      else if (isAssigned && customer.items.some(i => i.itemId === itemId)) {
        return {
          ...customer,
          items: customer.items.filter(i => i.itemId !== itemId),
          total: parseFloat((customer.total - (item.price * item.quantity)).toFixed(2))
        };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
  };
  
  const handleSetCustomerName = (customerId: string, name: string) => {
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, name } : c
    ));
  };
  
  const handleCompleteSplit = () => {
    // Validate that all items are assigned in custom split
    if (splitType === "custom") {
      const allItemsAssigned = order.items.every(item => 
        customers.some(c => c.items.some(i => i.itemId === item.id))
      );
      
      if (!allItemsAssigned) {
        // In a real app, you might show a warning here
        console.warn("Not all items are assigned to customers");
      }
    }
    
    // Return to payment method selection
    setPaymentStatus("idle");
  };
  
  // Helper function to check if an item is assigned to a customer
  const isItemAssignedToCustomer = (itemId: string, customerId: string) => {
    return customers.find(c => c.id === customerId)?.items.some(i => i.itemId === itemId) || false;
  };
  
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
  
  const getRemainingAmount = () => {
    if (splitType === "equal") return 0;
    return parseFloat((order.total - calculateAssignedTotal()).toFixed(2));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("sm:max-w-md", { "sm:max-w-3xl": paymentStatus === "split-bill" })}>
        <DialogHeader>
          <DialogTitle>
            {paymentStatus === "success" ? "Payment Successful" : 
             paymentStatus === "cash-input" ? "Enter Cash Amount" :
             paymentStatus === "cash-change" ? "Payment Change" :
             paymentStatus === "split-bill" ? "Split Bill" :
             "Complete Payment"}
          </DialogTitle>
          {paymentStatus !== "success" && paymentStatus !== "cash-input" && paymentStatus !== "cash-change" && paymentStatus !== "split-bill" && (
            <DialogDescription>
              Complete the payment for order #{order.tableNumber}
            </DialogDescription>
          )}
        </DialogHeader>
        
        {paymentStatus === "idle" && (
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
                    <ToggleGroup type="single" value={tipType} onValueChange={handleTipTypeChange} className="border rounded-md">
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
                      {tipType === "percent" ? (
                        <div className="flex items-center">
                          <Input
                            type="number"
                            value={tipValue}
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
                            value={tipValue}
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
        )}
        
        {paymentStatus === "split-bill" && (
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
                          ${customer.total.toFixed(2)}
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
                    </div>
                  ))}
                </div>
                
                {/* Summary information */}
                <div className="border rounded-lg p-3 bg-muted/20 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Bill with Tip</span>
                    <span className="font-bold">${calculateTotalWithTip().toFixed(2)}</span>
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
        )}
        
        {paymentStatus === "cash-input" && (
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cash-amount" className="text-base">Cash Received</Label>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Wallet className="h-5 w-5" />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="cash-amount"
                    type="number"
                    step="0.01"
                    min={calculateTotalWithTip()}
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="pl-7"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Order Total</span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Tip</span>
                  <span className="font-bold text-green-600">${tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Total with Tip</span>
                <span className="font-bold">${calculateTotalWithTip().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Cash Received</span>
                <span className="font-bold">${parseFloat(cashReceived || "0").toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="text-sm font-medium">Change</span>
                <span className="font-bold">
                  ${Math.max(0, parseFloat(cashReceived || "0") - calculateTotalWithTip()).toFixed(2)}
                </span>
              </div>
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
                onClick={handleCashAmountSubmit}
                disabled={parseFloat(cashReceived || "0") < calculateTotalWithTip()}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Calculate Change
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {paymentStatus === "cash-change" && (
          <div className="py-4 space-y-4">
            <div className="flex justify-center items-center py-4">
              <div className="rounded-full bg-green-100 p-3">
                <Calculator className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">Change Due</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">
                ${changeAmount.toFixed(2)}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Please return ${changeAmount.toFixed(2)} to the customer
              </p>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Order Total</span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Tip</span>
                  <span className="font-bold text-green-600">${tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Total with Tip</span>
                <span className="font-bold">${calculateTotalWithTip().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Cash Received</span>
                <span className="font-bold">${parseFloat(cashReceived).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="text-sm font-medium">Change</span>
                <span className="font-bold">${changeAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <DialogFooter className="pt-2">
              <Button 
                className="bg-green-600 hover:bg-green-700 w-full"
                onClick={handleCashPaymentComplete}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Payment
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {paymentStatus === "processing" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
              <p>Processing payment...</p>
            </div>
          </div>
        )}
        
        {paymentStatus === "success" && (
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
        )}
      </DialogContent>
    </Dialog>
  );
}
