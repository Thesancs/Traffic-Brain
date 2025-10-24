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
        "glass-card group flex flex-col gap-2 border-white/10 transition-all duration-500",
        highlight ? "border-accent/50 shadow-glass-hover" : "shadow-glass"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/70">
          {title}
        </CardTitle>
        {icon && <span className="text-accent drop-shadow-[0_0_8px_rgba(0,247,255,0.45)]">{icon}</span>}
      </CardHeader>
        <CardContent className="space-y-2">
          <div
            className={cn(
              "auto-scale-number font-headline font-semibold text-foreground",
              highlight && "text-accent neon-text"
            )}
          >
            {value}
          </div>
          {subtext && <p className="text-xs text-muted-foreground/80">{subtext}</p>}
        </CardContent>
    </Card>
  );
}
