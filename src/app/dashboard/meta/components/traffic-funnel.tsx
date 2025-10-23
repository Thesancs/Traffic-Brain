"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { funnelDataSets, FunnelStageData, FunnelType } from "../data";
import { formatCurrency, formatNumber, formatDecimal } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const FunnelStage = ({
  stage,
  value,
  index,
  total,
}: {
  stage: string;
  value: number;
  index: number;
  total: number;
}) => {
  const maxWidth = 100; // 100%
  const minWidth = 40; // 30%
  const width = maxWidth - ((maxWidth - minWidth) / (total - 1)) * index;

  return (
    <div className="relative h-16 flex items-center justify-center my-[-1px]">
      <div
        className="absolute inset-0 bg-accent/20 border border-accent/50"
        style={{
          width: `${width}%`,
          left: `${50 - width / 2}%`,
          clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)',
        }}
      ></div>
      <div className="relative z-10 text-center px-2">
        <p className="text-xs font-normal text-accent truncate">{stage}</p>
        <p className="text-lg md:text-xl font-bold font-headline">{formatNumber(value)}</p>
      </div>
    </div>
  );
};

const FunnelMetric = ({ label, value, change, isCurrency = true }: { label: string; value: number; change?: number, isCurrency?: boolean }) => (
    <div className="text-right">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg md:text-xl font-bold">{isCurrency ? formatCurrency(value) : formatDecimal(value)}</p>
        {change && (
            <p className={cn("text-xs", change > 0 ? 'text-green-400' : 'text-red-400')}>
                {change > 0 ? '▲' : '▼'} {change.toFixed(1)}%
            </p>
        )}
         {value === 0 && !change && <p className="text-xs text-muted-foreground">N/A</p>}
    </div>
);


const ConversionRate = ({ value }: { value: number }) => (
    <div className="relative h-16 flex items-center justify-center">
      <div className="absolute w-px h-full bg-border -z-10"></div>
      <span className="bg-background px-2 text-sm text-accent border border-accent/50 rounded-full">{value.toFixed(2)}%</span>
    </div>
  );

export function TrafficFunnel() {
  const [activeFunnel, setActiveFunnel] = useState<FunnelType>('Infoproduto');
  const funnelData = funnelDataSets[activeFunnel];

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="font-headline text-accent">Funil Geral</CardTitle>
        <Select value={activeFunnel} onValueChange={(value) => setActiveFunnel(value as FunnelType)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Selecione um funil" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(funnelDataSets).map(key => (
              <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 sm:gap-x-4 items-center">
           {/* Stages */}
           <div className="space-y-2">
            {funnelData.map((item, index) => (
              <FunnelStage key={item.stage} stage={item.stage} value={item.value} index={index} total={funnelData.length} />
            ))}
          </div>

          {/* Conversion Rates */}
          <div className="space-y-2">
            {funnelData.slice(0, -1).map((item, index) => {
                 const nextItem = funnelData[index + 1];
                 // Avoid division by zero if a stage has 0 value
                 if (!item.value || !nextItem.value) {
                    return <ConversionRate key={index} value={0} />;
                 }
                 const rate = item.value > 0 ? (nextItem.value / item.value) * 100 : 0;
                 return <ConversionRate key={index} value={rate} />;
            })}
          </div>

          {/* KPIs */}
          <div className="space-y-4">
             {funnelData.map((item, index) => (
                <FunnelMetric 
                    key={item.costLabel}
                    label={item.costLabel}
                    value={item.costValue}
                    change={item.costChange}
                    isCurrency={!['CPM', 'CTR'].includes(item.costLabel)}
                />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
