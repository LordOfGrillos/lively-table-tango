
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Printer, RefreshCcw } from "lucide-react";
import { RegisterSelector } from "@/components/cash-register/RegisterSelector";
import { DateRangeSelector } from "@/components/cash-register/DateRangeSelector";
import { TransactionsTable } from "@/components/cash-register/TransactionsTable";
import { ReportSummary } from "@/components/cash-register/ReportSummary";
import { ReportExport } from "@/components/cash-register/ReportExport";
import { mockRegisters, generateMockTransactions, generateReport } from "@/components/cash-register/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CashRegister as CashRegisterType, RegisterTransaction, RegisterReport } from "@/components/cash-register/types";
import { Separator } from "@/components/ui/separator";

export default function CashRegister() {
  // State for register selection
  const [selectedRegister, setSelectedRegister] = useState<CashRegisterType | null>(mockRegisters[0]);
  
  // State for date range
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  
  const [startDate, setStartDate] = useState<Date>(startOfDay);
  const [endDate, setEndDate] = useState<Date>(now);
  
  // Generate mock transactions
  const [transactions, setTransactions] = useState<RegisterTransaction[]>(
    generateMockTransactions(30)
  );
  
  // Create report based on selected register and date range
  const report = useMemo(() => {
    if (!selectedRegister) return null;
    
    return generateReport(
      selectedRegister.id,
      selectedRegister.name,
      startDate,
      endDate,
      transactions
    );
  }, [selectedRegister, startDate, endDate, transactions]);
  
  // Handlers
  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const handleRefresh = () => {
    // In a real app, this would fetch fresh data from the server
    setTransactions(generateMockTransactions(30));
  };
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Sistema de Corte de Caja" 
          subtitle="Gestiona y reporta el flujo de efectivo por cajas"
          actionButton={
            <Button 
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Actualizar
            </Button>
          }
        />
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Register selection and date range */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-2">Seleccionar Caja</h2>
                <RegisterSelector 
                  registers={mockRegisters}
                  selectedRegister={selectedRegister}
                  onSelectRegister={setSelectedRegister}
                />
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-2">Periodo de Reporte</h2>
                <DateRangeSelector
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={handleDateChange}
                />
              </div>
            </div>
            
            {report && (
              <>
                {/* Report Summary */}
                <div>
                  <h2 className="text-lg font-medium mb-4">Resumen del Reporte</h2>
                  <ReportSummary report={report} />
                </div>
                
                <Separator className="my-6" />
                
                {/* Report Content */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h2 className="text-lg font-medium mb-4">Transacciones</h2>
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList>
                        <TabsTrigger value="all">Todas</TabsTrigger>
                        <TabsTrigger value="cash">Efectivo</TabsTrigger>
                        <TabsTrigger value="card">Tarjeta</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all">
                        <TransactionsTable transactions={report.transactions} />
                      </TabsContent>
                      
                      <TabsContent value="cash">
                        <TransactionsTable 
                          transactions={report.transactions.filter(tx => tx.paymentMethod === "cash")} 
                        />
                      </TabsContent>
                      
                      <TabsContent value="card">
                        <TransactionsTable 
                          transactions={report.transactions.filter(tx => tx.paymentMethod === "card")} 
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-medium mb-4">Exportar Reporte</h2>
                    <ReportExport report={report} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
