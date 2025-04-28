
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RegisterTransaction } from "./types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TransactionsTableProps {
  transactions: RegisterTransaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "cash":
        return <Badge className="bg-green-500 hover:bg-green-600">Efectivo</Badge>;
      case "card":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Tarjeta</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Otro</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Transacciones del periodo seleccionado</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Empleado</TableHead>
            <TableHead className="text-right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No hay transacciones para el periodo seleccionado
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {format(transaction.timestamp, "dd MMM yyyy HH:mm", { locale: es })}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{getPaymentMethodBadge(transaction.paymentMethod)}</TableCell>
                <TableCell>{transaction.employeeName || "N/A"}</TableCell>
                <TableCell className="text-right">
                  ${transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
