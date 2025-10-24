"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  DollarSign,
  Download,
  MousePointer2,
  Repeat,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import type { DateRange as PickerRange } from "react-day-picker";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
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
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangePicker } from "@/app/dashboard/meta/components/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DonutChartCard } from "@/app/dashboard/meta/components/donut-chart-card";
import {
  buildExportRows,
  ensureValidPlatforms,
  getDefaultSelections,
  getPlatformDefinitions,
  type PlatformDefinition,
  type AggregatedKpis,
  type DateRange,
  type DailyData,
  type PieSlice,
  type PlatformKey,
} from "./data";
import { MetaIcon, GoogleAdsIcon, TikTokIcon } from "@/components/icons/platforms";
import { exportKpiWorkbook } from "@/lib/exporters/kpi-export";
import { formatRelativeOrNever } from "@/lib/formatters/relative-time";

const platformIcons: Record<PlatformKey, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  meta: MetaIcon,
  google: GoogleAdsIcon,
  tiktok: TikTokIcon,
};

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
    maximumFractionDigits: 0,
  }).format(value);

const formatDecimal = (value: number, fractionDigits = 2) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(value);

const percentChange = (current: number, previous: number) => {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return 0;
  if (previous === 0) {
    if (current === 0) return 0;
    return current > 0 ? 100 : -100;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
};

const serializeRange = (range?: PickerRange): DateRange | undefined => {
  if (!range?.from && !range?.to) return undefined;
  return {
    from: range?.from,
    to: range?.to,
  };
};

type SyncMetadata = {
  syncedAt: string | null;
  source: "api" | "fallback";
};

type DashboardSnapshot = {
  kpis: AggregatedKpis;
  daily: DailyData[];
  distribution: PieSlice[];
  syncedAt: Record<PlatformKey, SyncMetadata>;
};

function KpiCards({ kpis }: { kpis: AggregatedKpis | null }) {
  if (!kpis) return null;
  const items = [
    {
      title: "Custo",
      value: formatCurrency(kpis.cost),
      icon: <DollarSign />,
    },
    {
      title: "CPM",
      value: formatCurrency(kpis.cpm),
      icon: <Sparkles />,
    },
    {
      title: "CTR",
      value: `${formatDecimal(kpis.ctr, 2)}%`,
      icon: <MousePointer2 />,
    },
    {
      title: "Conversões",
      value: formatNumber(kpis.conversions),
      icon: <Target />,
    },
    {
      title: "CPA Médio",
      value: formatCurrency(kpis.cpa),
      icon: <Repeat />,
    },
    {
      title: "Faturamento",
      value: formatCurrency(kpis.revenue),
      icon: <TrendingUp />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {items.map((item) => (
        <DashboardCard key={item.title} title={item.title} value={item.value} icon={item.icon} />
      ))}
    </div>
  );
}

function ComparativeChart({ data }: { data: DailyData[] }) {
  if (data.length === 0) return null;

  const latest = data.at(-1);
  const previous = data.at(-2) ?? latest;

  const insights = latest && previous
    ? [
        {
          label: "Receita diária",
          value: formatCurrency(latest.revenue),
          change: percentChange(latest.revenue, previous.revenue),
        },
        {
          label: "Investimento diário",
          value: formatCurrency(latest.spend),
          change: percentChange(latest.spend, previous.spend),
        },
        {
          label: "Conversões",
          value: formatNumber(latest.conversions),
          change: percentChange(latest.conversions, previous.conversions),
        },
      ]
    : [];

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
          Atualização em tempo real
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <ResponsiveAreaChart data={data} />
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
                  <span className="text-lg font-semibold text-foreground">{insight.value}</span>
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
                    {formatDelta(insight.change)}
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

function ResponsiveAreaChart({ data }: { data: DailyData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        accessibilityLayer
        data={data.map((item) => ({
          ...item,
          label: new Date(item.date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
        }))}
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
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          yAxisId="left"
          stroke="hsl(var(--chart-1))"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${formatDecimal(Number(value) / 1000, 1)}k`}
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
          strokeWidth={2}
        />
        <Area
          yAxisId="left"
          type="natural"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          fill="url(#colorRevenue)"
          strokeWidth={2}
        />
        <Area
          yAxisId="right"
          type="natural"
          dataKey="conversions"
          stroke="var(--color-conversions)"
          fill="url(#colorConversions)"
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
  );
}

function formatDelta(value: number) {
  const rounded = formatDecimal(Math.abs(value), 2);
  if (value > 0) return `+${rounded}%`;
  if (value < 0) return `-${rounded}%`;
  return `${rounded}%`;
}

const DashboardLoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {[...Array(6)].map((_, i) => (
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

const PlatformToggle = ({
  platform,
  definition,
  active,
  onToggle,
}: {
  platform: PlatformKey;
  definition: PlatformDefinition;
  active: boolean;
  onToggle: (platform: PlatformKey) => void;
}) => {
  const Icon = platformIcons[platform];
  
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      onClick={() => onToggle(platform)}
      className={cn(
        "flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium transition-all",
        active
          ? "shadow-[0_0_20px_rgba(59,130,246,0.35)]"
          : "hover:bg-white/20"
      )}
    >
      <Icon className="h-5 w-5 drop-shadow-[0_0_6px_rgba(0,0,0,0.25)]" />
      {definition.label}
    </Button>
  );
};

const BusinessManagerSelector = ({
  platform,
  definition,
  value,
  onChange,
}: {
  platform: PlatformKey;
  definition: PlatformDefinition;
  value: string;
  onChange: (platform: PlatformKey, value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
      <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
        {definition.label}
      </div>
      <Select value={value} onValueChange={(next) => onChange(platform, next)}>
        <SelectTrigger className="glass-input border-white/10">
          <SelectValue placeholder="Selecione um BM" />
        </SelectTrigger>
        <SelectContent className="glass-panel border-white/10">
          {definition.businessManagers.map((manager) => (
            <SelectItem key={manager.id} value={manager.id}>
              {manager.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default function DashboardPage() {
  const [definitions, setDefinitions] = useState<Record<PlatformKey, PlatformDefinition>>(
    getPlatformDefinitions()
  );
  const [activePlatforms, setActivePlatforms] = useState<PlatformKey[]>(() =>
    ensureValidPlatforms(Object.keys(getPlatformDefinitions()) as PlatformKey[])
  );
  const [selectedManagers, setSelectedManagers] = useState<Record<PlatformKey, string>>(
    getDefaultSelections()
  );
  const [range, setRange] = useState<PickerRange | undefined>({
    from: new Date(2024, 8, 26),
    to: new Date(2024, 9, 9),
  });
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadDefinitions = async () => {
      try {
        const response = await fetch("/api/dashboard/platforms", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Não foi possível carregar as plataformas conectadas.");
        }
        const payload = (await response.json()) as Record<PlatformKey, PlatformDefinition>;
        setDefinitions(payload);
        setSelectedManagers((current) => {
          const next = {} as Record<PlatformKey, string>;
          const entries = Object.entries(payload) as [PlatformKey, PlatformDefinition][];
          entries.forEach(([platform, definition]) => {
            const candidates = definition.businessManagers;
            if (!candidates.length) {
              next[platform] = "";
              return;
            }
            const existing = current[platform];
            const fallback = candidates[0]?.id ?? "";
            next[platform] = candidates.some((manager) => manager.id === existing)
              ? existing
              : fallback;
          });
          return next;
        });
        setActivePlatforms((current) => {
          const available = Object.keys(payload) as PlatformKey[];
          const filtered = current.filter((platform) => available.includes(platform)) as PlatformKey[];
          const basis = filtered.length ? filtered : available;
          return basis.length ? ensureValidPlatforms(basis) : [];
        });
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Erro ao carregar definições de plataforma", err);
      }
    };

    loadDefinitions();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const validPlatforms: PlatformKey[] = ensureValidPlatforms(activePlatforms);

    const fetchSnapshot = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/dashboard/kpis", {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platforms: validPlatforms,
            selections: selectedManagers,
            range: {
              from: range?.from?.toISOString() ?? null,
              to: range?.to?.toISOString() ?? null,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar os dados consolidados.");
        }

        const data = (await response.json()) as DashboardSnapshot;
        setSnapshot(data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Erro ao buscar KPIs consolidados", err);
        setError(err.message ?? "Erro inesperado ao carregar o dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshot();

    return () => controller.abort();
  }, [activePlatforms, selectedManagers, range?.from, range?.to]);

  const aggregatedKpis = useMemo(() => snapshot?.kpis ?? null, [snapshot]);
  const chartData = useMemo(() => snapshot?.daily ?? [], [snapshot]);
  const distribution = useMemo(() => snapshot?.distribution ?? [], [snapshot]);
  const syncMetadata = useMemo(
    () => snapshot?.syncedAt ?? ({} as Record<PlatformKey, SyncMetadata>),
    [snapshot]
  );

  const lastSyncLabel = useMemo(() => {
    const platformsToConsider = ensureValidPlatforms(activePlatforms);
    const timestamps = platformsToConsider
      .map((platform) => syncMetadata[platform]?.syncedAt)
      .filter((value): value is string => Boolean(value));

    if (timestamps.length === 0) {
      return "Sincronização pendente";
    }

    const latest = timestamps.reduce((acc, current) => (acc > current ? acc : current));
    return `Última sync ${formatRelativeOrNever(latest)}`;
  }, [activePlatforms, syncMetadata]);

  const handleTogglePlatform = (platform: PlatformKey) => {
    setActivePlatforms((current) => {
      const next: PlatformKey[] = current.includes(platform)
        ? (current.filter((item) => item !== platform) as PlatformKey[])
        : ([...current, platform] as PlatformKey[]);
      return ensureValidPlatforms(next);
    });
  };

  const handleManagerChange = (platform: PlatformKey, managerId: string) => {
    setSelectedManagers((current) => ({
      ...current,
      [platform]: managerId,
    }));
  };

  const handleApplyRange = (next?: PickerRange) => {
    setRange(next);
  };

  const handleExport = async () => {
    const validPlatforms: PlatformKey[] = ensureValidPlatforms(activePlatforms);
    const rows = buildExportRows(validPlatforms, selectedManagers, serializeRange(range));
    await exportKpiWorkbook(rows);
  };

  if (loading && !snapshot) {
    return <DashboardLoadingSkeleton />;
  }

  if (error) {
    return <DashboardErrorState message={error} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
            Painel unificado
          </span>
          <h1 className="text-3xl font-bold font-headline text-foreground">
            KPIs de Tráfego Pago Consolidado
          </h1>
          <p className="text-sm text-muted-foreground">
            Combine Meta, Google e TikTok em um único cockpit com dados sincronizados em tempo real.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
            {lastSyncLabel}
          </span>
          <Button
            variant="outline"
            className="glass-button border-white/10"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" /> Exportar Planilha
          </Button>
          <DateRangePicker
            value={range}
            onApply={handleApplyRange}
            onChange={handleApplyRange}
          />
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {(Object.entries(definitions) as [PlatformKey, PlatformDefinition][]).map(
            ([platform, definition]) => (
              <PlatformToggle
                key={platform}
                platform={platform}
                definition={definition}
                active={activePlatforms.includes(platform)}
                onToggle={handleTogglePlatform}
              />
            )
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activePlatforms.map((platform) => {
            const definition = definitions[platform];
            if (!definition) return null;
            return (
              <BusinessManagerSelector
                key={platform}
                platform={platform}
                definition={definition}
                value={selectedManagers[platform]}
                onChange={handleManagerChange}
              />
            );
          })}
        </div>
      </section>

      <KpiCards kpis={aggregatedKpis} />

      <ComparativeChart data={chartData} />

      {distribution.length > 0 && (
        <DonutChartCard
          title="Distribuição de Investimento por Objetivo"
          data={distribution}
        />
      )}
    </div>
  );
}
