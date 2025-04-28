
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
}

export function DateRangeSelector({ startDate, endDate, onDateChange }: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false);

  // Preset date ranges
  const handlePresetChange = (preset: string) => {
    const now = new Date();
    let start = new Date();
    
    switch (preset) {
      case "today":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        onDateChange(start, now);
        break;
      case "yesterday": {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
        const end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
        onDateChange(start, end);
        break;
      }
      case "week":
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        onDateChange(start, now);
        break;
      case "month":
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        onDateChange(start, now);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Tabs defaultValue="today" onValueChange={handlePresetChange} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="today">Hoy</TabsTrigger>
          <TabsTrigger value="yesterday">Ayer</TabsTrigger>
          <TabsTrigger value="week">Última Semana</TabsTrigger>
          <TabsTrigger value="month">Último Mes</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate && endDate ? (
                <>
                  {format(startDate, "PPP", { locale: es })} - {format(endDate, "PPP", { locale: es })}
                </>
              ) : (
                <span>Seleccione rango de fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={startDate}
              selected={{
                from: startDate,
                to: endDate,
              }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onDateChange(range.from, range.to);
                }
              }}
              numberOfMonths={2}
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
