
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RegisterCut } from "./types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, Printer } from "lucide-react";
import { toast } from "sonner";

interface RegisterCutReportProps {
  cut: RegisterCut;
  onPrint: () => void;
  onExport: () => void;
  onClose: () => void;
}

export function RegisterCutReport({ cut, onPrint, onExport, onClose }: RegisterCutReportProps) {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted text-center py-4">
          <CardTitle>
            {cut.isEndOfDay ? "REPORTE DE CIERRE DE DÍA" : "REPORTE DE CORTE DE CAJA"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg">Restaurante Ejemplo</h3>
            <p>{cut.isEndOfDay ? "Cierre de día" : "Corte de caja"}: #{cut.id.split('-')[1]}</p>
            <p>
              <span className="font-semibold">Apertura:</span>{" "}
              {format(cut.openTimestamp, "dd/MM/yy HH:mm:ss", { locale: es })}
            </p>
            <p>
              <span className="font-semibold">Usuario apertura:</span> {cut.openedBy}
            </p>
            <p>
              <span className="font-semibold">Cierre:</span>{" "}
              {format(cut.closeTimestamp, "dd/MM/yy HH:mm:ss", { locale: es })}
            </p>
            <p>
              <span className="font-semibold">Usuario cierre:</span> {cut.closedBy}
            </p>
            <p>
              <span className="font-semibold">Número de órdenes:</span>{" "}
              {cut.ordersSummary.closed}
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-bold text-base mb-2">Resumen - Movimientos en efectivo</h4>
            <div className="grid grid-cols-2 gap-1">
              <p>Efectivo inicial:</p>
              <p className="text-right">{formatCurrency(cut.initialAmount)}</p>
              <p>Ventas en efectivo en sucursal:</p>
              <p className="text-right">{formatCurrency(cut.salesByPaymentMethod.find(m => m.method === 'cash')?.amount || 0)}</p>
              <p>Depósitos:</p>
              <p className="text-right">{formatCurrency(cut.cashMovements.filter(m => m.type === 'deposit').reduce((sum, movement) => sum + movement.amount, 0))}</p>
              <p>Retiros:</p>
              <p className="text-right">{formatCurrency(cut.cashMovements.filter(m => m.type === 'withdrawal').reduce((sum, movement) => sum + movement.amount, 0))}</p>
              <p className="font-semibold">Efectivo esperado:</p>
              <p className="text-right font-semibold">{formatCurrency(cut.expectedCash)}</p>
              <p className="font-semibold">Efectivo declarado al corte:</p>
              <p className="text-right font-semibold">{formatCurrency(cut.declaredCash)}</p>
              <p className="font-semibold">Diferencia:</p>
              <p className={`text-right font-semibold ${cut.difference < 0 ? 'text-red-600' : cut.difference > 0 ? 'text-green-600' : ''}`}>
                {cut.difference >= 0 ? '+' : ''}{formatCurrency(cut.difference)}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-bold text-base mb-2">Resumen - Venta total</h4>
            <div className="grid grid-cols-2 gap-1">
              <p>Venta total en sucursal:</p>
              <p className="text-right">{formatCurrency(cut.salesSummary.totalSales)}</p>
              <p className="font-semibold">Venta total:</p>
              <p className="text-right font-semibold">{formatCurrency(cut.salesSummary.totalSales)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-bold text-base mb-2">-- En sucursal --</h4>
            
            {/* Tipos de Pago */}
            <div className="mb-4">
              <h5 className="font-bold">Tipos de Pago</h5>
              {cut.salesByPaymentMethod.map((payment, index) => (
                <div key={index} className="mt-2">
                  <p className="font-medium">{payment.method === 'cash' ? 'Efectivo' : payment.method === 'card' ? 'Tarjeta' : 'Otro'}</p>
                  <div className="grid grid-cols-2 gap-1 pl-4">
                    <p># Pagos:</p>
                    <p className="text-right">{payment.count}</p>
                    <p>Venta total:</p>
                    <p className="text-right">{formatCurrency(payment.amount)}</p>
                    {payment.method === 'cash' && (
                      <>
                        <p>Declarado al corte:</p>
                        <p className="text-right">{formatCurrency(payment.declared || 0)}</p>
                        <p>Diferencia:</p>
                        <p className="text-right">
                          {formatCurrency(payment.difference || 0)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Órdenes */}
            <div className="mb-4">
              <h5 className="font-bold">Órdenes</h5>
              <div className="grid grid-cols-2 gap-1 pl-4">
                <p># Abiertas:</p>
                <p className="text-right">{cut.ordersSummary.open}</p>
                <p># Cerradas:</p>
                <p className="text-right">{cut.ordersSummary.closed}</p>
                <p># Canceladas:</p>
                <p className="text-right">{cut.ordersSummary.cancelled}</p>
              </div>
            </div>
            
            {/* Cargos por Servicio */}
            <div className="mb-4">
              <h5 className="font-bold">Cargos Por Servicio</h5>
              <div className="grid grid-cols-2 gap-1 pl-4">
                <p># Órdenes con cargos por servicio:</p>
                <p className="text-right">{cut.serviceFees.count}</p>
                <p>Total cargos por servicio:</p>
                <p className="text-right">{formatCurrency(cut.serviceFees.amount)}</p>
              </div>
            </div>
            
            {/* Artículos Cancelados */}
            <div className="mb-4">
              <h5 className="font-bold">Artículos Cancelados</h5>
              <div className="grid grid-cols-2 gap-1 pl-4">
                <p># de artículos cancelados:</p>
                <p className="text-right">{cut.cancelledItems.count}</p>
                <p>Total de artículos cancelados:</p>
                <p className="text-right">{formatCurrency(cut.cancelledItems.amount)}</p>
              </div>
            </div>
            
            {/* Ventas Por Tipo de Orden */}
            <div className="mb-4">
              <h5 className="font-bold">Ventas Por Tipo De Orden</h5>
              {cut.salesByOrderType.map((order, index) => (
                <div key={index} className="mt-2">
                  <p className="font-medium">{order.type}</p>
                  <div className="grid grid-cols-2 gap-1 pl-4">
                    <p># Órdenes:</p>
                    <p className="text-right">{order.count}</p>
                    <p>Venta total:</p>
                    <p className="text-right">{formatCurrency(order.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Ventas Por Marca */}
            <div className="mb-4">
              <h5 className="font-bold">Ventas Por Marca</h5>
              {cut.salesByBrand.map((brand, index) => (
                <div key={index} className="mt-2">
                  <p className="font-medium">{brand.brand}</p>
                  <div className="grid grid-cols-2 gap-1 pl-4">
                    <p># Órdenes:</p>
                    <p className="text-right">{brand.count}</p>
                    <p>Venta total:</p>
                    <p className="text-right">{formatCurrency(brand.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Resumen de Ventas */}
            <div className="mb-4">
              <h5 className="font-bold">Resumen de Ventas</h5>
              <div className="grid grid-cols-2 gap-1 pl-4">
                <p className="font-bold">Venta bruta:</p>
                <p className="text-right font-bold">{formatCurrency(cut.salesSummary.grossSales)}</p>
                <p>Descuentos:</p>
                <p className="text-right">-{formatCurrency(cut.salesSummary.discounts)}</p>
                <p>Cargos por servicio:</p>
                <p className="text-right">+{formatCurrency(cut.salesSummary.serviceFees)}</p>
                <p className="font-bold">Venta total:</p>
                <p className="text-right font-bold">{formatCurrency(cut.salesSummary.totalSales)}</p>
                <p>Impuestos:</p>
                <p className="text-right">-{formatCurrency(cut.salesSummary.taxes)}</p>
                <p className="font-bold">Venta neta:</p>
                <p className="text-right font-bold">{formatCurrency(cut.salesSummary.netSales)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-wrap gap-2">
        <Button className="flex-1" onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Reporte
        </Button>
        <Button className="flex-1" variant="outline" onClick={onExport}>
          <FileText className="mr-2 h-4 w-4" />
          Exportar Reporte
        </Button>
        <Button className="flex-1" variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
}
