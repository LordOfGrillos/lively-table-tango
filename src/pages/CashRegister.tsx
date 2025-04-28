
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { 
  Banknote, 
  Calendar, 
  FileText, 
  Printer, 
  RefreshCcw, 
  ReceiptText, 
  PlusCircle, 
  MinusCircle 
} from "lucide-react";
import { RegisterSelector } from "@/components/cash-register/RegisterSelector";
import { DateRangeSelector } from "@/components/cash-register/DateRangeSelector";
import { TransactionsTable } from "@/components/cash-register/TransactionsTable";
import { ReportSummary } from "@/components/cash-register/ReportSummary";
import { RegisterOpenForm } from "@/components/cash-register/RegisterOpenForm";
import { RegisterCutForm } from "@/components/cash-register/RegisterCutForm";
import { RegisterCutReport } from "@/components/cash-register/RegisterCutReport";
import { CashMovementForm } from "@/components/cash-register/CashMovementForm";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CashRegister as CashRegisterType, 
  RegisterTransaction, 
  RegisterReport, 
  RegisterCut, 
  CashMovement 
} from "@/components/cash-register/types";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { mockRegisters, generateMockTransactions, generateReport } from "@/components/cash-register/data/mockData";
import { toast } from "sonner";

type DialogType = 
  | "none" 
  | "openRegister" 
  | "cashMovement" 
  | "registerCut" 
  | "endOfDay" 
  | "cutReport";

