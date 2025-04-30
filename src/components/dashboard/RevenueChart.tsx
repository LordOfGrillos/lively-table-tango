
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RevenueChartProps {
  period?: string;
}

export function RevenueChart({ period = 'today' }: RevenueChartProps) {
  // Different data based on period
  const getChartData = () => {
    switch (period) {
      case 'today':
        return [
          { name: '9 AM', income: 0, expense: 0 },
          { name: '10 AM', income: 120, expense: 80 },
          { name: '11 AM', income: 320, expense: 150 },
          { name: '12 PM', income: 580, expense: 230 },
          { name: '1 PM', income: 720, expense: 280 },
          { name: '2 PM', income: 400, expense: 180 },
          { name: '3 PM', income: 350, expense: 120 },
          { name: '4 PM', income: 450, expense: 150 },
          { name: '5 PM', income: 680, expense: 210 },
          { name: '6 PM', income: 890, expense: 320 },
          { name: '7 PM', income: 1050, expense: 380 },
          { name: '8 PM', income: 950, expense: 350 },
          { name: '9 PM', income: 780, expense: 290 },
          { name: '10 PM', income: 320, expense: 120 },
        ];
      case 'week':
        return [
          { name: 'Lun', income: 4500, expense: 1800 },
          { name: 'Mar', income: 3800, expense: 1500 },
          { name: 'Mié', income: 4200, expense: 1700 },
          { name: 'Jue', income: 5100, expense: 2100 },
          { name: 'Vie', income: 6500, expense: 2400 },
          { name: 'Sáb', income: 7800, expense: 2900 },
          { name: 'Dom', income: 6200, expense: 2300 },
        ];
      case 'month':
        return [
          { name: 'Sem 1', income: 28500, expense: 12000 },
          { name: 'Sem 2', income: 32100, expense: 13500 },
          { name: 'Sem 3', income: 34800, expense: 14200 },
          { name: 'Sem 4', income: 38200, expense: 15500 },
        ];
      default:
        return [
          { name: '9 AM', income: 0, expense: 0 },
          { name: '12 PM', income: 550, expense: 220 },
          { name: '3 PM', income: 320, expense: 130 },
          { name: '6 PM', income: 920, expense: 340 },
          { name: '9 PM', income: 750, expense: 280 },
        ];
    }
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={getChartData()}
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={{ stroke: "#e0e0e0" }} 
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <YAxis 
            tickLine={false} 
            axisLine={{ stroke: "#e0e0e0" }} 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value) => [`$${value}`, undefined]}
            contentStyle={{ 
              borderRadius: '6px', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb'
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2 }}
            name="Ingresos"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#94A3B8"
            strokeWidth={2}
            dot={{ fill: "#94A3B8", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#94A3B8", stroke: "#fff", strokeWidth: 2 }}
            name="Gastos"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
