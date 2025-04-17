
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, Plus, UtensilsCrossed, Clock } from "lucide-react";
import { useDishContext } from "./context";
import { useInventory } from "@/components/inventory/context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DishIngredient } from "./types";

// Define the form schema
const dishFormSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  price: z.coerce.number().positive({ message: "El precio debe ser mayor a 0" }),
  menuId: z.string().nullable(),
  preparationTime: z.coerce.number().positive({ message: "El tiempo debe ser mayor a 0" }),
});

type DishFormValues = z.infer<typeof dishFormSchema>;

export function DishCreation() {
  const { addDish, menus } = useDishContext();
  const { items } = useInventory();
  const [ingredients, setIngredients] = useState<DishIngredient[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');

  // Initialize the form
  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      menuId: null,
      preparationTime: 0,
    },
  });

  // Handle form submission
  const onSubmit = (data: DishFormValues) => {
    if (ingredients.length === 0) {
      setCurrentStep(2);
      return;
    }
    
    addDish({
      name: data.name,
      description: data.description,
      price: data.price,
      menuId: data.menuId,
      preparationTime: data.preparationTime,
      ingredients,
      isActive: true,
    });
    
    // Reset form
    form.reset();
    setIngredients([]);
    setCurrentStep(1);
  };

  // Add ingredient to the recipe
  const addIngredient = () => {
    if (!selectedItemId || !quantity || parseFloat(quantity) <= 0) return;
    
    const inventoryItem = items.find(item => item.id === selectedItemId);
    if (!inventoryItem) return;
    
    const newIngredient: DishIngredient = {
      inventoryItemId: inventoryItem.id,
      name: inventoryItem.name,
      quantity: parseFloat(quantity),
      unit: inventoryItem.unit,
    };
    
    setIngredients(prev => [...prev, newIngredient]);
    setSelectedItemId('');
    setQuantity('');
  };

  // Remove ingredient from the recipe
  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  // Go to next step
  const nextStep = () => {
    if (currentStep === 1) {
      const isValid = form.trigger(["name", "description", "price", "preparationTime"]);
      if (isValid) setCurrentStep(2);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  // Go to previous step
  const prevStep = () => {
    setCurrentStep(1);
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {currentStep === 1 ? "Crear nuevo platillo" : "Agregar ingredientes"}
        </h2>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${currentStep >= 1 ? "bg-app-purple" : "bg-gray-300"}`} />
          <div className={`h-3 w-3 rounded-full ${currentStep >= 2 ? "bg-app-purple" : "bg-gray-300"}`} />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del platillo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Ensalada César" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe el platillo..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preparationTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiempo de preparación (minutos)</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          />
                          <Clock className="ml-2 h-5 w-5 text-gray-500" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="menuId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría / Menú</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {menus.map(menu => (
                          <SelectItem key={menu.id} value={menu.id}>
                            {menu.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {currentStep === 2 && (
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
          )}

          <div className="flex justify-between pt-4">
            {currentStep === 2 ? (
              <>
                <Button type="button" variant="outline" onClick={prevStep}>
                  Volver
                </Button>
                <Button type="submit" disabled={ingredients.length === 0}>
                  Crear Platillo
                </Button>
              </>
            ) : (
              <>
                <div></div>
                <Button type="button" onClick={nextStep}>
                  Siguiente
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
}
