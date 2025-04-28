
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterReport } from "./types";
import { Wallet, CreditCard, Receipt, Banknote } from "lucide-react";

interface ReportSummaryProps {
  report: RegisterReport;
}

export function ReportSummary({ report }: ReportSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
          <Receipt className="h-4 w-4 text-app-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${report.totalAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {report.transactions.length} transacciones
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Efectivo</CardTitle>
          <Banknote className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${report.totalCash.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((report.totalCash / report.totalAmount) * 100) || 0}% del total
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Tarjetas</CardTitle>
          <CreditCard className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${report.totalCard.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((report.totalCard / report.totalAmount) * 100) || 0}% del total
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Otros Métodos</CardTitle>
          <Wallet className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${report.totalOther.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((report.totalOther / report.totalAmount) * 100) || 0}% del total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
