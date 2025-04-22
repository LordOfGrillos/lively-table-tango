
import { Button } from "@/components/ui/button"; // Fixed import for Button
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";
import { OrderItem } from "./CounterOrderSystem";
import { CartItemRow } from "./CartItemRow";

interface OrderCartProps {
  items: OrderItem[];
  total: number;
  customerName: string;
  orderNumber: number;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onProceedToPayment: () => void;
}

export function OrderCart({
  items,
  total,
  customerName,
  orderNumber,
  onRemoveItem,
  onUpdateQuantity,
  onProceedToPayment
}: OrderCartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Current Order</span>
          <span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded-md">
            #{orderNumber}
          </span>
        </CardTitle>
        {customerName && (
          <p className="text-sm text-gray-500">Customer: {customerName}</p>
        )}
      </CardHeader>
      
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Your order is empty
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {items.map(item => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onRemove={() => onRemoveItem(item.id)}
                  onUpdateQuantity={(qty) => onUpdateQuantity(item.id, qty)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      
      <CardFooter className="flex-col space-y-4 border-t pt-4">
        <div className="w-full">
          <div className="flex justify-between py-1">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between py-1 font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
          disabled={items.length === 0}
          onClick={onProceedToPayment}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Proceed to Payment
        </Button>
      </CardFooter>
    </Card>
  );
}
