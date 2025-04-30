
import React from "react";

interface OrderTypesProps {
  period?: string;
}

interface OrderTypeData {
  type: string;
  percentage: number;
  value: number;
  icon: JSX.Element;
  color: string;
}

export function OrderTypes({ period = 'today' }: OrderTypesProps) {
  // Different data based on period
  const getOrderTypeData = (): OrderTypeData[] => {
    switch (period) {
      case 'today':
        return [
          { 
            type: 'Dine-In', 
            percentage: 45, 
            value: 65,
            icon: <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-700">D</span>
                  </div>,
            color: 'bg-purple-500'
          },
          { 
            type: 'Takeaway', 
            percentage: 30, 
            value: 44,
            icon: <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-emerald-700">T</span>
                  </div>,
            color: 'bg-emerald-500'
          },
          { 
            type: 'Delivery', 
            percentage: 25, 
            value: 36,
            icon: <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-amber-700">D</span>
                  </div>,
            color: 'bg-amber-500'
          },
        ];
      case 'week':
        return [
          { 
            type: 'Dine-In', 
            percentage: 48, 
            value: 384,
            icon: <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-700">D</span>
                  </div>,
            color: 'bg-purple-500'
          },
          { 
            type: 'Takeaway', 
            percentage: 28, 
            value: 224,
            icon: <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-emerald-700">T</span>
                  </div>,
            color: 'bg-emerald-500'
          },
          { 
            type: 'Delivery', 
            percentage: 24, 
            value: 192,
            icon: <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-amber-700">D</span>
                  </div>,
            color: 'bg-amber-500'
          },
        ];
      case 'month':
        return [
          { 
            type: 'Dine-In', 
            percentage: 50, 
            value: 1600,
            icon: <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-700">D</span>
                  </div>,
            color: 'bg-purple-500'
          },
          { 
            type: 'Takeaway', 
            percentage: 25, 
            value: 800,
            icon: <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-emerald-700">T</span>
                  </div>,
            color: 'bg-emerald-500'
          },
          { 
            type: 'Delivery', 
            percentage: 25, 
            value: 800,
            icon: <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-amber-700">D</span>
                  </div>,
            color: 'bg-amber-500'
          },
        ];
      default:
        return [
          { 
            type: 'Dine-In', 
            percentage: 45, 
            value: 65,
            icon: <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-700">D</span>
                  </div>,
            color: 'bg-purple-500'
          },
          { 
            type: 'Takeaway', 
            percentage: 30, 
            value: 44,
            icon: <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-emerald-700">T</span>
                  </div>,
            color: 'bg-emerald-500'
          },
          { 
            type: 'Delivery', 
            percentage: 25, 
            value: 36,
            icon: <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-amber-700">D</span>
                  </div>,
            color: 'bg-amber-500'
          },
        ];
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        {getOrderTypeData().map((item, index) => (
          <div key={index} className="flex items-center">
            {item.icon}
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{item.type}</span>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`${item.color} h-2 rounded-full`} 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-gray-500 text-right">{item.value} órdenes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
