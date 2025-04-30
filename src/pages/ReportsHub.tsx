
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Star, 
  Calendar, 
  Mail, 
  FileSpreadsheet, 
  ChevronRight,
  ChartBar,
  LayoutDashboard
} from "lucide-react";
import { AIInsights } from "@/components/reports/AIInsights";

// Sample report categories
const reportCategories = [
  { id: "sales", name: "Ventas", icon: <ChartBar className="h-5 w-5" /> },
  { id: "inventory", name: "Inventario", icon: <ChartBar className="h-5 w-5" /> },
  { id: "finances", name: "Finanzas", icon: <ChartBar className="h-5 w-5" /> },
  { id: "operations", name: "Operaciones", icon: <ChartBar className="h-5 w-5" /> },
];

// Sample reports
const reports = [
  {
    id: "daily-sales",
    name: "Ventas diarias",
    description: "Resumen de ventas del día actual",
    category: "sales",
    path: "/sales-report?period=day",
    tags: ["ventas", "diario"]
  },
  {
    id: "weekly-sales",
    name: "Ventas semanales",
    description: "Análisis de ventas de la última semana",
    category: "sales",
    path: "/sales-report?period=week",
    tags: ["ventas", "semanal"]
  },
  {
    id: "monthly-sales",
    name: "Ventas mensuales",
    description: "Reporte detallado de ventas del mes",
    category: "sales",
    path: "/sales-report?period=month",
    tags: ["ventas", "mensual"]
  },
  {
    id: "inventory-status",
    name: "Estado de inventario",
    description: "Estado actual del inventario",
    category: "inventory",
    path: "/inventory?report=status",
    tags: ["inventario", "stock"]
  },
  {
    id: "low-stock",
    name: "Stock bajo",
    description: "Productos con nivel de stock bajo",
    category: "inventory",
    path: "/inventory?report=low-stock",
    tags: ["inventario", "stock bajo", "alertas"]
  },
  {
    id: "cash-flow",
    name: "Flujo de caja",
    description: "Análisis del flujo de caja",
    category: "finances",
    path: "/cash-register?report=flow",
    tags: ["finanzas", "caja", "flujo"]
  },
  {
    id: "staff-performance",
    name: "Rendimiento del personal",
    description: "Análisis de rendimiento del personal",
    category: "operations",
    path: "/staff?report=performance",
    tags: ["personal", "rendimiento", "operaciones"]
  }
];

// Sample favorite reports
const initialFavorites = ["daily-sales", "low-stock", "cash-flow"];

export default function ReportsHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(initialFavorites);
  
  const filteredReports = reports.filter(report => {
    if (activeTab !== "all" && activeTab !== "favorites") {
      // Filter by category
      return report.category === activeTab;
    } else if (activeTab === "favorites") {
      // Filter by favorites
      return favorites.includes(report.id);
    }
    // Show all
    return true;
  }).filter(report => {
    // Filter by search term
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      report.name.toLowerCase().includes(searchLower) || 
      report.description.toLowerCase().includes(searchLower) ||
      report.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
  const toggleFavorite = (reportId: string) => {
    if (favorites.includes(reportId)) {
      setFavorites(favorites.filter(id => id !== reportId));
    } else {
      setFavorites([...favorites, reportId]);
    }
  };
  
  const navigateToReport = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <Header
          title="Reportes & Analytics"
          subtitle="Hub central para todos los reportes y análisis de datos del negocio"
          className="bg-white shadow-sm"
        />
        
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="max-w-[1400px] mx-auto">
            {/* Search and filters */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-5 border border-purple-100">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar reportes..."
                    className="pl-10 border-purple-200 focus:border-purple-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Programar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Tabs and report categories */}
            <div className="mb-5">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-white rounded-lg border border-purple-100 p-1 mb-5">
                  <TabsTrigger 
                    value="all"
                    className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Todos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="favorites"
                    className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900"
                  >
                    <Star className="h-4 w-4 mr-2 fill-amber-400 text-amber-400" />
                    Favoritos
                  </TabsTrigger>
                  {reportCategories.map((category) => (
                    <TabsTrigger 
                      key={category.id}
                      value={category.id}
                      className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900"
                    >
                      {category.icon}
                      <span className="ml-2">{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredReports.map((report) => (
                      <Card 
                        key={report.id}
                        className="border border-purple-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg text-gray-900 mb-1">{report.name}</h3>
                              <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {report.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={favorites.includes(report.id) ? "text-amber-400" : "text-gray-400"}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(report.id);
                              }}
                            >
                              <Star className={favorites.includes(report.id) ? "fill-amber-400" : ""} />
                            </Button>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center"
                              onClick={() => navigateToReport(report.path)}
                            >
                              Ver reporte completo
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {filteredReports.length === 0 && (
                    <div className="bg-white rounded-xl p-10 text-center border border-purple-100">
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron reportes</h3>
                      <p className="text-gray-500">
                        {searchTerm 
                          ? `No hay reportes que coincidan con "${searchTerm}"`
                          : activeTab === "favorites"
                            ? "No tienes reportes favoritos guardados"
                            : "No hay reportes disponibles en esta categoría"}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* AI Insights Section */}
            <div className="mb-5">
              <AIInsights orders={[]} className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
