"use client";

import {
  AlertCircle,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  UserCheck,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateKpis, KpiData, mockChartData, DailyData } from "./data";
import { DashboardCard } from "@/components/ui/dashboard-card";


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
      highlight: true
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
          value={kpi.format === 'currency' ? formatCurrency(kpi.value) : kpi.format === 'decimal' ? formatDecimal(kpi.value) : formatNumber(kpi.value)}
          icon={kpi.icon}
          highlight={kpi.highlight}
        />
      ))}
    </div>
  );
}

function ComparativeChart({ data }: { data: DailyData[] }) {
  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_#00F7FF99]">
      <CardHeader>
        <CardTitle className="font-headline text-accent">Desempenho Geral</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 6)}
              />
               <YAxis
                yAxisId="left"
                stroke="hsl(var(--chart-1))"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={value => `$${Number(value) / 1000}k`}
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
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
              />
              <Line
                dataKey="spend"
                type="natural"
                stroke="var(--color-spend)"
                strokeWidth={2}
                dot={false}
                yAxisId="left"
              />
              <Line
                dataKey="revenue"
                type="natural"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
                yAxisId="left"
              />
              <Line
                dataKey="conversions"
                type="natural"
                stroke="var(--color-conversions)"
                strokeWidth={2}
                dot={false}
                yAxisId="right"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const DashboardLoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/30">
          <CardHeader>
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="w-1/2 h-8" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="bg-card/60 backdrop-blur-sm border-border/30">
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  </div>
);

const DashboardErrorState = ({ message }: { message: string }) => (
  <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
    <AlertCircle className="w-4 h-4" />
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
        // To simulate an error, you could throw an error here randomly
        // if (Math.random() > 0.8) throw new Error("Falha na rede simulada");

        const kpis = calculateKpis(mockChartData);
        setData({ chartData: mockChartData, kpiData: kpis });
        console.log("[Dashboard]", "Dados carregados com sucesso.");
      } catch (e: any) {
        console.error("[Dashboard]", "Erro simulado ao carregar dados:", e.message);
        setError(e.message || "Ocorreu um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  if (error || !data) {
    return <DashboardErrorState message={error || "Não foi possível exibir os dados."} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <KpiCards kpis={data.kpiData} />
      <ComparativeChart data={data.chartData} />
    </div>
  );
}
