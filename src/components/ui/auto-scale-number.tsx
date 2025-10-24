"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface AutoScaleNumberProps {
  value: string | number;
  className?: string;
}

const SCALE_EPSILON = 0.01;

export function AutoScaleNumber({ value, className }: AutoScaleNumberProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const displayValue = useMemo(() => String(value), [value]);

  useEffect(() => {
    const container = containerRef.current;
    const target = valueRef.current;
    if (!container || !target) return;

    const resize = () => {
      if (!container || !target) return;
      const containerWidth = container.offsetWidth;
      const textWidth = target.scrollWidth;
      if (containerWidth <= 0 || textWidth <= 0) {
        setScale(1);
        return;
      }
      const nextScale = Math.min(1, containerWidth / textWidth);
      setScale((current) => (Math.abs(current - nextScale) > SCALE_EPSILON ? nextScale : current));
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [displayValue]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-[2.75rem] w-full items-center justify-center overflow-hidden"
    >
      <div
        ref={valueRef}
        className={cn("auto-scale-number whitespace-nowrap transition-transform", className)}
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
      >
        {displayValue}
      </div>
    </div>
  );
}
