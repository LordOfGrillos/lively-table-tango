
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CashRegister } from "./types";
import { Banknote } from "lucide-react";
import { toast } from "sonner";

interface RegisterOpenFormProps {
  register: CashRegister;
  onOpenRegister: (initialAmount: number) => void;
  onCancel: () => void;
}

export function RegisterOpenForm({
  register,
  onOpenRegister,
  onCancel,
}: RegisterOpenFormProps) {
  const [initialAmount, setInitialAmount] = useState<number>(0);

  const handleSubmit = () => {
    if (initialAmount < 0) {
      toast.error("El monto inicial no puede ser negativo.");
      return;
    }
    
    onOpenRegister(initialAmount);
    toast.success("Caja abierta exitosamente");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Apertura de Caja</CardTitle>
          <CardDescription>{register.name} - {register.location}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="initialAmount">Monto Inicial (Fondo de Caja)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input
                  id="initialAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-6"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          <Banknote className="mr-2 h-4 w-4" />
          Abrir Caja
        </Button>
      </div>
    </div>
  );
}
