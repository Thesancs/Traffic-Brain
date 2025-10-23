"use client";

import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { weeklyPerformance } from "../data";

export function PerformanceChart() {
  return (
    <Card className="lg:col-span-2 bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
      <CardHeader>
        <CardTitle className="font-headline text-accent">Performance Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyPerformance}>
                <defs>
                    <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    }}
                />
                <Area yAxisId="left" type="monotone" dataKey="Gasto" stroke="hsl(var(--chart-1))" fill="url(#colorGasto)" strokeWidth={2} />
                <Area yAxisId="left" type="monotone" dataKey="Faturamento" stroke="hsl(var(--chart-3))" fill="url(#colorFaturamento)" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="Gasto" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-1)))'}} />
                <Line yAxisId="left" type="monotone" dataKey="Faturamento" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-3)))'}}/>
            </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