export default function CashRegister() {
  // State for register selection
  const [selectedRegister, setSelectedRegister] = useState<CashRegisterType | null>(mockRegisters[0]);
  
  // State for register status
  const [registerStatus, setRegisterStatus] = useState<"closed" | "open">("closed");
  
  // State for dialogs
  const [activeDialog, setActiveDialog] = useState<DialogType>("none");
  
  // State for reports and transactions
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  
  const [startDate, setStartDate] = useState<Date>(startOfDay);
  const [endDate, setEndDate] = useState<Date>(now);
  const [transactions, setTransactions] = useState<RegisterTransaction[]>(
    generateMockTransactions(30)
  );
  const [cashMovements, setCashMovements] = useState<CashMovement[]>([]);
  const [currentCut, setCurrentCut] = useState<RegisterCut | null>(null);
  
  // Settings (normally these would come from a server/database)
  const [isBlindCut, setIsBlindCut] = useState<boolean>(false);
  const [allowCutWithOpenOrders, setAllowCutWithOpenOrders] = useState<boolean>(true);
  
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
  
  // Calculate expected cash
  const expectedCash = useMemo(() => {
    const initialCash = selectedRegister?.initialAmount || 0;
    const cashSales = transactions
      .filter(tx => tx.paymentMethod === "cash")
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const deposits = cashMovements
      .filter(mov => mov.type === "deposit")
      .reduce((sum, mov) => sum + mov.amount, 0);
      
    const withdrawals = cashMovements
      .filter(mov => mov.type === "withdrawal")
      .reduce((sum, mov) => sum + mov.amount, 0);
    
    return initialCash + cashSales + deposits - withdrawals;
  }, [selectedRegister, transactions, cashMovements]);
  
  // Handlers
  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const handleRefresh = () => {
    // In a real app, this would fetch fresh data from the server
    setTransactions(generateMockTransactions(30));
  };
  
  const handleOpenRegister = (initialAmount: number) => {
    if (selectedRegister) {
      // In a real app, this would make an API call to update the register
      setSelectedRegister({
        ...selectedRegister,
        initialAmount,
        status: "open",
        openedAt: new Date(),
        openedBy: "Usuario Actual"
      });
      setRegisterStatus("open");
      setActiveDialog("none");
    }
  };
  
  const handleAddCashMovement = (movement: CashMovement) => {
    // In a real app, this would make an API call to record the movement
    setCashMovements(prev => [...prev, movement]);
    setActiveDialog("none");
  };
  
  const handleCompleteCut = (cutData: RegisterCut) => {
    // In a real app, this would make an API call to save the cut
    setCurrentCut(cutData);
    
    if (cutData.isEndOfDay) {
      // For end of day, close the register
      if (selectedRegister) {
        setSelectedRegister({
          ...selectedRegister,
          status: "closed",
          closedAt: new Date()
        });
        setRegisterStatus("closed");
      }
    }
    
    setActiveDialog("cutReport");
  };
  
  const handlePrintCut = () => {
    // In a real app, this would trigger printing
    toast.success("Enviando reporte a impresora...");
  };
  
  const handleExportCut = () => {
    // In a real app, this would generate and download a file
    toast.success("Exportando reporte...");
  };
  
  const renderDialogContent = () => {
    switch (activeDialog) {
      case "openRegister":
        return selectedRegister ? (
          <RegisterOpenForm
            register={selectedRegister}
            onOpenRegister={handleOpenRegister}
            onCancel={() => setActiveDialog("none")}
          />
        ) : null;
        
      case "cashMovement":
        return selectedRegister ? (
          <CashMovementForm
            register={selectedRegister}
            onSubmitMovement={handleAddCashMovement}
            onCancel={() => setActiveDialog("none")}
          />
        ) : null;
        
      case "registerCut":
        return selectedRegister ? (
          <RegisterCutForm
            register={selectedRegister}
            pendingOrders={3} // En un sistema real, esto vendría de la base de datos
            expectedCash={expectedCash}
            onCompleteCut={handleCompleteCut}
            onCancel={() => setActiveDialog("none")}
            isBlindCut={isBlindCut}
            allowCutWithOpenOrders={allowCutWithOpenOrders}
            cutType="shift"
          />
        ) : null;
        
      case "endOfDay":
        return selectedRegister ? (
          <RegisterCutForm
            register={selectedRegister}
            pendingOrders={3} // En un sistema real, esto vendría de la base de datos
            expectedCash={expectedCash}
            onCompleteCut={handleCompleteCut}
            onCancel={() => setActiveDialog("none")}
            isBlindCut={isBlindCut}
            allowCutWithOpenOrders={allowCutWithOpenOrders}
            cutType="endOfDay"
          />
        ) : null;
        
      case "cutReport":
        return currentCut ? (
          <RegisterCutReport
            cut={currentCut}
            onPrint={handlePrintCut}
            onExport={handleExportCut}
            onClose={() => setActiveDialog("none")}
          />
        ) : null;
        
      default:
        return null;
    }
  };
  
  const getDialogTitle = () => {
    switch (activeDialog) {
      case "openRegister":
        return "Apertura de Caja";
      case "cashMovement":
        return "Movimiento de Efectivo";
      case "registerCut":
        return "Corte de Caja";
      case "endOfDay":
        return "Cierre de Día";
      case "cutReport":
        return currentCut?.isEndOfDay ? "Reporte de Cierre de Día" : "Reporte de Corte de Caja";
      default:
        return "";
    }
  };
  
  const getDialogDescription = () => {
    switch (activeDialog) {
      case "openRegister":
        return "Registrar fondo inicial de caja";
      case "cashMovement":
        return "Registrar entrada o salida de efectivo";
      case "registerCut":
        return "Realizar corte de caja para el turno actual";
      case "endOfDay":
        return "Realizar cierre de día y generar reporte";
      case "cutReport":
        return "Resumen de operaciones del periodo";
      default:
        return "";
    }
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
              <Card>
                <CardHeader>
                  <CardTitle>Selección y Estado de Caja</CardTitle>
                  <CardDescription>Seleccione una caja para ver su estado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RegisterSelector 
                    registers={mockRegisters}
                    selectedRegister={selectedRegister}
                    onSelectRegister={setSelectedRegister}
                  />
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => setActiveDialog("openRegister")}
                      disabled={registerStatus === "open"}
                      className="flex-1"
                    >
                      <Banknote className="mr-2 h-4 w-4" />
                      Abrir Caja
                    </Button>
                    <Button 
                      onClick={() => setActiveDialog("registerCut")}
                      disabled={registerStatus === "closed"}
                      variant="secondary"
                      className="flex-1"
                    >
                      <ReceiptText className="mr-2 h-4 w-4" />
                      Corte de Caja
                    </Button>
                    <Button 
                      onClick={() => setActiveDialog("endOfDay")}
                      disabled={registerStatus === "closed"}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Cierre de Día
                    </Button>
                  </div>
                  
                  {registerStatus === "open" && (
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">Movimientos de Efectivo</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          onClick={() => setActiveDialog("cashMovement")}
                          variant="outline"
                          className="flex-1"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Ingreso / Depósito
                        </Button>
                        <Button 
                          onClick={() => setActiveDialog("cashMovement")}
                          variant="outline"
                          className="flex-1"
                        >
                          <MinusCircle className="mr-2 h-4 w-4" />
                          Retiro / Salida
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                {registerStatus === "open" && (
                  <CardFooter className="bg-muted p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Estado de Caja:</p>
                      <p className="text-sm text-green-600 font-semibold">Abierta</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Apertura:</p>
                      <p className="text-sm">{selectedRegister?.openedAt ? format(selectedRegister.openedAt, "dd/MM/yy HH:mm", { locale: es }) : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Efectivo:</p>
                      <p className="text-sm font-semibold">${expectedCash.toFixed(2)}</p>
                    </div>
                  </CardFooter>
                )}
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Periodo de Reporte</CardTitle>
                  <CardDescription>Seleccione el periodo para generar el reporte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DateRangeSelector
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={handleDateChange}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="flex-1">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Reporte
                  </Button>
                  <Button variant="outline" className="flex-1 ml-2">
                    <FileText className="mr-2 h-4 w-4" />
                    Exportar a Excel
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {report && (
              <>
                {/* Report Summary */}
                <div>
                  <h2 className="text-lg font-medium mb-4">Resumen del Reporte</h2>
                  <ReportSummary report={report} />
                </div>
                
                <Separator className="my-6" />
                
                {/* Transactions */}
                <div>
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
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Dialogs */}
      <Dialog open={activeDialog !== "none"} onOpenChange={(open) => !open && setActiveDialog("none")}>
        <DialogContent className={`sm:max-w-${activeDialog === "cutReport" ? "3xl" : "lg"}`}>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDescription()}</DialogDescription>
          </DialogHeader>
          
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
