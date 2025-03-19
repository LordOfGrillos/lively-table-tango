
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AlertTriangle, Plus } from "lucide-react";
import { OrderItem } from "../TableActionPanel";

interface OrderItemComponentProps {
  item: OrderItem;
  isExistingOrder: boolean;
  onUpdateStatus?: (itemId: string, status: 'pending' | 'cooking' | 'served') => void;
  onRemoveItem: (itemId: string) => void;
}

export function OrderItemComponent({ 
  item, 
  isExistingOrder,
  onUpdateStatus,
  onRemoveItem
}: OrderItemComponentProps) {
  return (
    <Card className="p-2 text-sm">
      <div className="flex justify-between">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-gray-500">
            ${(item.price).toFixed(2)} × {item.quantity}
          </div>
          
          {item.customizations && (
            <div className="mt-1 text-xs">
              {item.customizations.removedIngredients.length > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>No: {item.customizations.removedIngredients.join(", ")}</span>
                </div>
              )}
              
              {item.customizations.extras.length > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <Plus className="h-3 w-3" />
                  <span>
                    {item.customizations.extras.map(e => `${e.name} (+$${e.price.toFixed(2)})`).join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-right">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
      
      {isExistingOrder && onUpdateStatus && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t">
          <Select 
            value={item.status} 
            onValueChange={(val: 'pending' | 'cooking' | 'served') => 
              onUpdateStatus(item.id, val)
            }
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cooking">Cooking</SelectItem>
              <SelectItem value="served">Served</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={() => onRemoveItem(item.id)}
          >
            Remove
          </Button>
        </div>
      )}
      
      {!isExistingOrder && (
        <div className="flex justify-end mt-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 text-xs"
            onClick={() => onRemoveItem(item.id)}
          >
            Remove
          </Button>
        </div>
      )}
    </Card>
  );
}
