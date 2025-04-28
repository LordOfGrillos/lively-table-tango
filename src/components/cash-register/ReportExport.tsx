
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RegisterReport } from "./types";
import { FileText, Download, Printer, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ReportExportProps {
  report: RegisterReport;
}

export function ReportExport({ report }: ReportExportProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (format: "pdf" | "excel") => {
    setLoading(format);
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // In a real application, this would generate and download the file
    const fileName = `corte_caja_${report.registerName}_${format === "pdf" ? ".pdf" : ".xlsx"}`;
    
    // Create a mock download by showing alert
    alert(`El reporte se ha exportado como ${fileName}`);
    
    setLoading(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-2">Resumen del reporte</h3>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Caja:</strong> {report.registerName}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Periodo:</strong> {format(report.startDate, "PPP", { locale: es })} - {format(report.endDate, "PPP", { locale: es })}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Total:</strong> ${report.totalAmount.toFixed(2)}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="flex-1"
          disabled={loading === "pdf"}
          onClick={() => handleExport("pdf")}
        >
          {loading === "pdf" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Exportar PDF
        </Button>
        
        <Button
          variant="outline" 
          className="flex-1"
          disabled={loading === "excel"}
          onClick={() => handleExport("excel")}
        >
          {loading === "excel" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Exportar Excel
        </Button>
        
        <Button 
          variant="outline"
          className="flex-1"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>
    </div>
  );
}
