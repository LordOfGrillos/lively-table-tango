
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDishContext } from "./context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";

// Define schema for menu creation
const menuFormSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  description: z.string().min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
});

type MenuFormValues = z.infer<typeof menuFormSchema>;

interface CreateMenuDialogProps {
  menuId?: string;
  onClose: () => void;
}

export function CreateMenuDialog({ menuId, onClose }: CreateMenuDialogProps) {
  const { addMenu, updateMenu, getMenuById } = useDishContext();
  
  // Get existing menu data if editing
  const existingMenu = menuId ? getMenuById(menuId) : undefined;
  
  // Initialize form with default or existing values
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: existingMenu?.name || "",
      description: existingMenu?.description || "",
    },
  });

  // Handle form submission
  const onSubmit = (data: MenuFormValues) => {
    if (menuId && existingMenu) {
      updateMenu(menuId, data);
    } else {
      addMenu({
        ...data,
        dishes: [],
        isActive: true,
      });
    }
    
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la categoría</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Entradas, Platos Fuertes, Postres..." {...field} />
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
                <Textarea placeholder="Describe la categoría..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {menuId ? "Actualizar" : "Crear"} Categoría
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
