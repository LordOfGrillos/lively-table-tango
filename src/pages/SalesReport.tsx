
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { DateRangePicker } from "@/components/reports/DateRangePicker";
import { ReportMetrics } from "@/components/reports/ReportMetrics";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { OrdersTable } from "@/components/reports/OrdersTable";
import { ReportCharts } from "@/components/reports/ReportCharts";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";
import { FileSpreadsheet } from "lucide-react";
import { OrderDetailDrawer } from "@/components/reports/OrderDetailDrawer";
import { toast } from "sonner";
import { mockOrders } from "@/components/reports/data/mockData";
import { AIInsights } from "@/components/reports/AIInsights";

export default function SalesReport() {
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([
    new Date(2025, 3, 1),
    new Date(2025, 3, 28)
  ]);
  const [filters, setFilters] = useState({
    brands: [],
    channels: [],
    orderTypes: [],
    statuses: []
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Reporte actualizado", {
        description: "Los datos han sido actualizados exitosamente"
      });
    }, 1000);
  };

  const handleExport = () => {
    toast.success("Exportando reporte", {
      description: "El archivo Excel se está descargando"
    });
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <Header
          title="Reporte de Ventas"
          subtitle="Visualiza y analiza los datos de ventas del restaurante"
          className="bg-white shadow-sm"
        />

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="max-w-[1400px] mx-auto">
            {/* Top row with cards and date picker */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
              <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-4 border border-purple-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                <ReportMetrics orders={orders} isCompact={true} className="w-full" />
                <div className="flex flex-col lg:flex-row items-center gap-3 lg:ml-auto">
                  <DateRangePicker
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    className="min-w-[200px]"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all w-full lg:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cargando..." : "Consultar"}
                  </Button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-purple-100 flex items-center justify-between">
                <Button 
                  variant="outline"
                  onClick={handleExport}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-full w-full flex items-center justify-center"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>

            {/* Filters */}
            <ReportFilters 
              filters={filters} 
              setFilters={setFilters} 
              isVisible={isFilterVisible} 
              setIsVisible={setIsFilterVisible} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
              {/* Left column - Charts */}
              <div className="lg:col-span-2 space-y-5">
                {/* Metrics Cards (non-compact) */}
                <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-5">
                  <ReportMetrics orders={orders} isCompact={false} />
                </div>
                
                {/* Charts */}
                <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-5">
                  <ReportCharts orders={orders} />
                </div>
              </div>

              {/* Right column - AI Insights */}
              <div className="lg:col-span-1">
                <AIInsights orders={orders} className="h-full" />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-5 my-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalle de Órdenes</h2>
              <OrdersTable orders={orders} onSelectOrder={handleSelectOrder} />
            </div>
          </div>
        </div>

        {/* Order Detail Drawer */}
        <OrderDetailDrawer 
          orderId={selectedOrder}
          orders={orders} 
          onClose={handleCloseDetail} 
        />
      </div>
    </div>
  );
}
