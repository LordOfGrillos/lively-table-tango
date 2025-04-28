
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pencil, Trash2, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PrinterForm } from "./PrinterForm";
import { toast } from "sonner";

// Define a type for printer
interface Printer {
  id: string;
  name: string;
  model: string;
  connectionType: "usb" | "network" | "bluetooth";
  ipAddress?: string;
  port?: string;
  isDefault: boolean;
}

// Sample data for printers
const mockPrinters: Printer[] = [
  {
    id: "printer-1",
    name: "Impresora de Recibos",
    model: "Epson TM-T20III",
    connectionType: "usb",
    isDefault: true
  },
  {
    id: "printer-2",
    name: "Impresora de Cocina",
    model: "Star TSP100",
    connectionType: "network",
    ipAddress: "192.168.1.100",
    port: "9100",
    isDefault: false
  }
];

export function PrinterSettings() {
  const [printers, setPrinters] = useState<Printer[]>(mockPrinters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);

  const handleAddPrinter = () => {
    setEditingPrinter(null);
    setIsDialogOpen(true);
  };

  const handleEditPrinter = (printer: Printer) => {
    setEditingPrinter(printer);
    setIsDialogOpen(true);
  };

  const handleDeletePrinter = (printerId: string) => {
    // In a real app, this would make an API call to delete the printer
    setPrinters(printers.filter(printer => printer.id !== printerId));
    toast.success("Impresora eliminada correctamente");
  };

  const handleSetDefault = (printerId: string) => {
    setPrinters(printers.map(printer => ({
      ...printer,
      isDefault: printer.id === printerId
    })));
    toast.success("Impresora predeterminada actualizada");
  };

  const handleSavePrinter = (printer: Partial<Printer>) => {
    if (editingPrinter) {
      // Update existing printer
      setPrinters(prevPrinters => 
        prevPrinters.map(p => p.id === printer.id ? { ...p, ...printer } : p)
      );
      toast.success("Impresora actualizada correctamente");
    } else {
      // Add new printer
      const newId = `printer-${Date.now()}`;
      const newPrinter = { 
        ...printer, 
        id: newId, 
        isDefault: printer.isDefault || false
      } as Printer;
      
      // If new printer is set as default, update other printers
      if (newPrinter.isDefault) {
        setPrinters(prevPrinters => 
          [...prevPrinters.map(p => ({ ...p, isDefault: false })), newPrinter]
        );
      } else {
        setPrinters(prevPrinters => [...prevPrinters, newPrinter]);
      }
      toast.success("Impresora agregada correctamente");
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Impresoras</h2>
        <Button onClick={handleAddPrinter}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Nueva Impresora
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {printers.map((printer) => (
          <Card key={printer.id} className={printer.isDefault ? "border-2 border-primary" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Printer className="h-5 w-5 mr-2" />
                  {printer.name}
                </CardTitle>
                {printer.isDefault && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                    Predeterminada
                  </span>
                )}
              </div>
              <CardDescription>{printer.model}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Conexión:</span>{" "}
                  {printer.connectionType === "usb" ? "USB" : 
                   printer.connectionType === "network" ? "Red" : "Bluetooth"}
                </p>
                
                {printer.connectionType === "network" && (
                  <p className="text-sm">
                    <span className="font-medium">IP/Puerto:</span>{" "}
                    {printer.ipAddress}:{printer.port}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                {!printer.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(printer.id)}>
                    Establecer como predeterminada
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleEditPrinter(printer)}>
                  <Pencil className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePrinter(printer.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPrinter ? "Editar Impresora" : "Agregar Nueva Impresora"}</DialogTitle>
            <DialogDescription>
              {editingPrinter 
                ? "Modifica los detalles de la impresora" 
                : "Ingresa los detalles para la nueva impresora"}
            </DialogDescription>
          </DialogHeader>
          <PrinterForm 
            printer={editingPrinter} 
            onSave={handleSavePrinter} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
