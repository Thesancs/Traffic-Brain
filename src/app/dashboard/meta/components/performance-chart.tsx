"use client";

import { Area, AreaChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { weeklyPerformance } from "../data";
import { formatCurrency, formatNumber, formatDecimal } from "@/lib/formatters";

const metricsLegend = [
  { dataKey: "Gasto", label: "Investimento", color: "hsl(var(--chart-1))" },
  { dataKey: "Faturamento", label: "Receita", color: "hsl(var(--chart-3))" },
  { dataKey: "Compras", label: "Compras", color: "hsl(var(--chart-2))" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0]?.payload ?? {};
  const spend = point.Gasto;
  const revenue = point.Faturamento;
  const purchases = point.Compras;
  const roas = point.ROAS;

  return (
    <div className="rounded-xl border border-white/10 bg-background/90 p-3 text-xs shadow-lg backdrop-blur">
      <p className="mb-2 font-semibold text-foreground/80">{label}</p>
      <div className="space-y-1 text-muted-foreground">
        {spend !== undefined && <p className="flex justify-between gap-8"><span>Investimento</span><span className="font-medium text-foreground">{formatCurrency(spend)}</span></p>}
        {revenue !== undefined && <p className="flex justify-between gap-8"><span>Receita</span><span className="font-medium text-foreground">{formatCurrency(revenue)}</span></p>}
        {purchases !== undefined && <p className="flex justify-between gap-8"><span>Compras</span><span className="font-medium text-foreground">{formatNumber(purchases)}</span></p>}
        {roas !== undefined && <p className="flex justify-between gap-8"><span>ROAS</span><span className="font-medium text-foreground">{formatDecimal(roas)}</span></p>}
      </div>
    </div>
  );
};

export function PerformanceChart() {
  return (
    <Card className="glass-card min-h-[320px] border-white/10 hover:shadow-glass-hover md:min-h-[420px]">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="font-headline text-accent">Performance Consolidada</CardTitle>
          <p className="text-xs text-muted-foreground">Investimento, receita e conversões ao longo do período</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {metricsLegend.map((metric) => (
            <span key={metric.dataKey} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 font-medium text-foreground/80">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: metric.color }} />
              {metric.label}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="h-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyPerformance} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradient-spend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradient-revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="hsl(var(--border)/0.4)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={60} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={50} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--border)/0.4)", strokeDasharray: "3 3" }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="Gasto"
              name="Gasto"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#gradient-spend)"
              activeDot={{ r: 4 }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="Faturamento"
              name="Faturamento"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              fill="url(#gradient-revenue)"
              activeDot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Compras"
              name="Compras"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2, fill: "hsl(var(--background))" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
