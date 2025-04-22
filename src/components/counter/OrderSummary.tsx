
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderItem } from "./CounterOrderSystem";
import { CartItemRow } from "./CartItemRow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  items: OrderItem[];
  total: number;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export function OrderSummary({ 
  items, 
  total,
  onRemoveItem,
  onUpdateQuantity
}: OrderSummaryProps) {
  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between pb-2 border-b">
            <span>Total Items:</span>
            <span>{getTotalItems()}</span>
          </div>
          
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No items added to this order
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
          
          <div className="pt-4">
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
