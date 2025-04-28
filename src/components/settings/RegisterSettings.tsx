
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RegisterForm } from "./RegisterForm";
import { CashRegister } from "@/components/cash-register/types";
import { mockRegisters } from "@/components/cash-register/data/mockData";
import { toast } from "sonner";

export function RegisterSettings() {
  const [registers, setRegisters] = useState<CashRegister[]>(mockRegisters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRegister, setEditingRegister] = useState<CashRegister | null>(null);

  const handleAddRegister = () => {
    setEditingRegister(null);
    setIsDialogOpen(true);
  };

  const handleEditRegister = (register: CashRegister) => {
    setEditingRegister(register);
    setIsDialogOpen(true);
  };

  const handleDeleteRegister = (registerId: string) => {
    // In a real app, this would make an API call to delete the register
    setRegisters(registers.filter(register => register.id !== registerId));
    toast.success("Caja eliminada correctamente");
  };

  const handleSaveRegister = (register: CashRegister) => {
    if (editingRegister) {
      // Update existing register
      setRegisters(prevRegisters => 
        prevRegisters.map(r => r.id === register.id ? register : r)
      );
      toast.success("Caja actualizada correctamente");
    } else {
      // Add new register
      const newId = `register-${Date.now()}`;
      const newRegister = { ...register, id: newId, status: "closed" as const };
      setRegisters(prevRegisters => [...prevRegisters, newRegister]);
      toast.success("Caja agregada correctamente");
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Cajas Registradoras</h2>
        <Button onClick={handleAddRegister}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Nueva Caja
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {registers.map((register) => (
          <Card key={register.id}>
            <CardHeader className="pb-3">
              <CardTitle>{register.name}</CardTitle>
              <CardDescription>{register.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                <span className="font-medium">Estado:</span>{" "}
                <span className={`font-medium ${register.status === "open" ? "text-green-600" : "text-red-600"}`}>
                  {register.status === "open" ? "Abierta" : "Cerrada"}
                </span>
              </p>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditRegister(register)}>
                  <Pencil className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteRegister(register.id)}>
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
            <DialogTitle>{editingRegister ? "Editar Caja" : "Agregar Nueva Caja"}</DialogTitle>
            <DialogDescription>
              {editingRegister 
                ? "Modifica los detalles de la caja registradora" 
                : "Ingresa los detalles para la nueva caja registradora"}
            </DialogDescription>
          </DialogHeader>
          <RegisterForm 
            register={editingRegister} 
            onSave={handleSaveRegister} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
