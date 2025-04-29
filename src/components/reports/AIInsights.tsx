
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "./types";
import { Sparkles, TrendingUp, TrendingDown, CircleAlert, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightsProps {
  orders: Order[];
  className?: string;
}

interface InsightProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

function Insight({ title, description, icon, colorClass }: InsightProps) {
  return (
    <div className="flex items-start gap-3 border-b border-purple-100 pb-4 mb-4 last:mb-0 last:pb-0 last:border-b-0">
      <div className={cn("rounded-full p-2 shrink-0", colorClass)}>
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-800 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function AIInsights({ orders, className }: AIInsightsProps) {
  // In a real app, these insights would be generated based on actual data analysis
  // Here we're using dummy insights for demonstration purposes
  const insights: InsightProps[] = [
    {
      title: "Ventas en aumento",
      description: "Las ventas han aumentado un 12% en comparación con el mes anterior. Mantén tus promociones y estrategias de marketing actuales.",
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      colorClass: "bg-green-100"
    },
    {
      title: "Platos más populares",
      description: "Los platillos 'Pasta Carbonara' y 'Pizza Margherita' representan el 35% de todas las ventas. Considera destacarlos en tus promociones.",
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      colorClass: "bg-purple-100"
    },
    {
      title: "Horario de mayor demanda",
      description: "El pico de ventas se produce entre las 7:00 PM y 9:00 PM. Asegúrate de tener suficiente personal durante estas horas.",
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      colorClass: "bg-blue-100"
    },
    {
      title: "Oportunidad en delivery",
      description: "Las ventas por delivery han disminuido un 8%. Considera ofrecer promociones especiales para impulsar este canal.",
      icon: <TrendingDown className="h-5 w-5 text-amber-600" />,
      colorClass: "bg-amber-100"
    },
    {
      title: "Atención a cancelaciones",
      description: "Se ha notado un aumento del 5% en cancelaciones. Revisa los tiempos de entrega y la calidad del servicio.",
      icon: <CircleAlert className="h-5 w-5 text-red-600" />,
      colorClass: "bg-red-100"
    }
  ];

  return (
    <Card className={cn("shadow-sm border border-purple-100", className)}>
      <CardHeader className="pb-3 border-b border-purple-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
            AI Insights
          </CardTitle>
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Beta</span>
        </div>
      </CardHeader>
      <CardContent className="p-5 overflow-auto max-h-[500px]">
        <p className="text-sm text-gray-600 mb-5">
          Análisis inteligente de tus datos de ventas para ayudarte a tomar mejores decisiones de negocio.
        </p>
        
        <div className="space-y-0">
          {insights.map((insight, index) => (
            <Insight key={index} {...insight} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
