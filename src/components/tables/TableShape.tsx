
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export type TableStatus = 'available' | 'reserved' | 'filled' | 'occupied';

export type TableProps = {
  id: string;
  number: string;
  status: TableStatus;
  capacity: number;
  shape: 'round' | 'rectangular';
  timer?: number; // Time in minutes
  selected?: boolean;
  onClick?: (id: string) => void;
  className?: string;
};

// Helper function to get status-based styling
const getStatusStyle = (status: TableStatus) => {
  switch (status) {
    case 'available':
      return {
        bg: 'bg-table-available',
        text: 'text-green-800',
        badge: 'bg-green-100 text-green-800',
      };
    case 'reserved':
      return {
        bg: 'bg-table-reserved',
        text: 'text-red-800',
        badge: 'bg-red-100 text-red-800',
      };
    case 'filled':
      return {
        bg: 'bg-table-filled',
        text: 'text-gray-800',
        badge: 'bg-gray-200 text-gray-800',
      };
    case 'occupied':
      return {
        bg: 'bg-table-occupied',
        text: 'text-amber-800',
        badge: 'bg-amber-100 text-amber-800',
      };
  }
};

// Format time display
const formatTimer = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
};

export function TableShape({
  id,
  number,
  status,
  capacity,
  shape,
  timer,
  selected = false,
  onClick,
  className,
}: TableProps) {
  const [isHovered, setIsHovered] = useState(false);
  const statusStyle = getStatusStyle(status);
  
  return (
    <div
      className={cn(
        "table-shape flex flex-col items-center justify-center cursor-pointer",
        shape === 'round' ? "table-round" : "table-rectangular",
        statusStyle.bg,
        selected && "ring-2 ring-app-purple table-selected",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(id)}
    >
      <span className="font-medium">{number}</span>
      
      {/* Show capacity only on hover or if table is not empty */}
      {(isHovered || status !== 'available') && (
        <span className="text-xs mt-1">{capacity} Seats</span>
      )}
      
      {timer && (
        <div className={cn(
          "timer-badge px-2 py-0.5 rounded-full text-xs font-medium flex items-center",
          statusStyle.badge
        )}>
          <Clock className="h-3 w-3 mr-1" />
          {formatTimer(timer)}
        </div>
      )}
    </div>
  );
}
