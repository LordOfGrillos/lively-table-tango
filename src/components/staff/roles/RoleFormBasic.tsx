
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

// Schema for form validation
export const roleFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre del rol debe tener al menos 2 caracteres.",
  }),
  description: z.string().min(5, {
    message: "La descripción debe tener al menos 5 caracteres.",
  }),
  isDefault: z.boolean().default(false),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormBasicProps {
  form: UseFormReturn<RoleFormValues>;
}

export function RoleFormBasic({ form }: RoleFormBasicProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-app-purple" />
          Información del Rol
        </CardTitle>
        <CardDescription>
          Define el nombre y propósito de este rol en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre del rol <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. Gerente de Sucursal"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Este nombre aparecerá en todo el sistema para identificar al rol
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Descripción <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe brevemente las responsabilidades de este rol"
                  className="h-20"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explica qué tipo de usuario debería tener este rol y sus responsabilidades
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Rol predeterminado</FormLabel>
                <FormDescription>
                  Este rol se asignará automáticamente a nuevos usuarios
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
