"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DonutChartCard({ title, data }: { title: string; data: { name: string; value: number; fill: string }[] }) {
  return (
    <Card className="glass-card border-white/10 hover:shadow-glass-hover">
      <CardHeader>
        <CardTitle className="font-headline text-accent">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              innerRadius={70} 
              outerRadius={90}
              paddingAngle={5}
              cornerRadius={8}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} style={{filter: `drop-shadow(0 0 5px ${entry.fill})`}} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
