"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtext?: string;
  highlight?: boolean;
}

export function DashboardCard({ title, value, icon, subtext, highlight }: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 ease-in-out",
        "hover:shadow-neon-blue",
        highlight && "border-accent/30 shadow-neon-blue"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
          {title}
        </CardTitle>
        {icon && <span className="text-accent">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold font-headline", highlight && "text-accent")}>{value}</div>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </CardContent>
    </Card>
  );
}
