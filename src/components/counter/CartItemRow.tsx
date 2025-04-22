
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { OrderItem } from "./CounterOrderSystem";
import { Badge } from "@/components/ui/badge";

interface CartItemRowProps {
  item: OrderItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export function CartItemRow({ item, onRemove, onUpdateQuantity }: CartItemRowProps) {
  const itemTotal = item.price * item.quantity;
  const customizationsTotal = item.customizations.reduce(
    (sum, customization) => sum + customization.price, 
    0
  ) * item.quantity;
  
  const total = itemTotal + customizationsTotal;
  
  return (
    <div className="border rounded-md p-3">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{item.name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {item.customizations.length > 0 && (
            <div className="mt-1 space-y-1">
              {item.customizations.map((customization, index) => (
                <div key={index} className="flex text-xs text-gray-600">
                  <span>{customization.name}: </span>
                  <span className="ml-1">{customization.option}</span>
                  {customization.price > 0 && (
                    <span className="ml-1">(+${customization.price.toFixed(2)})</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-right">
          <div className="font-medium">${total.toFixed(2)}</div>
          <div className="flex items-center mt-1 border rounded-md overflow-hidden">
            <Button 
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 rounded-none"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <Button 
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 rounded-none"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
