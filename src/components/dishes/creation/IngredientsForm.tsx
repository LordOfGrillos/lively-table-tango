
import React from "react";
import { InventoryItem } from "@/components/inventory/types";
import { DishIngredient } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, UtensilsCrossed } from "lucide-react";

interface IngredientsFormProps {
  items: InventoryItem[];
  ingredients: DishIngredient[];
  selectedItemId: string;
  quantity: string;
  setSelectedItemId: (id: string) => void;
  setQuantity: (quantity: string) => void;
  addIngredient: () => void;
  removeIngredient: (index: number) => void;
}

export const IngredientsForm: React.FC<IngredientsFormProps> = ({
  items,
  ingredients,
  selectedItemId,
  quantity,
  setSelectedItemId,
  setQuantity,
  addIngredient,
  removeIngredient
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Receta del platillo</h3>
        <p className="text-sm text-gray-500 mb-4">
          Agrega los ingredientes necesarios para preparar este platillo. Estos ingredientes
          se descontarán automáticamente del inventario.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <FormLabel>Ingrediente</FormLabel>
          <Select 
            value={selectedItemId} 
            onValueChange={setSelectedItemId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un ingrediente" />
            </SelectTrigger>
            <SelectContent>
              {items.map(item => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name} ({item.unit})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <FormLabel>Cantidad</FormLabel>
          <Input 
            type="number" 
            placeholder="0.00" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
          />
        </div>
        
        <div className="flex items-end">
          <Button 
            type="button" 
            onClick={addIngredient} 
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Agregar
          </Button>
        </div>
      </div>
      
      {ingredients.length > 0 ? (
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Ingredientes agregados:</h4>
          <ul className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>
                  {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                </span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeIngredient(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-6 border border-dashed rounded-md">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p className="text-gray-500">No hay ingredientes agregados</p>
        </div>
      )}
    </div>
  );
};
