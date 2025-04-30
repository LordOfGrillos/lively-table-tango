
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentOrders() {
  // Sample recent orders data
  const recentOrders = [
    {
      id: 'ORD-1342',
      customer: { name: 'Juan Pérez', avatar: '', initials: 'JP' },
      items: [
        { name: 'Rib Eye Steak', quantity: 1 },
        { name: 'Ensalada César', quantity: 1 },
        { name: 'Agua Mineral', quantity: 2 }
      ],
      total: 78.50,
      status: 'completed',
      time: '12:45 PM',
      tableNumber: '12'
    },
    {
      id: 'ORD-1341',
      customer: { name: 'María García', avatar: '', initials: 'MG' },
      items: [
        { name: 'Pasta Carbonara', quantity: 2 },
        { name: 'Tiramisú', quantity: 1 }
      ],
      total: 42.75,
      status: 'in-progress',
      time: '12:30 PM',
      tableNumber: '08'
    },
    {
      id: 'ORD-1340',
      customer: { name: 'Carlos López', avatar: '', initials: 'CL' },
      items: [
        { name: 'Hamburguesa Gourmet', quantity: 1 },
        { name: 'Papas Fritas', quantity: 1 },
        { name: 'Refresco', quantity: 1 }
      ],
      total: 29.99,
      status: 'completed',
      time: '12:15 PM',
      tableNumber: '05'
    }
  ];

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completada</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">En Proceso</Badge>;
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Nueva</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {recentOrders.map((order) => (
        <div key={order.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                #{order.id}
              </div>
              <div className="text-xs text-gray-500">Mesa {order.tableNumber}</div>
            </div>
            <div className="text-xs text-gray-500">{order.time}</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 bg-blue-100 text-blue-800">
                <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                <AvatarFallback>{order.customer.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-700">{order.customer.name}</p>
                <p className="text-xs text-gray-500">
                  {order.items.length > 0
                    ? `${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1}` : ''}`
                    : 'No items'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-sm font-medium text-gray-800">
                ${order.total.toFixed(2)}
              </div>
              <div className="mt-1">
                {getStatusBadge(order.status)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
