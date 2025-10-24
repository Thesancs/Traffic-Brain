
"use client";

import { BrainCircuit, Loader } from "lucide-react";

export function PlatformLoading() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="glass-panel flex w-full max-w-md flex-col items-center gap-6 p-8 text-center">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 text-accent shadow-neon-blue">
            <BrainCircuit className="h-7 w-7 animate-pulse-soft" />
          </div>
          <span className="text-2xl font-semibold text-foreground">Traffic Brain</span>
        </div>
        <p className="text-sm text-muted-foreground/80">
          Sincronizando dados de mídia em tempo real...
        </p>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        </div>
        <Loader className="h-6 w-6 animate-spin text-accent" />
      </div>
    </div>
  );
}
