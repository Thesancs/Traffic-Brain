"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DonutDatum = { name: string; value: number; fill: string };

export function DonutChartCard({
  title,
  description,
  data,
}: {
  title: string;
  description?: string;
  data: DonutDatum[];
}) {
  return (
    <Card className="glass-card overflow-hidden border-white/10 shadow-glass">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle className="font-headline text-lg text-foreground">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground/80">
              {description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-4 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-primary/15 blur-[120px]" />
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              startAngle={220}
              endAngle={-140}
              dataKey="value"
              nameKey="name"
              isAnimationActive
              animationDuration={900}
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}-${index}`}
                  fill={entry.fill}
                  className="transition-transform duration-300 hover:scale-[1.03]"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name) => [
                `${value.toFixed(1)}%`,
                name as string,
              ]}
              cursor={{ fill: "transparent" }}
              contentStyle={{
                background: "rgba(7, 16, 32, 0.85)",
                borderRadius: "0.75rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "hsl(var(--foreground))",
                backdropFilter: "blur(12px)",
                boxShadow: "0 24px 60px -30px rgba(15, 23, 42, 0.6)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {data.map((slice) => (
            <div
              key={slice.name}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm backdrop-blur-xl"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: slice.fill, boxShadow: `0 0 10px ${slice.fill}` }}
                />
                <span className="text-muted-foreground/80">{slice.name}</span>
              </div>
              <span className="font-semibold text-foreground">
                {slice.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
