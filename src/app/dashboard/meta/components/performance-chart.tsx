"use client";

import { Area, AreaChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { weeklyPerformance } from "../data";

export function PerformanceChart() {
  return (
    <Card className="glass-card h-[450px] border-white/10 hover:shadow-glass-hover">
      <CardHeader>
        <CardTitle className="font-headline text-accent">Compras vs Gasto</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] pt-6">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyPerformance} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} tick={{fontSize: 12}} name="Gasto" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} tick={{fontSize: 12}} name="Compras" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="Gasto" stroke="hsl(var(--chart-1))" fill="url(#colorGasto)" strokeWidth={2} name="Gasto" />
                <Area yAxisId="right" type="monotone" dataKey="Compras" stroke="hsl(var(--chart-2))" fill="url(#colorCompras)" strokeWidth={2} name="Compras" />
                <Line yAxisId="left" type="monotone" dataKey="Gasto" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Gasto" style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-1)))'}} />
                <Line yAxisId="right" type="monotone" dataKey="Compras" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Compras" style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-2)))'}}/>
            </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
