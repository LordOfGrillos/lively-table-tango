
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Settings } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ItemCustomizationModal } from "./ItemCustomizationModal";

export interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  ingredients?: string[];
}

interface MenuItemProps {
  item: MenuItemType;
  onAddToOrder: (item: MenuItemType, quantity: number, customizations?: ItemCustomization) => void;
}

export interface ItemCustomization {
  removedIngredients: string[];
  extras: Extra[];
}

export interface Extra {
  name: string;
  price: number;
}

export function MenuItem({ item, onAddToOrder }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToOrder = (customizations?: ItemCustomization) => {
    onAddToOrder(item, quantity, customizations);
    setQuantity(1); // Reset quantity after adding
    setIsCustomizing(false);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
        <div className="flex items-center border rounded-md">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 w-8 h-8" 
            onClick={decreaseQuantity}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 w-8 h-8" 
            onClick={increaseQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                Customize
              </Button>
            </DialogTrigger>
            <ItemCustomizationModal 
              item={item} 
              onAddToOrder={handleAddToOrder}
              quantity={quantity}
            />
          </Dialog>
          <Button 
            size="sm" 
            className="bg-app-purple hover:bg-app-purple/90 ml-auto sm:ml-0"
            onClick={() => handleAddToOrder()}
          >
            Add to Order
          </Button>
        </div>
      </div>
    </Card>
  );
}
