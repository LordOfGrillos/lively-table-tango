
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CashRegister } from "@/components/cash-register/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  location: z.string().min(2, "La ubicación debe tener al menos 2 caracteres")
});

type FormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  register?: CashRegister | null;
  onSave: (register: Partial<CashRegister>) => void;
  onCancel: () => void;
}

export function RegisterForm({ register, onSave, onCancel }: RegisterFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: register?.name || "",
      location: register?.location || ""
    }
  });

  useEffect(() => {
    if (register) {
      form.reset({
        name: register.name,
        location: register.location
      });
    }
  }, [register, form]);

  const handleSubmit = (values: FormValues) => {
    onSave({
      id: register?.id,
      name: values.name,
      location: values.location,
      status: register?.status || "closed"
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Caja</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Caja Principal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Entrada, Bar, Terraza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {register ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
