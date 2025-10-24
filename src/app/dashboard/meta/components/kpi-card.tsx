"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  chartData?: Record<string, any>[];
  chartDataKey?: string;
  chartColor?: string;
  tooltipFormatter?: (value: number) => string;
}

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value as number;
      const formattedValue = formatter ? formatter(value) : value;
      return (
        <div className="p-2 bg-background/80 backdrop-blur-sm border border-white/10 rounded-lg text-xs">
          <p className="font-semibold text-foreground/80">{label}</p>
          <p className="text-muted-foreground">{formattedValue}</p>
        </div>
      );
    }

    return null;
  };

export function KpiCard({ title, value, change, chartData = [], chartDataKey = "value", chartColor, tooltipFormatter }: KpiCardProps) {
  const isPositive = change.startsWith('+');
  const hasChartData = Array.isArray(chartData) && chartData.length > 0 && chartColor;
  const gradientId = `kpi-spark-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <Card className="glass-card w-full border-white/10 hover:shadow-glass-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/70">{title}</CardTitle>
        <div className={cn("flex items-center text-xs font-bold", isPositive ? "text-emerald-400" : "text-rose-400")}>
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {change}
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <div className="auto-scale-number-sm font-headline font-bold text-foreground">{value}</div>
        <div className="w-24 h-12 -mb-4 -mr-2">
            {hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.5} />
                            <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} cursor={false} />
                    <Area type="monotone" dataKey={chartDataKey} stroke={chartColor} fill={`url(#${gradientId})`} strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-lg border border-white/10 bg-white/5" />
            )}
        </div>
      </CardContent>
    </Card>
  );
}
