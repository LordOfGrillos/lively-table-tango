
import { useState } from "react";
import { MenuItemType, ItemCustomization, Extra } from "./MenuItem";
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Available extras for customization
const availableExtras: Extra[] = [
  { name: "Extra Cheese", price: 1.50 },
  { name: "Extra Bacon", price: 2.00 },
  { name: "Extra Avocado", price: 1.75 },
  { name: "Extra Sauce", price: 0.75 },
  { name: "Double Portion", price: 3.50 },
];

interface ItemCustomizationModalProps {
  item: MenuItemType;
  quantity: number;
  onAddToOrder: (customizations?: ItemCustomization) => void;
}

export function ItemCustomizationModal({ 
  item, 
  quantity,
  onAddToOrder 
}: ItemCustomizationModalProps) {
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  
  // Calculate additional cost from extras
  const extrasCost = selectedExtras.reduce((total, extra) => total + extra.price, 0);
  const totalItemPrice = item.price + extrasCost;
  const orderTotal = totalItemPrice * quantity;
  
  const toggleIngredient = (ingredient: string) => {
    if (removedIngredients.includes(ingredient)) {
      setRemovedIngredients(prev => prev.filter(ing => ing !== ingredient));
    } else {
      setRemovedIngredients(prev => [...prev, ingredient]);
    }
  };
  
  const toggleExtra = (extra: Extra) => {
    if (selectedExtras.some(e => e.name === extra.name)) {
      setSelectedExtras(prev => prev.filter(e => e.name !== extra.name));
    } else {
      setSelectedExtras(prev => [...prev, extra]);
    }
  };
  
  const handleAddToOrder = () => {
    const customizations: ItemCustomization = {
      removedIngredients,
      extras: selectedExtras
    };
    
    onAddToOrder(customizations);
  };
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Customize {item.name}</DialogTitle>
      </DialogHeader>
      
      <div className="py-4 max-h-[60vh] overflow-y-auto">
        {/* Ingredients section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Ingredients</h3>
          <p className="text-xs text-gray-500 mb-3">Uncheck to remove ingredients</p>
          
          {item.ingredients && item.ingredients.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {item.ingredients.map(ingredient => (
                <div key={ingredient} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`ingredient-${ingredient}`}
                    checked={!removedIngredients.includes(ingredient)}
                    onCheckedChange={() => toggleIngredient(ingredient)}
                  />
                  <Label 
                    htmlFor={`ingredient-${ingredient}`}
                    className="text-sm cursor-pointer"
                  >
                    {ingredient}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No ingredients available</p>
          )}
          
          {removedIngredients.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium mb-1">Removed:</p>
              <div className="flex flex-wrap gap-1">
                {removedIngredients.map(ingredient => (
                  <Badge 
                    key={ingredient} 
                    variant="outline"
                    className="flex items-center gap-1 bg-red-50 text-red-800 border-red-200"
                  >
                    <X className="h-3 w-3" />
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        {/* Extras section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Add Extras</h3>
          <p className="text-xs text-gray-500 mb-3">Select to add extras (additional charges apply)</p>
          
          <div className="grid grid-cols-1 gap-2">
            {availableExtras.map(extra => (
              <div key={extra.name} className="flex items-center justify-between border p-2 rounded-md">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`extra-${extra.name}`}
                    checked={selectedExtras.some(e => e.name === extra.name)}
                    onCheckedChange={() => toggleExtra(extra)}
                  />
                  <Label 
                    htmlFor={`extra-${extra.name}`}
                    className="text-sm cursor-pointer"
                  >
                    {extra.name}
                  </Label>
                </div>
                <span className="text-sm text-gray-600">+${extra.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          {selectedExtras.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium mb-1">Added extras:</p>
              <div className="flex flex-wrap gap-1">
                {selectedExtras.map(extra => (
                  <Badge 
                    key={extra.name} 
                    variant="outline"
                    className="flex items-center gap-1 bg-green-50 text-green-800 border-green-200"
                  >
                    <Plus className="h-3 w-3" />
                    {extra.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        {/* Price summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base price:</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
          
          {extrasCost > 0 && (
            <div className="flex justify-between text-sm">
              <span>Extras:</span>
              <span>+${extrasCost.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>Quantity:</span>
            <span>×{quantity}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="submit" 
          className="w-full bg-app-purple hover:bg-app-purple/90"
          onClick={handleAddToOrder}
        >
          <Check className="mr-2 h-4 w-4" />
          Add to Order
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
