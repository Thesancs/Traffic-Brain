"use client";

import {
  AlertCircle,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  UserCheck,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { DateRangePicker } from "@/app/dashboard/meta/components/date-range-picker";
import { cn } from "@/lib/utils";
import { calculateKpis, KpiData, mockChartData, DailyData } from "./data";

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "hsl(var(--chart-3))",
  },
  spend: {
    label: "Gasto",
    color: "hsl(var(--chart-1))",
  },
  conversions: {
    label: "Conversões",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR").format(value);

const formatDecimal = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatPercentChange = (value: number) => {
  if (!Number.isFinite(value)) return "0,00%";
  const abs = Math.abs(value);
  const formatted = formatDecimal(abs);
  if (value > 0) return `+${formatted}%`;
  if (value < 0) return `-${formatted}%`;
  return `${formatted}%`;
};

const safeDivide = (numerator: number, denominator: number) =>
  denominator === 0 ? 0 : numerator / denominator;

const trendDelta = (current: number, previous: number) => {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return 0;
  if (previous === 0) {
    if (current === 0) return 0;
    return current > 0 ? 100 : -100;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
};

function KpiCards({ kpis }: { kpis: KpiData }) {
  const kpiList = [
    {
      title: "Investimento Total",
      value: kpis.totalInvestment,
      icon: <DollarSign />,
      format: "currency",
    },
    {
      title: "Leads Gerados",
      value: kpis.totalLeads,
      icon: <Users />,
      format: "number",
    },
    {
      title: "Receita Estimada",
      value: kpis.estimatedRevenue,
      icon: <TrendingUp />,
      format: "currency",
    },
    {
      title: "ROAS Médio",
      value: kpis.averageRoas,
      icon: <Target />,
      format: "decimal",
      highlight: true,
    },
    {
      title: "Custo por Lead",
      value: kpis.cpl,
      icon: <UserCheck />,
      format: "currency",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {kpiList.map((kpi) => (
        <DashboardCard
          key={kpi.title}
          title={kpi.title}
          value={
            kpi.format === "currency"
              ? formatCurrency(kpi.value)
              : kpi.format === "decimal"
                ? formatDecimal(kpi.value)
                : formatNumber(kpi.value)
          }
          icon={kpi.icon}
          highlight={kpi.highlight}
        />
      ))}
    </div>
  );
}

function ComparativeChart({ data }: { data: DailyData[] }) {
  const latest = data.at(-1);
  const previous = data.at(-2) ?? latest;

  const insights = latest && previous ? [
    {
      label: "Receita diária",
      value: formatCurrency(latest.revenue),
      change: trendDelta(latest.revenue, previous.revenue),
    },
    {
      label: "Investimento diário",
      value: formatCurrency(latest.spend),
      change: trendDelta(latest.spend, previous.spend),
    },
    {
      label: "Conversões",
      value: formatNumber(latest.conversions),
      change: trendDelta(latest.conversions, previous.conversions),
    },
  ] : [];

  return (
    <Card className="glass-card shadow-glass-hover">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
            Performance consolidada
          </span>
          <CardTitle className="font-headline text-2xl text-foreground">
            Desempenho Geral
          </CardTitle>
        </div>
        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-muted-foreground/70">
          Intervalo automático
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-spend)" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="var(--color-spend)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-conversions)" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="var(--color-conversions)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.35)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => value.slice(0, 6)}
              />
              <YAxis
                yAxisId="left"
                stroke="hsl(var(--chart-1))"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `R$${Number(value) / 1000}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--chart-2))"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
                contentStyle={{
                  backgroundColor: "rgba(12, 16, 32, 0.85)",
                  borderColor: "hsl(var(--border) / 0.4)",
                  backdropFilter: "blur(12px)",
                }}
              />
              <Area
                yAxisId="left"
                type="natural"
                dataKey="spend"
                stroke="var(--color-spend)"
                fill="url(#colorSpend)"
                stackId="1"
                strokeWidth={2}
              />
              <Area
                yAxisId="left"
                type="natural"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="url(#colorRevenue)"
                stackId="1"
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="natural"
                dataKey="conversions"
                stroke="var(--color-conversions)"
                fill="url(#colorConversions)"
                stackId="2"
                strokeWidth={2}
              />
              <Line
                dataKey="spend"
                type="natural"
                stroke="var(--color-spend)"
                strokeWidth={2}
                dot={false}
                yAxisId="left"
                style={{ filter: "drop-shadow(0 0 4px hsl(var(--chart-1)))" }}
              />
              <Line
                dataKey="revenue"
                type="natural"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
                yAxisId="left"
                style={{ filter: "drop-shadow(0 0 4px hsl(var(--chart-3)))" }}
              />
              <Line
                dataKey="conversions"
                type="natural"
                stroke="var(--color-conversions)"
                strokeWidth={2}
                dot={false}
                yAxisId="right"
                style={{ filter: "drop-shadow(0 0 4px hsl(var(--chart-2)))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        {insights.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            {insights.map((insight) => (
              <div
                key={insight.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/60">
                  {insight.label}
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <span className="text-lg font-semibold text-foreground">
                    {insight.value}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      insight.change > 0
                        ? "text-emerald-400"
                        : insight.change < 0
                          ? "text-rose-400"
                          : "text-muted-foreground/70"
                    )}
                  >
                    {formatPercentChange(insight.change)}
                  </span>
                </div>
                <span className="text-[0.65rem] text-muted-foreground/60">vs dia anterior</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const DashboardLoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="glass-card border-white/10">
          <CardHeader>
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="glass-card border-white/10">
      <CardHeader>
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[260px] w-full" />
      </CardContent>
    </Card>
  </div>
);

const DashboardErrorState = ({ message }: { message: string }) => (
  <Alert className="glass-panel border-destructive/40 bg-destructive/15 text-destructive-foreground">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Erro ao carregar o dashboard</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    chartData: DailyData[];
    kpiData: KpiData;
  } | null>(null);

  useEffect(() => {
    console.log("[Dashboard]", "Iniciando simulação de fetch de dados.");
    const timer = setTimeout(() => {
      try {
        const kpis = calculateKpis(mockChartData);
        setData({ chartData: mockChartData, kpiData: kpis });
        console.log("[Dashboard]", "Dados carregados com sucesso.");
      } catch (e: any) {
        console.error("[Dashboard]", "Erro simulado ao carregar dados:", e.message);
        setError(e.message || "Ocorreu um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const highlightMetrics = useMemo(() => {
    if (!data) return [] as Array<{ label: string; value: string; change: number; suffix?: string }>;
    const latest = data.chartData.at(-1);
    const previous = data.chartData.at(-2) ?? latest;
    if (!latest || !previous) return [] as Array<{ label: string; value: string; change: number; suffix?: string }>;

    const roasCurrent = safeDivide(latest.revenue, latest.spend);
    const roasPrevious = safeDivide(previous.revenue, previous.spend);

    return [
      {
        label: "Receita diária",
        value: formatCurrency(latest.revenue),
        change: trendDelta(latest.revenue, previous.revenue),
      },
      {
        label: "Investimento diário",
        value: formatCurrency(latest.spend),
        change: trendDelta(latest.spend, previous.spend),
      },
      {
        label: "Conversões",
        value: formatNumber(latest.conversions),
        change: trendDelta(latest.conversions, previous.conversions),
      },
      {
        label: "ROAS do dia",
        value: formatDecimal(roasCurrent),
        change: trendDelta(roasCurrent, roasPrevious),
        suffix: "x",
      },
    ];
  }, [data]);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  if (error || !data) {
    return <DashboardErrorState message={error || "Não foi possível exibir os dados."} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="glass-card overflow-hidden px-6 py-8 shadow-glass">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/70">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Inteligência de mídia
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-headline font-semibold text-foreground md:text-4xl">
                Performance unificada dos canais
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground/80">
                Acompanhe investimento, receita e conversões com uma visão centralizada e acionável em tempo real.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <DateRangePicker className="w-full sm:w-auto" />
            <Button
              variant="outline"
              className="rounded-full border-white/20 bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground hover:bg-white/20"
            >
              Criar alerta
            </Button>
          </div>
        </div>
        {highlightMetrics.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlightMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/60">
                  {metric.label}
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <span className="text-lg font-semibold text-foreground">
                    {metric.value}
                    {metric.suffix ?? ""}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      metric.change > 0
                        ? "text-emerald-400"
                        : metric.change < 0
                          ? "text-rose-400"
                          : "text-muted-foreground/70"
                    )}
                  >
                    {formatPercentChange(metric.change)}
                  </span>
                </div>
                <span className="text-[0.65rem] text-muted-foreground/60">vs dia anterior</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <KpiCards kpis={data.kpiData} />
      <ComparativeChart data={data.chartData} />
    </div>
  );
}
