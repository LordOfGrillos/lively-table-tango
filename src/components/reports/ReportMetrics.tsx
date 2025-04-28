
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Order } from "./types";
import { 
  ChartPie, 
  ChartBar, 
  CircleInfo
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface ReportMetricsProps {
  orders: Order[];
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  color: string;
  tooltipText?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

// A beautiful card component for each metric
function MetricCard({ title, value, description, icon, color, tooltipText, change }: MetricCardProps) {
  return (
    <Card className={`border-l-4 ${color} shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
      <CardContent className="p-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent pointer-events-none" />
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              {tooltipText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleInfo className="h-3.5 w-3.5 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">{tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
            </div>
            {change && (
              <div className={`text-xs font-medium ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {change.isPositive ? '+' : ''}{change.value}% vs mes anterior
              </div>
            )}
          </div>
          <div className={`rounded-full p-2 ${color.replace('border', 'bg').replace('-4', '-100')} ${color.replace('border', 'text').replace('-4', '-600')}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportMetrics({ orders, className }: ReportMetricsProps) {
  const [isCompact, setIsCompact] = useState(false);

  // Calculate metrics from orders
  const totalOrders = orders.length;
  const openOrders = orders.filter(order => 
    ["accepted", "open", "created"].includes(order.status)
  ).length;
  const cancelledOrders = orders.filter(order => 
    ["cancelled", "voided"].includes(order.status)
  ).length;
  const completedOrders = orders.filter(order => 
    order.status === "completed"
  ).length;
  const paidOrders = orders.filter(order => 
    order.status === "paid"
  ).length;
  const deniedOrders = orders.filter(order => 
    order.status === "denied"
  ).length;
  
  const grossSales = orders.reduce((total, order) => total + order.total, 0);
  const avgTicket = grossSales / totalOrders || 0;
  const estimatedCommission = grossSales * 0.3;
  const netSales = grossSales - estimatedCommission;

  // Primary metrics to show in large cards
  const primaryMetrics: MetricCardProps[] = [
    {
      title: "Órdenes Totales",
      value: totalOrders,
      icon: <ChartBar className="h-6 w-6" />,
      color: "border-indigo-400",
      change: { value: 5.2, isPositive: true }
    },
    {
      title: "Ventas Brutas",
      value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(grossSales),
      icon: <ChartPie className="h-6 w-6" />,
      color: "border-emerald-400",
      change: { value: 7.8, isPositive: true }
    },
    {
      title: "Ticket Promedio",
      value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(avgTicket),
      icon: <ChartBar className="h-6 w-6" />,
      color: "border-blue-400",
      change: { value: 2.3, isPositive: true }
    },
    {
      title: "Ventas Netas",
      value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(netSales),
      icon: <ChartPie className="h-6 w-6" />,
      color: "border-purple-400",
      tooltipText: "Total de ventas menos comisiones estimadas (30%)",
      change: { value: 1.5, isPositive: false }
    }
  ];

  // Secondary metrics to show in smaller cards
  const secondaryMetrics: MetricCardProps[] = [
    {
      title: "Órdenes Abiertas",
      value: openOrders,
      description: "Aceptadas, Abiertas y Creadas",
      icon: <ChartBar className="h-5 w-5" />,
      color: "border-amber-400"
    },
    {
      title: "Órdenes Canceladas",
      value: cancelledOrders,
      description: "Canceladas y Anuladas",
      icon: <ChartBar className="h-5 w-5" />,
      color: "border-red-400"
    },
    {
      title: "Órdenes Cerradas",
      value: completedOrders,
      icon: <ChartBar className="h-5 w-5" />,
      color: "border-green-400"
    },
    {
      title: "Órdenes Pagadas",
      value: paidOrders,
      icon: <ChartBar className="h-5 w-5" />,
      color: "border-teal-400"
    },
    {
      title: "Órdenes Negadas",
      value: deniedOrders,
      icon: <ChartBar className="h-5 w-5" />,
      color: "border-gray-400"
    },
    {
      title: "Comisiones Estimadas",
      value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(estimatedCommission),
      description: "Basado en tasa del 30%",
      icon: <ChartPie className="h-5 w-5" />,
      color: "border-rose-400",
      tooltipText: "Comisiones estimadas basadas en una tasa fija del 30%"
    }
  ];

  const toggleCompact = () => {
    setIsCompact(!isCompact);
  };

  return (
    <div className={cn(className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Métricas de Ventas</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleCompact} 
          className="text-purple-700 border-purple-200 hover:bg-purple-50"
        >
          {isCompact ? "Ver Detallado" : "Ver Compacto"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {primaryMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {!isCompact && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {secondaryMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      )}
    </div>
  );
}
