
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

interface TopCategoriesProps {
  period?: string;
}

export function TopCategories({ period = 'today' }: TopCategoriesProps) {
  // Different data based on period
  const getChartData = () => {
    switch (period) {
      case 'today':
        return [
          { name: 'Carnes', value: 32 },
          { name: 'Mariscos', value: 24 },
          { name: 'Postres', value: 18 },
          { name: 'Bebidas', value: 15 },
          { name: 'Pastas', value: 11 },
        ];
      case 'week':
        return [
          { name: 'Carnes', value: 38 },
          { name: 'Mariscos', value: 26 },
          { name: 'Postres', value: 16 },
          { name: 'Bebidas', value: 12 },
          { name: 'Pastas', value: 8 },
        ];
      case 'month':
        return [
          { name: 'Carnes', value: 35 },
          { name: 'Mariscos', value: 30 },
          { name: 'Postres', value: 15 },
          { name: 'Bebidas', value: 12 },
          { name: 'Pastas', value: 8 },
        ];
      default:
        return [
          { name: 'Carnes', value: 32 },
          { name: 'Mariscos', value: 24 },
          { name: 'Postres', value: 18 },
          { name: 'Bebidas', value: 15 },
          { name: 'Pastas', value: 11 },
        ];
    }
  };

  const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

  const data = getChartData();

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={75}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}%`, name]}
            contentStyle={{
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span style={{ fontSize: '10px', color: '#6b7280' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
