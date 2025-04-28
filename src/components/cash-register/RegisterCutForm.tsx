
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CashRegister, CashCount, RegisterCut } from "./types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, Banknote, Printer, ReceiptText, Save } from "lucide-react";
import { toast } from "sonner";

interface RegisterCutFormProps {
  register: CashRegister;
  pendingOrders: number;
  expectedCash: number;
  onCompleteCut: (data: RegisterCut) => void;
  onCancel: () => void;
  isBlindCut?: boolean;
  allowCutWithOpenOrders?: boolean;
  cutType: "shift" | "endOfDay";
}

export function RegisterCutForm({
  register,
  pendingOrders,
  expectedCash,
  onCompleteCut,
  onCancel,
  isBlindCut = false,
  allowCutWithOpenOrders = false,
  cutType,
}: RegisterCutFormProps) {
  const [declaredCash, setDeclaredCash] = useState<number>(0);
  const [cashCount, setCashCount] = useState<CashCount>({
    bills1000: 0,
    bills500: 0,
    bills200: 0,
    bills100: 0,
    bills50: 0,
    bills20: 0,
    coins10: 0,
    coins5: 0,
    coins2: 0,
    coins1: 0,
    coins50c: 0,
    totalAmount: 0,
  });
  const [willPrintShiftCut, setWillPrintShiftCut] = useState<boolean>(true);

  // Calcular la diferencia
  const difference = declaredCash - expectedCash;
  
  // Para el conteo de efectivo
  const handleCashCountChange = (key: keyof CashCount, value: number) => {
    const newCashCount = { ...cashCount, [key]: value };
    
    // Calcular el total
    let total = 0;
    total += newCashCount.bills1000 * 1000;
    total += newCashCount.bills500 * 500;
    total += newCashCount.bills200 * 200;
    total += newCashCount.bills100 * 100;
    total += newCashCount.bills50 * 50;
    total += newCashCount.bills20 * 20;
    total += newCashCount.coins10 * 10;
    total += newCashCount.coins5 * 5;
    total += newCashCount.coins2 * 2;
    total += newCashCount.coins1 * 1;
    total += newCashCount.coins50c * 0.5;
    
    newCashCount.totalAmount = total;
    setCashCount(newCashCount);
    setDeclaredCash(total);
  };

  const handleSubmit = () => {
    if (pendingOrders > 0 && !allowCutWithOpenOrders) {
      toast.error(
        "No se puede realizar el corte con órdenes pendientes. Por favor cierre todas las órdenes antes de continuar."
      );
      return;
    }

    // Crear objeto de corte de caja
    const cutData: RegisterCut = {
      id: `cut-${Date.now()}`,
      registerId: register.id,
      registerName: register.name,
      openTimestamp: register.openedAt || new Date(),
      closeTimestamp: new Date(),
      openedBy: register.openedBy || "Usuario",
      closedBy: "Usuario Actual",
      initialAmount: register.initialAmount || 0,
      expectedCash: expectedCash,
      declaredCash: declaredCash,
      difference: difference,
      transactions: [],
      cashMovements: [],
      status: "completed",
      isEndOfDay: cutType === "endOfDay",
      cashCount: cashCount,
      ordersSummary: {
        open: pendingOrders,
        closed: 45,
        cancelled: 2,
      },
      salesByPaymentMethod: [
        { method: "cash", count: 25, amount: expectedCash, declared: declaredCash, difference },
        { method: "card", count: 15, amount: 1500 },
        { method: "other", count: 7, amount: 850 }
      ],
      salesByOrderType: [
        { type: "Comer aquí", count: 30, amount: 3500 },
        { type: "Llevar", count: 12, amount: 1200 },
        { type: "Delivery", count: 5, amount: 850 }
      ],
      salesByBrand: [
        { brand: "Marca Principal", count: 40, amount: 4800 },
        { brand: "Marca Secundaria", count: 7, amount: 750 }
      ],
      serviceFees: {
        count: 5,
        amount: 150
      },
      cancelledItems: {
        count: 8,
        amount: 320
      },
      salesSummary: {
        grossSales: 5550,
        discounts: 200,
        serviceFees: 150,
        totalSales: 5500,
        taxes: 880,
        netSales: 4620
      }
    };

    // Enviar datos y mostrar mensaje de éxito
    onCompleteCut(cutData);
    toast.success(
      cutType === "endOfDay" 
        ? "Cierre de día completado con éxito"
        : "Corte de caja completado con éxito"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        {pendingOrders > 0 && !allowCutWithOpenOrders && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Órdenes pendientes</AlertTitle>
            <AlertDescription>
              No se puede realizar el corte con órdenes pendientes. Por favor cierre todas las órdenes antes de continuar.
            </AlertDescription>
          </Alert>
        )}
        
        {pendingOrders > 0 && allowCutWithOpenOrders && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Órdenes pendientes</AlertTitle>
            <AlertDescription>
              Hay {pendingOrders} órdenes pendientes. Estas órdenes se transferirán a la siguiente sesión de caja.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {cutType === "endOfDay" ? "Cierre de Día" : "Corte de Caja"}
            </CardTitle>
            <CardDescription>
              {format(new Date(), "PPP", { locale: es })} - {register.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cash-declaration">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="cash-declaration" className="flex-1">
                  Declaración de Efectivo
                </TabsTrigger>
                <TabsTrigger value="cash-count" className="flex-1">
                  Conteo de Efectivo
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="cash-declaration">
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="initialCash">Efectivo Inicial</Label>
                      <Input
                        id="initialCash"
                        type="text"
                        value={`$${(register.initialAmount || 0).toFixed(2)}`}
                        disabled
                      />
                    </div>
                    
                    {!isBlindCut && (
                      <div>
                        <Label htmlFor="expectedCash">Efectivo Esperado</Label>
                        <Input
                          id="expectedCash"
                          type="text"
                          value={`$${expectedCash.toFixed(2)}`}
                          disabled
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="declaredCash">Efectivo Declarado</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          id="declaredCash"
                          type="number"
                          className="pl-6"
                          value={declaredCash.toString()}
                          onChange={(e) => 
                            setDeclaredCash(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>
                    
                    {!isBlindCut && (
                      <div>
                        <Label htmlFor="difference">Diferencia</Label>
                        <Input
                          id="difference"
                          type="text"
                          value={`$${difference.toFixed(2)}`}
                          disabled
                          className={
                            difference < 0 
                              ? "text-red-600 font-medium" 
                              : difference > 0 
                                ? "text-green-600 font-medium"
                                : ""
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cash-count">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bills1000">Billetes de $1000</Label>
                      <Input
                        id="bills1000"
                        type="number"
                        min="0"
                        value={cashCount.bills1000.toString()}
                        onChange={(e) => 
                          handleCashCountChange("bills1000", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bills500">Billetes de $500</Label>
                      <Input
                        id="bills500"
                        type="number"
                        min="0"
                        value={cashCount.bills500.toString()}
                        onChange={(e) => 
                          handleCashCountChange("bills500", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bills200">Billetes de $200</Label>
                      <Input
                        id="bills200"
                        type="number"
                        min="0"
                        value={cashCount.bills200.toString()}
                        onChange={(e) => 
                          handleCashCountChange("bills200", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bills100">Billetes de $100</Label>
                      <Input
                        id="bills100"
                        type="number"
                        min="0"
                        value={cashCount.bills100.toString()}
                        onChange={(e) => 
                          handleCashCountChange("bills100", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bills50">Billetes de $50</Label>
                      <Input
                        id="bills50"
                        type="number"
                        min="0"
                        value={cashCount.bills50.toString()}
                        onChange={(e) => 
                          handleCashCountChange("bills50", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bills20">Billetes de $20</Label>
                      <Input
                        id="bills20"
                        type="number"
                        min="0"
                        value={cashCount.bills20.toString()}
                        onChange={(e) => 
                          handleCashCountChange("bills20", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="coins10">Monedas de $10</Label>
                      <Input
                        id="coins10"
                        type="number"
                        min="0"
                        value={cashCount.coins10.toString()}
                        onChange={(e) => 
                          handleCashCountChange("coins10", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="coins5">Monedas de $5</Label>
                      <Input
                        id="coins5"
                        type="number"
                        min="0"
                        value={cashCount.coins5.toString()}
                        onChange={(e) => 
                          handleCashCountChange("coins5", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="coins2">Monedas de $2</Label>
                      <Input
                        id="coins2"
                        type="number"
                        min="0"
                        value={cashCount.coins2.toString()}
                        onChange={(e) => 
                          handleCashCountChange("coins2", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="coins1">Monedas de $1</Label>
                      <Input
                        id="coins1"
                        type="number"
                        min="0"
                        value={cashCount.coins1.toString()}
                        onChange={(e) => 
                          handleCashCountChange("coins1", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="coins50c">Monedas de $0.50</Label>
                      <Input
                        id="coins50c"
                        type="number"
                        min="0"
                        value={cashCount.coins50c.toString()}
                        onChange={(e) => 
                          handleCashCountChange("coins50c", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-medium">Total Contado:</Label>
                      <span className="text-lg font-bold">${cashCount.totalAmount.toFixed(2)}</span>
                    </div>
                    
                    {!isBlindCut && (
                      <div className="flex justify-between items-center mt-2">
                        <Label className="text-lg font-medium">Diferencia:</Label>
                        <span className={`text-lg font-bold ${
                          difference < 0 
                            ? "text-red-600" 
                            : difference > 0 
                              ? "text-green-600"
                              : ""
                        }`}>
                          ${difference.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          {cutType === "endOfDay" && (
            <CardFooter className="flex-col items-start space-y-2 pt-0">
              <div className="flex items-center space-x-2">
                <Switch
                  id="print-shift-cut"
                  checked={willPrintShiftCut}
                  onCheckedChange={setWillPrintShiftCut}
                />
                <Label htmlFor="print-shift-cut">
                  Imprimir también el corte de caja
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Si se selecciona esta opción, se imprimirá tanto el cierre del día como el corte de caja.
              </p>
            </CardFooter>
          )}
        </Card>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={pendingOrders > 0 && !allowCutWithOpenOrders}>
          {cutType === "endOfDay" ? (
            <>
              <ReceiptText className="mr-2 h-4 w-4" />
              Realizar Cierre de Día
            </>
          ) : (
            <>
              <Banknote className="mr-2 h-4 w-4" />
              Realizar Corte de Caja
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
