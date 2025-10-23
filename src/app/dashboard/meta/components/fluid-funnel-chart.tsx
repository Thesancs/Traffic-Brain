"use client";

import { Info } from "lucide-react";
import { ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { conversionFunnelData } from "../data";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export const FluidFunnelChart = () => {
    const data = conversionFunnelData;
    const maxValue = Math.max(...data.map(d => d.value));
  
    const getPathD = (data: { stage: string; value: number }[], width: number, height: number): string => {
        if (data.length === 0) return "";
      
        const points = data.map((d, i) => {
            const stageValue = d.value > 0 ? d.value : 0;
            const proportion = maxValue > 0 ? stageValue / maxValue : 0;
            const y = (proportion * (height / 2) * 0.9) + (height * 0.05); // Use 90% of half-height for curve, 5% margin
            return {
                x: (i / (data.length - 1)) * width,
                y0: height / 2 - y,
                y1: height / 2 + y,
            };
        });
      
        let path = `M ${points[0].x},${points[0].y0}`;
      
        // Top curve
        for (let i = 0; i < points.length - 1; i++) {
          const start = points[i];
          const end = points[i+1];
          const cp1x = start.x + (end.x - start.x) / 2;
          const cp1y = start.y0;
          const cp2x = start.x + (end.x - start.x) / 2;
          const cp2y = end.y0;
          path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${end.x},${end.y0}`;
        }
      
        // Line down to the bottom right
        path += ` L ${points[points.length - 1].x},${points[points.length - 1].y1}`;
      
        // Bottom curve (reversed)
        for (let i = points.length - 1; i > 0; i--) {
          const start = points[i];
          const end = points[i - 1];
          const cp1x = start.x - (start.x - end.x) / 2;
          const cp1y = start.y1;
          const cp2x = start.x - (start.x - end.x) / 2;
          const cp2y = end.y1;
          path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${end.x},${end.y1}`;
        }
        path += " Z"; // Close the path
      
        return path;
      };
  
  
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
        <CardHeader className="flex flex-row items-center justify-between">
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
        <CardContent className="h-[250px] p-0">
          <ResponsiveContainer width="100%" height="100%">
            <div className="relative w-full h-full p-6 flex flex-col">
              {/* Stage Labels */}
              <div className="flex justify-around items-start">
                {data.map((item, index) => (
                  <div key={index} className="flex-1 text-center">
                    <h3 className="text-sm md:text-base text-blue-200">{item.stage}</h3>
                  </div>
                ))}
              </div>
  
              {/* Fluid SVG and Percentages */}
              <div className="relative flex-1 w-full flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 800 150" preserveAspectRatio="none" className="absolute top-0 left-0 drop-shadow-[0_0_10px_#00F7FF66]">
                   <defs>
                      <linearGradient id="funnelGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                        <stop offset="50%" stopColor="hsl(var(--chart-2))" />
                        <stop offset="100%" stopColor="#FF00AA" />
                      </linearGradient>
                    </defs>
                  <path d={getPathD(data, 800, 150)} fill="url(#funnelGradient)" />
                </svg>
  
                {/* Percentages overlay */}
                <div className="w-full h-full flex justify-around items-center">
                   {data.map((item, index) => (
                    <div key={index} className="z-10 flex-1 text-center">
                      <p className="text-white font-semibold text-lg md:text-xl font-headline">
                        {index === 0 ? '100.0%' : ((item.value / data[index-1].value) * 100).toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Values */}
              <div className="flex justify-around items-end">
                {data.map((item, index) => (
                   <div key={index} className="flex-1 text-center">
                    <p className="text-sm md:text-base text-blue-200">{formatNumber(item.value)}</p>
                   </div>
                ))}
              </div>
  
              {/* Vertical separators */}
              <div className="absolute top-1/2 left-0 w-full h-px" style={{ transform: 'translateY(-50%)' }}>
                <div className="flex justify-around h-full">
                  {data.slice(0, -1).map((_, index) => (
                    <div key={index} className={cn("w-px bg-blue-300/20 h-full", index === 0 && 'ml-[20%]')}></div>
                  ))}
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };
