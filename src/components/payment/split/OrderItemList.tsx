
import { Order } from "@/components/tables/TableActionPanel";
import { Badge } from "@/components/ui/badge";
import { SplitCustomer } from "../PaymentModal";
import { cn } from "@/lib/utils";

interface OrderItemListProps {
  order: Order;
  customers: SplitCustomer[];
  isItemAssignedToCustomer: (itemId: string, customerId: string) => boolean;
  handleAssignItemToCustomer: (itemId: string, customerId: string) => void;
}

export function OrderItemList({
  order,
  customers,
  isItemAssignedToCustomer,
  handleAssignItemToCustomer
}: OrderItemListProps) {
  return (
    <div className="space-y-2">
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
  );
}
