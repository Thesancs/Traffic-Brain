
"use client";

import { Info } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { infoproductFunnelData, FunnelStageData } from "../data";
import { formatCurrency, formatNumber, formatDecimal } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const FunnelMetric = ({ label, value, change, isCurrency = true }: { label: string; value: number; change?: number; isCurrency?: boolean }) => (
  <div className="space-y-1 text-center">
    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-blue-200/70">{label}</p>
    <p className="text-xs font-semibold text-blue-50">
      {isCurrency ? formatCurrency(value) : formatDecimal(value)}
    </p>
    {typeof change === 'number' && (
      <p className={cn("text-[0.65rem] font-medium", change >= 0 ? "text-emerald-400" : "text-rose-400")}>{`${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}%`}</p>
    )}
  </div>
);

export const FluidFunnelChart = () => {
    const data: FunnelStageData[] = infoproductFunnelData;
    const maxValue = Math.max(...data.map((d) => d.value));

    const viewBox = { width: 1000, height: 220 };

    const pathDefinition = useMemo(() => {
        if (data.length === 0 || maxValue === 0) return "";

        const points = data.map((stage, index) => {
            const proportion = stage.value / maxValue;
            const horizontalStep = viewBox.width / Math.max(data.length - 1, 1);
            const x = index * horizontalStep;
            const curveRadius = (proportion * (viewBox.height / 2)) * 0.85 + viewBox.height * 0.08;
            return {
                x,
                topY: viewBox.height / 2 - curveRadius,
                bottomY: viewBox.height / 2 + curveRadius,
            };
        });

        let path = `M ${points[0].x},${points[0].topY}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            const midX = current.x + (next.x - current.x) / 2;
            path += ` C ${midX},${current.topY} ${midX},${next.topY} ${next.x},${next.topY}`;
        }

        path += ` L ${points[points.length - 1].x},${points[points.length - 1].bottomY}`;

        for (let i = points.length - 1; i > 0; i--) {
            const current = points[i];
            const next = points[i - 1];
            const midX = current.x - (current.x - next.x) / 2;
            path += ` C ${midX},${current.bottomY} ${midX},${next.bottomY} ${next.x},${next.bottomY}`;
        }

        path += " Z";
        return path;
    }, [data, maxValue, viewBox.height, viewBox.width]);


    return (
      <Card className="glass-card border-white/10 hover:shadow-glass-hover">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-headline text-accent">Funil de Conversão (Meta Ads)</CardTitle>
          <TooltipProvider>
            <UiTooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Este funil mostra a jornada do usuário desde o primeiro clique.</p>
              </TooltipContent>
            </UiTooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="p-0">
            <div className="relative flex w-full flex-col gap-6 overflow-x-auto px-4 pb-6 pt-4 sm:px-6">
              <div className="flex min-w-full justify-between gap-3 text-center">
                {data.map((item: FunnelStageData, index: number) => (
                  <div key={`${item.stage}-${index}`} className="flex min-w-[120px] flex-1 flex-col items-center gap-1">
                    <h3 className="text-[0.7rem] font-medium text-blue-100/90 sm:text-xs md:text-sm">{item.stage}</h3>
                    <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-blue-200/80">
                      {index === 0 ? 'Top' : `Etapa ${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative flex min-h-[160px] min-w-full items-center justify-center">
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
                  preserveAspectRatio="none"
                  className="absolute inset-0 drop-shadow-[0_0_12px_rgba(0,247,255,0.35)]"
                >
                  <defs>
                    <linearGradient id="funnelGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                      <stop offset="50%" stopColor="hsl(var(--chart-2))" />
                      <stop offset="100%" stopColor="hsl(var(--chart-5))" />
                    </linearGradient>
                  </defs>
                  <path d={pathDefinition} fill="url(#funnelGradient)" opacity={0.9} />
                  <path d={pathDefinition} fill="url(#funnelGradient)" opacity={0.45} transform="scale(0.97 0.95) translate(15 6)" />
                </svg>

                <div className="relative flex w-full justify-between gap-3 px-2 text-center">
                  {data.map((item: FunnelStageData, index: number) => {
                    const previousValue = data[index - 1]?.value ?? 0;
                    const retention = index === 0 || previousValue === 0 ? 1 : item.value / previousValue;
                    return (
                      <div key={`${item.stage}-${index}-percentage`} className="flex min-w-[120px] flex-1 flex-col items-center">
                        <p className="font-headline text-base font-semibold text-white md:text-lg">
                          {(retention * 100).toFixed(1).replace('.', ',')}%
                        </p>
                        <p className="text-[0.7rem] text-blue-100/80 sm:text-xs">retenção</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex min-w-full justify-between gap-3 text-center">
                {data.map((item: FunnelStageData, index: number) => (
                  <div key={`${item.stage}-${index}-value`} className="flex min-w-[120px] flex-1 flex-col items-center gap-1">
                    <p className="text-sm font-semibold text-blue-100 sm:text-base">{formatNumber(item.value)}</p>
                    <FunnelMetric label={item.costLabel} value={item.costValue} change={item.costChange} isCurrency={!['CPM', 'CTR'].includes(item.costLabel)} />
                  </div>
                ))}
              </div>
            </div>
        </CardContent>
      </Card>
    );
  };
