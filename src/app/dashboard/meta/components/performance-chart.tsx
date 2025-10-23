"use client";

import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { weeklyPerformance } from "../data";

export function PerformanceChart() {
  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue h-full">
      <CardHeader>
        <CardTitle className="font-headline text-accent">Compras vs ROAS</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyPerformance} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <YAxis yAxisId="left" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="Compras" stroke="hsl(var(--chart-2))" fill="url(#colorCompras)" strokeWidth={2} name="Compras" />
                <Line yAxisId="right" type="monotone" dataKey="ROAS" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="ROAS" style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-1)))'}} />
            </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
