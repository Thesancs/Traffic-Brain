
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { videoRetentionDataSets, VideoCreativeType } from "../data";
import { Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";

const FunnelStage = ({
  stage,
  value,
  isFirst,
  isLast,
  color,
}: {
  stage: string;
  value: number;
  isFirst: boolean;
  isLast: boolean;
  color: string;
}) => {
  const clipPath = {
    first: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)",
    middle: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)",
    last: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%)",
  };

  let path;
  if (isFirst) path = clipPath.first;
  else if (isLast) path = clipPath.last;
  else path = clipPath.middle;

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div
        className={cn(
          "text-background font-bold text-xs flex items-center justify-center px-4 h-8",
          !isFirst && "-ml-4"
        )}
        style={{ 
            clipPath: path, 
            width: "140px", 
            backgroundColor: color,
            filter: `drop-shadow(0 0 4px ${color})`
        }}
      >
        {stage}
      </div>
      <span className="mt-2 text-sm font-semibold font-headline text-foreground">{value.toFixed(2)}%</span>
    </div>
  );
};

export function VideoRetentionFunnel() {
  const [activeCreative, setActiveCreative] = useState<VideoCreativeType>('Criativo 1');
  const creativeData = videoRetentionDataSets[activeCreative];
  const creativeOptions = Object.keys(videoRetentionDataSets) as VideoCreativeType[];

  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];

  return (
    <Card className="glass-card border-white/10 hover:shadow-glass-hover">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clapperboard className="w-6 h-6 text-accent" />
          <CardTitle className="font-headline text-accent">Funil de Vídeo</CardTitle>
        </div>
        <Select value={activeCreative} onValueChange={(value) => setActiveCreative(value as VideoCreativeType)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Selecione um criativo" />
          </SelectTrigger>
          <SelectContent>
            {creativeOptions.map(key => (
              <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-center p-4 gap-2 overflow-x-auto">
          {creativeData.map((item, index) => (
            <FunnelStage
              key={item.stage}
              stage={item.stage}
              value={item.value}
              isFirst={index === 0}
              isLast={index === creativeData.length - 1}
              color={colors[index % colors.length]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
