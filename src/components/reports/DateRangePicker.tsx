
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, CalendarRange, Check } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DateRangePickerProps {
  dateRange: [Date | undefined, Date | undefined];
  onDateRangeChange: (range: [Date | undefined, Date | undefined]) => void;
  className?: string;
}

export function DateRangePicker({ dateRange, onDateRangeChange, className }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: dateRange[0],
    to: dateRange[1]
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (date?.from && date?.to) {
      onDateRangeChange([date.from, date.to]);
    }
  }, [date, onDateRangeChange]);

  // Predefined date ranges
  const presets = [
    {
      name: "Última semana",
      dates: [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date(),
      ] as [Date, Date],
    },
    {
      name: "Último mes",
      dates: [
        new Date(new Date().setMonth(new Date().getMonth() - 1)),
        new Date(),
      ] as [Date, Date],
    },
    {
      name: "Último trimestre",
      dates: [
        new Date(new Date().setMonth(new Date().getMonth() - 3)),
        new Date(),
      ] as [Date, Date],
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CalendarRange className="h-5 w-5 text-purple-600" />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-purple-200 hover:bg-purple-50 hover:border-purple-300",
              !date && "text-muted-foreground"
            )}
          >
            {date?.from && date?.to ? (
              <>
                <span className="font-medium text-gray-700">
                  {format(date.from, "dd MMM yyyy", { locale: es })} - {format(date.to, "dd MMM yyyy", { locale: es })}
                </span>
              </>
            ) : (
              <span>Selecciona un rango de fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="space-y-4">
              <div className="flex flex-col">
                <h4 className="font-medium text-sm text-purple-800 mb-2">Rangos predefinidos</h4>
                <div className="flex flex-col gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="justify-start text-left border-purple-100 hover:bg-purple-50 hover:border-purple-200"
                      onClick={() => {
                        setDate({
                          from: preset.dates[0],
                          to: preset.dates[1],
                        });
                        setIsOpen(false);
                      }}
                    >
                      <span>{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={1}
                locale={es}
                className="border rounded-md"
              />
              <div className="flex items-center justify-end gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 border-gray-200"
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
