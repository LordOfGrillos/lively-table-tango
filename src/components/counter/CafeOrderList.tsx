
import { OrderItem } from "./CounterOrderSystem";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export type CafeOrder = {
  id: string;
  customerName: string;
  orderNumber: number;
  items: OrderItem[];
  total: number;
  status: "preparing" | "ready" | "completed"; // Note: doesn't include "pending"
  createdAt: Date;
  paidAt: Date | null;
};

interface CafeOrderListProps {
  orders: CafeOrder[];
  onStatusChange?: (orderId: string, newStatus: CafeOrder['status']) => void;
}

export function CafeOrderList({ orders, onStatusChange }: CafeOrderListProps) {
  const getStatusColor = (status: CafeOrder['status']) => {
    switch (status) {
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Orden #</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <div className="max-w-[200px] space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange?.(order.id, e.target.value as CafeOrder['status'])}
                  className={`${getStatusColor(order.status)} px-2 py-1 rounded-md text-sm border-0`}
                >
                  <option value="preparing">Preparando</option>
                  <option value="ready">Listo</option>
                  <option value="completed">Completado</option>
                </select>
              </TableCell>
              <TableCell>{format(order.createdAt, 'HH:mm')}</TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No hay órdenes por el momento
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
