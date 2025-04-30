
import { Badge } from "@/components/ui/badge";

export function PopularItems() {
  // Sample popular dishes data
  const popularItems = [
    {
      id: 1,
      name: 'Rib Eye Steak',
      category: 'Carnes',
      orders: 45,
      rating: 4.8,
      trend: 'up',
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 2,
      name: 'Salmón al Grill',
      category: 'Mariscos',
      orders: 32,
      rating: 4.7,
      trend: 'up',
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 3,
      name: 'Tiramisú Clásico',
      category: 'Postres',
      orders: 28,
      rating: 4.9,
      trend: 'same',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
  ];

  return (
    <div className="space-y-4">
      {popularItems.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={item.image || "public/placeholder.svg"} 
              alt={item.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "public/placeholder.svg";
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                    {item.category}
                  </Badge>
                  <div className="flex items-center text-xs text-amber-500">
                    <span>★</span>
                    <span className="ml-1 text-gray-700">{item.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{item.orders}</p>
                <p className="text-xs text-gray-500">pedidos</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
