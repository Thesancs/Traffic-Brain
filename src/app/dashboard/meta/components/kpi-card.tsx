"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  chartData: any[];
  chartDataKey: string;
  chartColor: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background/80 backdrop-blur-sm border rounded-lg text-xs">
          <p>{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
  
    return null;
  };

export function KpiCard({ title, value, change, chartData, chartDataKey, chartColor }: KpiCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("flex items-center text-xs font-bold", isPositive ? "text-green-400" : "text-red-400")}>
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {change}
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <div className="text-3xl font-bold font-headline">{value}</div>
        <div className="w-24 h-12 -mb-4 -mr-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`color-${chartDataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Area type="monotone" dataKey={chartDataKey} stroke={chartColor} fill={`url(#color-${chartDataKey})`} strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
