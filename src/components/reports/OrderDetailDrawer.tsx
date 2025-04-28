
import { Order } from "./types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface OrderDetailDrawerProps {
  orderId: string | null;
  orders: Order[];
  onClose: () => void;
}

export function OrderDetailDrawer({ orderId, orders, onClose }: OrderDetailDrawerProps) {
  const order = orders.find(o => o.id === orderId);

  if (!order) return null;

  // Helper functions for formatting
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-MX", {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "served":
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
      case "voided":
        return "bg-red-100 text-red-800 border-red-200";
      case "cooking":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "pending":
      case "accepted":
      case "open":
      case "created":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Sheet open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-gradient-to-br from-white to-purple-50">
        <SheetHeader className="pb-4">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-2xl font-bold text-gray-800">
              Orden #{order.id}
            </SheetTitle>
            <SheetClose className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </SheetClose>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">
                Creada: {formatDate(order.createdAt)}
              </span>
              {order.paymentDate && (
                <span className="text-sm text-gray-500">
                  Pagada: {formatDate(order.paymentDate)}
                </span>
              )}
            </div>
            <Badge variant="outline" className={`${getStatusBadgeStyle(order.status)} text-sm px-3 py-1`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-800">Detalles del Cliente</h3>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p className="text-base font-medium">{order.customerName || "Cliente no registrado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Mesa</p>
                  <p className="text-base font-medium">{order.tableNumber ? `#${order.tableNumber}` : "N/A"}</p>
                </div>
                {order.paymentMethod && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Método de Pago</p>
                    <p className="text-base font-medium capitalize">{order.paymentMethod}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-800">Productos</h3>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold">
                          {item.quantity}x {item.name}
                        </span>
                        <Badge variant="outline" className={`${getStatusBadgeStyle(item.status)} ml-2 text-xs`}>
                          {item.status}
                        </Badge>
                      </div>
                      {item.options && (
                        <p className="text-xs text-gray-500">{item.options}</p>
                      )}
                      {item.notes && (
                        <p className="text-xs italic text-gray-500">Notas: {item.notes}</p>
                      )}
                    </div>
                    <span className="font-medium text-right ml-4 text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-800">Resumen</h3>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(order.total * 0.84)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">IVA (16%):</span>
                  <span>{formatCurrency(order.total * 0.16)}</span>
                </div>
                {order.tip > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Propina:</span>
                    <span>{formatCurrency(order.tip || 0)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total + (order.tip || 0))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
