
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInventory } from "./context";
import { InventoryItemType, InventoryUnit } from "./types";
import { Camera, Loader2 } from "lucide-react";

const itemTypes: { value: InventoryItemType; label: string }[] = [
  { value: "ingredient", label: "Ingredient" },
  { value: "supply", label: "Supply" },
  { value: "equipment", label: "Equipment" },
];

const unitOptions: { value: InventoryUnit; label: string }[] = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  { value: "l", label: "Liters (l)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "box", label: "Box" },
  { value: "unit", label: "Unit" },
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  type: z.enum(["ingredient", "supply", "equipment"]),
  category: z.string().min(1, { message: "Category is required." }),
  currentStock: z.coerce.number().min(0, { message: "Stock cannot be negative." }),
  unit: z.enum(["kg", "g", "l", "ml", "pcs", "box", "unit"]),
  minStockLevel: z.coerce.number().min(0, { message: "Minimum stock level cannot be negative." }),
  cost: z.coerce.number().min(0, { message: "Cost cannot be negative." }),
  expiryDate: z.string().optional(),
  location: z.string().optional(),
  barcode: z.string().optional(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function InventoryAddItem() {
  const { addItem, categories } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "ingredient",
      category: "",
      currentStock: 0,
      unit: "kg",
      minStockLevel: 5,
      cost: 0,
      expiryDate: "",
      location: "",
      barcode: "",
      supplier: "",
      notes: "",
    },
  });

  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      // Convert expiryDate string to Date object if provided
      const expiryDate = data.expiryDate ? new Date(data.expiryDate) : undefined;

      // Add item to inventory - Fix here: ensure all required properties are provided
      addItem({
        name: data.name,                 // Explicitly provide required properties
        type: data.type,
        category: data.category,
        currentStock: data.currentStock,
        unit: data.unit,
        minStockLevel: data.minStockLevel,
        cost: data.cost,
        expiryDate,                      // Optional
        location: data.location,         // Optional
        barcode: data.barcode,           // Optional
        supplier: data.supplier,         // Optional
        notes: data.notes,               // Optional
        imageSrc: imageSrc || "/placeholder.svg",
        usedInRecipes: [],               // Start with no recipes using this item
      });

      // Reset form
      form.reset();
      setImageSrc(undefined);
      
      toast.success("Item added successfully", {
        description: `${data.name} has been added to your inventory.`,
      });
    } catch (error) {
      toast.error("Failed to add item", {
        description: "There was an error adding the item. Please try again.",
      });
      console.error("Error adding item:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Add New Inventory Item</h2>
        <p className="text-gray-500">Fill out the form below to add a new item to your inventory.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {itemTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.value === "Other" && (
                      <Input 
                        placeholder="Enter new category name" 
                        className="mt-2"
                        onChange={(e) => form.setValue("category", e.target.value)}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stock *</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unitOptions.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minStockLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min. Stock Level *</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Alert when stock falls below this level
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost per Unit ($) *</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Image
                </label>
                <div className="flex flex-col items-center">
                  <div className="w-full h-48 relative mb-4 rounded-md border-2 border-dashed border-gray-300 p-2 flex items-center justify-center">
                    {imageSrc ? (
                      <img 
                        src={imageSrc} 
                        alt="Item preview" 
                        className="max-h-44 max-w-full object-contain" 
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-500">
                          No image uploaded
                        </p>
                      </div>
                    )}
                  </div>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="mb-4"
                    >
                      {imageSrc ? "Change Image" : "Upload Image"}
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave blank for non-perishable items
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Fridge 1, Dry Storage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supplier name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode / SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter barcode or SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Additional information about this item"
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Item"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
