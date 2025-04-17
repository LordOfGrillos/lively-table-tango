
import { z } from "zod";

// Define the form schema
export const dishFormSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  price: z.coerce.number().positive({ message: "El precio debe ser mayor a 0" }),
  menuId: z.string().nullable(),
  preparationTime: z.coerce.number().positive({ message: "El tiempo debe ser mayor a 0" }),
});

export type DishFormValues = z.infer<typeof dishFormSchema>;
