
import { useInventory } from "../InventoryContext";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function CategoryBreakdown() {
  const { categories, items } = useInventory();
  
  // Prepare data for the pie chart
  const data = categories.map(category => {
    const categoryItems = items.filter(item => item.category === category.name);
    const value = categoryItems.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);
    
    return {
      name: category.name,
      value: parseFloat(value.toFixed(2)),
      itemCount: category.itemCount
    };
  });
  
  // Colors for the pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Category Breakdown</h3>
      
      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="py-6 text-center text-gray-500">
          <p>No category data available</p>
        </div>
      )}
      
      <div className="mt-4 space-y-2">
        {data.map((category, index) => (
          <div key={category.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="h-3 w-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{category.itemCount} items</span>
              <span className="text-sm font-medium">${category.value}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
