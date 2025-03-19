
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { List, CreditCard } from "lucide-react";
import { OrderItem as OrderItemType } from "../TableActionPanel";
import { OrderItemComponent } from "./OrderItem";

interface OrderSummaryProps {
  currentOrder: OrderItemType[];
  isExistingOrder: boolean;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  calculateTotal: () => number;
  onUpdateItemStatus?: (itemId: string, status: 'pending' | 'cooking' | 'served') => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateOrder?: () => void;
  onCompleteOrder?: () => void;
  onCreateOrder: () => void;
}

export function OrderSummary({
  currentOrder,
  isExistingOrder,
  customerName,
  onCustomerNameChange,
  calculateTotal,
  onUpdateItemStatus,
  onRemoveItem,
  onUpdateOrder,
  onCompleteOrder,
  onCreateOrder
}: OrderSummaryProps) {
  // Remove the condition that checks if all items are served
  // This will allow the payment button to be clickable regardless of item status

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2">
          Current Order
        </h3>
        <Badge variant="outline">
          {currentOrder.reduce((total, item) => total + item.quantity, 0)} items
        </Badge>
      </div>
      
      {!isExistingOrder && (
        <div className="mb-3">
          <Label htmlFor="customer-name">Customer Name</Label>
          <Input 
            id="customer-name" 
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            className="mt-1"
          />
        </div>
      )}
      
      <div className="mb-3 max-h-[200px] overflow-y-auto">
        {currentOrder.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No items added yet
          </div>
        ) : (
          <div className="space-y-2">
            {currentOrder.map((item, index) => (
              <OrderItemComponent
                key={index}
                item={item}
                isExistingOrder={isExistingOrder}
                onUpdateStatus={onUpdateItemStatus}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
        )}
      </div>
      
      <Separator className="my-3" />
      
      <div className="flex justify-between font-medium mb-4">
        <span>Total:</span>
        <span>${calculateTotal().toFixed(2)}</span>
      </div>
      
      {isExistingOrder ? (
        <div className="flex flex-col gap-2">
          <Button 
            variant="default"
            className="bg-app-purple hover:bg-app-purple/90 w-full"
            onClick={onUpdateOrder}
            disabled={currentOrder.length === 0}
          >
            Update Order
          </Button>
          
          <Button 
            variant="default"
            className="bg-green-600 hover:bg-green-700 w-full flex items-center justify-center"
            onClick={onCompleteOrder}
            disabled={currentOrder.length === 0} // Changed from !allItemsServed to just check if there are items
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Proceed to Payment
          </Button>
        </div>
      ) : (
        <Button 
          variant="default"
          className="bg-app-purple hover:bg-app-purple/90 w-full"
          onClick={onCreateOrder}
          disabled={currentOrder.length === 0}
        >
          <List className="mr-2 h-4 w-4" />
          Place Order
        </Button>
      )}
    </div>
  );
}
