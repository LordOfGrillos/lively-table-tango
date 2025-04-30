
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowUpRight, 
  TrendingUp, 
  ChevronRight, 
  Users, 
  UtensilsCrossed, 
  Activity,
  Package,
  Calendar,
  Clock,
  ChevronDown,
  Search
} from "lucide-react";
import { AIInsights } from "@/components/reports/AIInsights";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersOverview } from "@/components/dashboard/OrdersOverview";
import { TopCategories } from "@/components/dashboard/TopCategories";
import { OrderTypes } from "@/components/dashboard/OrderTypes";
import { ActiveStaffList } from "@/components/dashboard/ActiveStaffList";
import { PopularItems } from "@/components/dashboard/PopularItems";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { QuickAccessCard } from "@/components/dashboard/QuickAccessCard";

export default function Index() {
  const [period, setPeriod] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <Header
          title="Dashboard"
          subtitle="¡Hola Carlos, bienvenido de nuevo!"
          className="bg-white shadow-sm"
          actionButton={
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Buscar en el sistema..."
                className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          }
        />
        
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="max-w-[1400px] mx-auto">
            {/* Period selector */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Resumen del Negocio</h1>
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-gray-500">Periodo:</div>
                <Tabs defaultValue={period} onValueChange={setPeriod} className="w-[400px]">
                  <TabsList className="bg-white border border-gray-200">
                    <TabsTrigger value="today" className="text-xs data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                      Hoy
                    </TabsTrigger>
                    <TabsTrigger value="yesterday" className="text-xs data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                      Ayer
                    </TabsTrigger>
                    <TabsTrigger value="week" className="text-xs data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                      Esta Semana
                    </TabsTrigger>
                    <TabsTrigger value="month" className="text-xs data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                      Este Mes
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {/* Top metrics */}
            <div className="mb-6">
              <DashboardMetrics period={period} />
            </div>
            
            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left column - Charts */}
              <div className="lg:col-span-8 space-y-5">
                {/* Revenue Chart */}
                <Card className="border border-gray-200 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">Ingresos y Gastos</h2>
                        <p className="text-sm text-gray-500">Análisis comparativo de ingresos vs. gastos</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center">
                        Ver Reporte 
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <RevenueChart period={period} />
                  </CardContent>
                </Card>
                
                {/* Orders Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Card className="border border-gray-200 shadow-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Órdenes por Día</h2>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <OrdersOverview period={period} />
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 shadow-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Categorías más Vendidas</h2>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <TopCategories period={period} />
                    </CardContent>
                  </Card>
                </div>
                
                {/* Order Types and Recent Orders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Card className="border border-gray-200 shadow-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Tipos de Órdenes</h2>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <OrderTypes period={period} />
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 shadow-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Órdenes Recientes</h2>
                        <Link to="/reports">
                          <Button variant="ghost" size="sm" className="text-purple-700 hover:text-purple-900 hover:bg-purple-50">
                            Ver todas
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      <RecentOrders />
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Right column - Sidebar with various insights */}
              <div className="lg:col-span-4 space-y-5">
                {/* AI Insights card */}
                <Card className="border border-purple-200 shadow-sm overflow-hidden bg-gradient-to-br from-white to-purple-50">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-purple-600" />
                        AI Insights
                      </h2>
                    </div>
                    <div className="h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      <AIInsights orders={[]} className="h-auto" />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quick Access Links */}
                <Card className="border border-gray-200 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Accesos Rápidos</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <QuickAccessCard 
                        title="Nuevo Pedido" 
                        icon={<UtensilsCrossed className="h-5 w-5" />} 
                        path="/"
                        color="bg-orange-100 text-orange-600"
                      />
                      <QuickAccessCard 
                        title="Inventario" 
                        icon={<Package className="h-5 w-5" />} 
                        path="/inventory"
                        color="bg-blue-100 text-blue-600"
                      />
                      <QuickAccessCard 
                        title="Personal" 
                        icon={<Users className="h-5 w-5" />} 
                        path="/staff"
                        color="bg-green-100 text-green-600"
                      />
                      <QuickAccessCard 
                        title="Reportes" 
                        icon={<TrendingUp className="h-5 w-5" />} 
                        path="/reports"
                        color="bg-purple-100 text-purple-600"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Popular Items */}
                <Card className="border border-gray-200 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">Platillos Populares</h2>
                      <Link to="/dishes">
                        <Button variant="ghost" size="sm" className="text-purple-700 hover:text-purple-900 hover:bg-purple-50">
                          Ver menú
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <PopularItems />
                  </CardContent>
                </Card>
                
                {/* Active Staff */}
                <Card className="border border-gray-200 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">Personal Activo</h2>
                      <Link to="/staff">
                        <Button variant="ghost" size="sm" className="text-purple-700 hover:text-purple-900 hover:bg-purple-50">
                          Ver todo
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <ActiveStaffList />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
