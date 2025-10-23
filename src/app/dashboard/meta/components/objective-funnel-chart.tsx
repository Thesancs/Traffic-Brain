"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { funnelDataSets, FunnelType, FunnelStageData } from "../data";
import { formatNumber, formatCurrency } from "@/lib/formatters";
import { ArrowDown, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FunnelStage = ({ 
    stageData, 
    index, 
    totalStages,
    color
}: { 
    stageData: FunnelStageData, 
    index: number, 
    totalStages: number,
    color: string 
}) => {
    const isFirst = index === 0;
    const isLast = index === totalStages - 1;

    return (
        <div className="flex-1 flex flex-col items-center gap-2 min-w-[160px]">
             {/* Stage Box */}
            <div 
                className="relative w-full p-3 rounded-lg text-center shadow-md"
                style={{ backgroundColor: color, filter: `drop-shadow(0 0 5px ${color})` }}
            >
                <p className="text-sm font-semibold text-background truncate">{stageData.stage}</p>
                <p className="text-xl font-bold font-headline text-background">{formatNumber(stageData.value)}</p>
                 {/* Chevron arrow for all but the last item */}
                 {!isLast && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowDown className="w-8 h-8 text-muted-foreground" />
                    </div>
                )}
            </div>
           
            {/* Cost Metrics */}
            <div className="flex flex-col items-center text-center mt-2">
                <p className="text-xs text-muted-foreground">{stageData.costLabel}</p>
                <div className="flex items-center gap-2">
                    <p className="text-base font-semibold">{formatCurrency(stageData.costValue)}</p>
                    {stageData.costChange && (
                         <span className={cn(
                            "flex items-center text-xs font-bold",
                            stageData.costChange > 0 ? "text-red-400" : "text-green-400"
                        )}>
                           {stageData.costChange > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                           {Math.abs(stageData.costChange)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
};


export function ObjectiveFunnelChart() {
  const [activeFunnel, setActiveFunnel] = useState<FunnelType>('E-commerce');
  const funnelData = funnelDataSets[activeFunnel];
  const funnelOptions = Object.keys(funnelDataSets) as FunnelType[];

  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 col-span-1 md:col-span-4 lg:col-span-4 hover:shadow-neon-blue">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="font-headline text-accent">Funil de Conversão por Objetivo</CardTitle>
        <Select value={activeFunnel} onValueChange={(value) => setActiveFunnel(value as FunnelType)}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Selecione o Objetivo" />
          </SelectTrigger>
          <SelectContent>
            {funnelOptions.map(key => (
              <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex items-start justify-between gap-8 md:gap-4 p-4">
                {funnelData.map((item, index) => (
                    <FunnelStage
                    key={index}
                    stageData={item}
                    index={index}
                    totalStages={funnelData.length}
                    color={colors[index % colors.length]}
                    />
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
