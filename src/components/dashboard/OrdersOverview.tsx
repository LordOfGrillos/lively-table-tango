
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OrdersOverviewProps {
  period?: string;
}

export function OrdersOverview({ period = 'today' }: OrdersOverviewProps) {
  // Different data based on period
  const getChartData = () => {
    switch (period) {
      case 'today':
        return [
          { name: '9 AM', orders: 5 },
          { name: '10 AM', orders: 8 },
          { name: '11 AM', orders: 12 },
          { name: '12 PM', orders: 18 },
          { name: '1 PM', orders: 22 },
          { name: '2 PM', orders: 15 },
          { name: '3 PM', orders: 10 },
          { name: '4 PM', orders: 12 },
          { name: '5 PM', orders: 16 },
          { name: '6 PM', orders: 24 },
          { name: '7 PM', orders: 28 },
          { name: '8 PM', orders: 25 },
          { name: '9 PM', orders: 18 },
          { name: '10 PM', orders: 8 },
        ];
      case 'week':
        return [
          { name: 'Lun', orders: 85 },
          { name: 'Mar', orders: 78 },
          { name: 'Mié', orders: 92 },
          { name: 'Jue', orders: 105 },
          { name: 'Vie', orders: 140 },
          { name: 'Sáb', orders: 168 },
          { name: 'Dom', orders: 132 },
        ];
      case 'month':
        return [
          { name: 'Sem 1', orders: 580 },
          { name: 'Sem 2', orders: 620 },
          { name: 'Sem 3', orders: 680 },
          { name: 'Sem 4', orders: 720 },
        ];
      default:
        return [
          { name: 'Lun', orders: 0 },
          { name: 'Mar', orders: 0 },
          { name: 'Mié', orders: 0 },
          { name: 'Jue', orders: 0 },
          { name: 'Vie', orders: 0 },
          { name: 'Sáb', orders: 0 },
          { name: 'Dom', orders: 0 },
        ];
    }
  };

  const data = getChartData();
  const maxValue = Math.max(...data.map(item => item.orders)) * 1.2;

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={{ stroke: "#e0e0e0" }} 
            tick={{ fill: "#6b7280", fontSize: 10 }}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: "#6b7280", fontSize: 10 }}
            domain={[0, maxValue]}
          />
          <Tooltip 
            formatter={(value) => [`${value} órdenes`, "Órdenes"]}
            contentStyle={{ 
              borderRadius: '6px', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb'
            }}
          />
          <Bar 
            dataKey="orders" 
            fill="#E5DEFF" 
            radius={[4, 4, 0, 0]}
            activeBar={{ fill: "#8B5CF6" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
