
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Create a printer type
interface Printer {
  id: string;
  name: string;
  model: string;
  connectionType: "usb" | "network" | "bluetooth";
  ipAddress?: string;
  port?: string;
  isDefault: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  model: z.string().min(2, "El modelo debe tener al menos 2 caracteres"),
  connectionType: z.enum(["usb", "network", "bluetooth"]),
  ipAddress: z.string().optional(),
  port: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface PrinterFormProps {
  printer?: Printer | null;
  onSave: (printer: Partial<Printer>) => void;
  onCancel: () => void;
}

export function PrinterForm({ printer, onSave, onCancel }: PrinterFormProps) {
  const [connectionType, setConnectionType] = useState<"usb" | "network" | "bluetooth">(
    printer?.connectionType || "usb"
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: printer?.name || "",
      model: printer?.model || "",
      connectionType: printer?.connectionType || "usb",
      ipAddress: printer?.ipAddress || "",
      port: printer?.port || "",
      isDefault: printer?.isDefault || false,
    }
  });

  useEffect(() => {
    if (printer) {
      form.reset({
        name: printer.name,
        model: printer.model,
        connectionType: printer.connectionType,
        ipAddress: printer.ipAddress || "",
        port: printer.port || "",
        isDefault: printer.isDefault,
      });
      setConnectionType(printer.connectionType);
    }
  }, [printer, form]);

  // Watch for connection type changes
  const watchConnectionType = form.watch("connectionType");
  useEffect(() => {
    setConnectionType(watchConnectionType);
  }, [watchConnectionType]);

  const handleSubmit = (values: FormValues) => {
    onSave({
      id: printer?.id,
      name: values.name,
      model: values.model,
      connectionType: values.connectionType,
      ...(values.connectionType === "network" && {
        ipAddress: values.ipAddress,
        port: values.port,
      }),
      isDefault: values.isDefault,
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
              <FormLabel>Nombre de la Impresora</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Impresora de Recibos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Epson TM-T20III" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="connectionType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Conexión</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="usb" id="usb" />
                    <Label htmlFor="usb">USB</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="network" id="network" />
                    <Label htmlFor="network">Red</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bluetooth" id="bluetooth" />
                    <Label htmlFor="bluetooth">Bluetooth</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {connectionType === "network" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección IP</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 192.168.1.100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puerto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 9100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Impresora Predeterminada</FormLabel>
                <FormDescription>
                  Establecer como impresora principal para recibos y reportes
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

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {printer ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
