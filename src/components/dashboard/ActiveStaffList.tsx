
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ActiveStaffList() {
  // Sample staff data
  const activeStaff = [
    { 
      id: 1, 
      name: 'María González', 
      role: 'Chef', 
      avatarUrl: '', 
      initials: 'MG', 
      status: 'active',
      timeActive: '4h 20m'
    },
    { 
      id: 2, 
      name: 'Juan Pérez', 
      role: 'Mesero', 
      avatarUrl: '', 
      initials: 'JP', 
      status: 'active',
      timeActive: '2h 45m'
    },
    { 
      id: 3, 
      name: 'Ana López', 
      role: 'Barista', 
      avatarUrl: '', 
      initials: 'AL', 
      status: 'break',
      timeActive: '3h 10m'
    },
    { 
      id: 4, 
      name: 'Carlos Ruiz', 
      role: 'Cajero', 
      avatarUrl: '', 
      initials: 'CR', 
      status: 'active',
      timeActive: '1h 55m'
    },
  ];

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'break':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'offline':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Get avatar background color
  const getAvatarColor = (id: number) => {
    const colors = [
      'bg-purple-200 text-purple-800',
      'bg-blue-200 text-blue-800',
      'bg-emerald-200 text-emerald-800',
      'bg-amber-200 text-amber-800',
      'bg-rose-200 text-rose-800',
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="space-y-3">
      {activeStaff.map((staff) => (
        <div key={staff.id} className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className={`h-8 w-8 ${getAvatarColor(staff.id)}`}>
              <AvatarImage src={staff.avatarUrl} alt={staff.name} />
              <AvatarFallback>{staff.initials}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{staff.name}</p>
              <p className="text-xs text-gray-500">{staff.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{staff.timeActive}</span>
            <Badge variant="secondary" className={`text-xs ${getStatusColor(staff.status)}`}>
              {staff.status === 'active' ? 'Activo' : staff.status === 'break' ? 'Descanso' : 'Offline'}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
