
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
}: {
  stage: string;
  value: number;
  isFirst: boolean;
  isLast: boolean;
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
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "bg-yellow-400 text-black font-bold text-xs flex items-center justify-center px-4 h-8",
          !isFirst && "-ml-4"
        )}
        style={{ clipPath: path, width: "100px" }}
      >
        {stage}
      </div>
      <span className="mt-2 text-sm text-foreground">{value.toFixed(2)}%</span>
    </div>
  );
};

export function VideoRetentionFunnel() {
  const [activeCreative, setActiveCreative] = useState<VideoCreativeType>('Criativo 1');
  const creativeData = videoRetentionDataSets[activeCreative];
  const creativeOptions = Object.keys(videoRetentionDataSets) as VideoCreativeType[];

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Clapperboard className="w-6 h-6 text-accent" />
          <CardTitle className="font-headline text-accent">Funil de Vídeo</CardTitle>
        </div>
        <Select value={activeCreative} onValueChange={(value) => setActiveCreative(value as VideoCreativeType)}>
          <SelectTrigger className="w-[180px]">
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
        <div className="flex items-start justify-center p-4 gap-0">
          {creativeData.map((item, index) => (
            <FunnelStage
              key={item.stage}
              stage={item.stage}
              value={item.value}
              isFirst={index === 0}
              isLast={index === creativeData.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}