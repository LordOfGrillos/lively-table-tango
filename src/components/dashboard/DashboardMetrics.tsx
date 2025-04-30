
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, UtensilsCrossed, Users, TrendingUp } from "lucide-react";

interface DashboardMetricsProps {
  period?: string;
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon,
  color
}: { 
  title: string; 
  value: string; 
  change: { value: number; positive: boolean };
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <Card className={`border-l-4 ${color} shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-xs ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
              {change.positive ? '↑' : '↓'} {change.value}% vs periodo anterior
            </p>
          </div>
          <div className={`rounded-full p-2 ${color.replace('border', 'bg').replace('-4', '-100')} ${color.replace('border', 'text').replace('-4', '-600')}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function DashboardMetrics({ period = 'today' }: DashboardMetricsProps) {
  // Simulate different data based on period
  const metricsData = {
    today: {
      totalSales: { value: '$4,582', change: { value: 8.5, positive: true } },
      totalOrders: { value: '145', change: { value: 5.2, positive: true } },
      averageTicket: { value: '$31.60', change: { value: 3.8, positive: true } },
      activeCustomers: { value: '28', change: { value: 2.5, positive: false } }
    },
    yesterday: {
      totalSales: { value: '$3,921', change: { value: 1.2, positive: false } },
      totalOrders: { value: '132', change: { value: 3.1, positive: false } },
      averageTicket: { value: '$29.70', change: { value: 1.8, positive: true } },
      activeCustomers: { value: '24', change: { value: 4.0, positive: false } }
    },
    week: {
      totalSales: { value: '$32,457', change: { value: 12.5, positive: true } },
      totalOrders: { value: '956', change: { value: 8.7, positive: true } },
      averageTicket: { value: '$33.95', change: { value: 4.2, positive: true } },
      activeCustomers: { value: '185', change: { value: 6.8, positive: true } }
    },
    month: {
      totalSales: { value: '$125,860', change: { value: 15.3, positive: true } },
      totalOrders: { value: '3,642', change: { value: 10.1, positive: true } },
      averageTicket: { value: '$34.55', change: { value: 5.2, positive: true } },
      activeCustomers: { value: '420', change: { value: 8.9, positive: true } }
    },
  };

  const currentMetrics = metricsData[period as keyof typeof metricsData] || metricsData.today;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Ventas Totales"
        value={currentMetrics.totalSales.value}
        change={currentMetrics.totalSales.change}
        icon={<CreditCard className="h-6 w-6" />}
        color="border-emerald-400"
      />
      <MetricCard
        title="Total de Órdenes"
        value={currentMetrics.totalOrders.value}
        change={currentMetrics.totalOrders.change}
        icon={<UtensilsCrossed className="h-6 w-6" />}
        color="border-blue-400"
      />
      <MetricCard
        title="Ticket Promedio"
        value={currentMetrics.averageTicket.value}
        change={currentMetrics.averageTicket.change}
        icon={<TrendingUp className="h-6 w-6" />}
        color="border-purple-400"
      />
      <MetricCard
        title="Clientes Activos"
        value={currentMetrics.activeCustomers.value}
        change={currentMetrics.activeCustomers.change}
        icon={<Users className="h-6 w-6" />}
        color="border-amber-400"
      />
    </div>
  );
}
