
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Order } from "./types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";

interface ReportChartsProps {
  orders: Order[];
  className?: string;
}

export function ReportCharts({ orders, className }: ReportChartsProps) {
  const [activeChart, setActiveChart] = useState<"sales" | "channels" | "orderTypes">("sales");

  // Chart configurations
  const chartConfig = {
    sales: {
      label: "Ventas por Día",
      color: "#9b87f5"
    },
    channels: {
      label: "Ventas por Canal",
      color: "#7E69AB"
    },
    orderTypes: {
      label: "Ventas por Tipo de Orden",
      color: "#D6BCFA"
    }
  };

  // Sample data for Sales by Day chart (in a real app, this would be derived from orders)
  const salesByDayData = [
    { name: "Lun", income: 12500, expense: 8500 },
    { name: "Mar", income: 15000, expense: 10200 },
    { name: "Mié", income: 13200, expense: 9000 },
    { name: "Jue", income: 16800, expense: 11500 },
    { name: "Vie", income: 22000, expense: 14000 },
    { name: "Sáb", income: 25500, expense: 15500 },
    { name: "Dom", income: 19800, expense: 12800 }
  ];

  // Sample data for Sales by Channel chart
  const salesByChannelData = [
    { name: "Punto de Venta", value: 45, color: "#0EA5E9" },
    { name: "Uber Eats", value: 20, color: "#10B981" },
    { name: "DiDi Food", value: 15, color: "#F59E0B" },
    { name: "Rappi", value: 20, color: "#EF4444" }
  ];

  // Sample data for Sales by Order Type chart
  const salesByOrderTypeData = [
    { name: "Delivery", value: 35, color: "#9b87f5" },
    { name: "Dine In", value: 40, color: "#7E69AB" },
    { name: "Pickup", value: 15, color: "#FEC6A1" },
    { name: "Para Llevar", value: 10, color: "#E0BBFF" }
  ];

  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={cn(className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Análisis de Ventas</h2>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeChart === "sales" ? "default" : "outline"}
            onClick={() => setActiveChart("sales")}
            className={activeChart === "sales" 
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
              : "border-purple-200 text-purple-700 hover:bg-purple-50"}
            size="sm"
          >
            Ventas por Día
          </Button>
          <Button
            variant={activeChart === "channels" ? "default" : "outline"}
            onClick={() => setActiveChart("channels")}
            className={activeChart === "channels" 
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
              : "border-purple-200 text-purple-700 hover:bg-purple-50"}
            size="sm"
          >
            Por Canal
          </Button>
          <Button
            variant={activeChart === "orderTypes" ? "default" : "outline"}
            onClick={() => setActiveChart("orderTypes")}
            className={activeChart === "orderTypes" 
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
              : "border-purple-200 text-purple-700 hover:bg-purple-50"}
            size="sm"
          >
            Por Tipo
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {activeChart === "sales" && (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesByDayData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `$${value/1000}k`}
                  domain={[0, 'dataMax + 5000']}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f0f0f0'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name="Ingresos"
                  stroke="#9b87f5" 
                  strokeWidth={2}
                  dot={{ stroke: '#7E69AB', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 6, fill: '#7E69AB' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  name="Gastos"
                  stroke="#E0BBFF" 
                  strokeWidth={2}
                  dot={{ stroke: '#D6BCFA', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 6, fill: '#D6BCFA' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === "channels" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesByChannelData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #f0f0f0'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {salesByChannelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByChannelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByChannelData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #f0f0f0'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === "orderTypes" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesByOrderTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #f0f0f0'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {salesByOrderTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByOrderTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByOrderTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #f0f0f0'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
