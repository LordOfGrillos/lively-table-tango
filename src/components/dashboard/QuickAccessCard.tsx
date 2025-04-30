
import React from "react";
import { Link } from "react-router-dom";

interface QuickAccessCardProps {
  title: string;
  icon: React.ReactNode;
  path: string;
  color?: string;
}

export function QuickAccessCard({ title, icon, path, color = "bg-purple-100 text-purple-600" }: QuickAccessCardProps) {
  return (
    <Link to={path} className="block">
      <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:border-purple-300 hover:shadow-sm transition-all">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div className="font-medium text-gray-800 text-sm">
          {title}
        </div>
      </div>
    </Link>
  );
}
