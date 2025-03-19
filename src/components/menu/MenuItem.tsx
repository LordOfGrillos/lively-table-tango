
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";

export interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface MenuItemProps {
  item: MenuItemType;
  onAddToOrder: (item: MenuItemType, quantity: number) => void;
}

export function MenuItem({ item, onAddToOrder }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToOrder = () => {
    onAddToOrder(item, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
          <p className="text-sm font-medium mt-1">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center border rounded-md">
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-2 h-8" 
            onClick={decreaseQuantity}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-2 h-8" 
            onClick={increaseQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          size="sm" 
          className="bg-app-purple hover:bg-app-purple/90"
          onClick={handleAddToOrder}
        >
          Add to Order
        </Button>
      </div>
    </Card>
  );
}
