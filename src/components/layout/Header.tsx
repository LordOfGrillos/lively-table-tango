
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
  className?: string;
};

export function Header({ title, subtitle, actionButton, className }: HeaderProps) {
  return (
    <header className={cn("flex items-center justify-between py-4 px-6 border-b border-gray-100", className)}>
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      
      <div className="flex items-center space-x-4">
        {actionButton}
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <Avatar className="h-9 w-9 border border-gray-200">
            <AvatarFallback className="bg-app-purple text-white">A</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Cashier 1</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
