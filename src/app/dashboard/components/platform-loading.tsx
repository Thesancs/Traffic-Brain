
"use client";

import { BrainCircuit, Loader } from "lucide-react";

export function PlatformLoading() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg text-accent" style={{ filter: 'drop-shadow(0 0 10px hsl(var(--accent)))' }}>
          <BrainCircuit className="size-8" />
        </div>
        <span className="text-3xl font-bold text-accent font-headline" style={{ filter: 'drop-shadow(0 0 10px hsl(var(--accent)))' }}>
            Traffic Brain
        </span>
      </div>
      <Loader className="mt-6 h-8 w-8 animate-spin text-accent" />
    </div>
  );
}
