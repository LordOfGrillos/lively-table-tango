
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CashMovement, CashRegister } from "./types";
import { Banknote, PlusCircle, MinusCircle } from "lucide-react";
import { toast } from "sonner";

interface CashMovementFormProps {
  register: CashRegister;
  onSubmitMovement: (movement: CashMovement) => void;
  onCancel: () => void;
}

const DEPOSIT_REASONS = [
  { value: "initial", label: "Fondo inicial" },
  { value: "sales", label: "Ventas" },
  { value: "change", label: "Cambio" },
  { value: "other", label: "Otro" },
];

const WITHDRAWAL_REASONS = [
  { value: "supplier", label: "Pago a proveedor" },
  { value: "expenses", label: "Gastos" },
  { value: "change", label: "Cambio" },
  { value: "transfer", label: "Transferencia a banco" },
  { value: "other", label: "Otro" },
];

export function CashMovementForm({
  register,
  onSubmitMovement,
  onCancel,
}: CashMovementFormProps) {
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit");
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = () => {
    if (amount <= 0) {
      toast.error("El monto debe ser mayor a cero");
      return;
    }

    if (!reason) {
      toast.error("Debe seleccionar un motivo");
      return;
    }

    const finalReason = reason === "other" ? customReason : 
      DEPOSIT_REASONS.find(r => r.value === reason)?.label || 
      WITHDRAWAL_REASONS.find(r => r.value === reason)?.label || 
      "";

    if (reason === "other" && !customReason.trim()) {
      toast.error("Debe especificar un motivo personalizado");
      return;
    }

    const movement: CashMovement = {
      id: `mov-${Date.now()}`,
      amount,
      type,
      reason: finalReason,
      timestamp: new Date(),
      employeeName: "Usuario Actual",
      registerId: register.id,
    };

    onSubmitMovement(movement);
    toast.success(`${type === "deposit" ? "Depósito" : "Retiro"} registrado con éxito`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Movimiento de Efectivo</CardTitle>
          <CardDescription>
            {register.name} - {register.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={type === "deposit" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setType("deposit")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Ingreso / Depósito
            </Button>
            <Button
              type="button"
              variant={type === "withdrawal" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setType("withdrawal")}
            >
              <MinusCircle className="mr-2 h-4 w-4" />
              Salida / Retiro
            </Button>
          </div>

          <div>
            <Label htmlFor="amount">Monto</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                className="pl-6"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Motivo</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Seleccione un motivo" />
              </SelectTrigger>
              <SelectContent>
                {(type === "deposit" ? DEPOSIT_REASONS : WITHDRAWAL_REASONS).map(
                  (item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {reason === "other" && (
            <div>
              <Label htmlFor="customReason">Especifique el motivo</Label>
              <Input
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          <Banknote className="mr-2 h-4 w-4" />
          {type === "deposit" ? "Registrar Ingreso" : "Registrar Salida"}
        </Button>
      </div>
    </div>
  );
}
