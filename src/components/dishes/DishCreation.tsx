
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useDishContext } from "./hooks/useDishContext";
import { useInventory } from "@/components/inventory/context";
import { DishIngredient } from "./types";
import { dishFormSchema, DishFormValues } from "./creation/types";
import { DishDetailsForm } from "./creation/DishDetailsForm";
import { IngredientsForm } from "./creation/IngredientsForm";
import { StepIndicator } from "./creation/StepIndicator";
import { FormNavigation } from "./creation/FormNavigation";

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
        <StepIndicator currentStep={currentStep} totalSteps={2} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <DishDetailsForm form={form} menus={menus} />
          )}

          {currentStep === 2 && (
            <IngredientsForm
              items={items}
              ingredients={ingredients}
              selectedItemId={selectedItemId}
              quantity={quantity}
              setSelectedItemId={setSelectedItemId}
              setQuantity={setQuantity}
              addIngredient={addIngredient}
              removeIngredient={removeIngredient}
            />
          )}

          <FormNavigation
            currentStep={currentStep}
            hasIngredients={ingredients.length > 0}
            onPrevStep={prevStep}
            onNextStep={nextStep}
          />
        </form>
      </Form>
    </Card>
  );
}
