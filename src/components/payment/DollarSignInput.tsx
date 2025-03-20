
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DollarSignInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function DollarSignInput({
  value,
  onChange,
  placeholder,
  className,
  autoFocus = false
}: DollarSignInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const newValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = newValue.split('.');
    const formattedValue = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : newValue;
    
    onChange(formattedValue);
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</div>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder || "0.00"}
        className={cn("pl-8", className)}
        autoFocus={autoFocus}
      />
    </div>
  );
}
