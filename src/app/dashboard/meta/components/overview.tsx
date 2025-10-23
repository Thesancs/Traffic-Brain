"use client";

import { useEffect, useState } from "react";
import { DollarSign, Activity, Eye, TrendingUp, Users, ShoppingBag } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { overviewKpis, weeklyPerformance, adSpendDistribution } from "../data";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { TrafficFunnel } from "./traffic-funnel";
import { FluidFunnelChart } from "./fluid-funnel-chart";
import { CampaignSummaryTable } from "./campaign-summary-table";
import { DashboardLoadingSkeleton } from "./dashboard-loading-skeleton";
import { DashboardErrorState } from "./dashboard-error-state";

export default function Overview() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                // Simulate successful data loading
            } catch (e: any) {
                setError(e.message || "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <DashboardLoadingSkeleton />;
    }

    if (error) {
        return <DashboardErrorState message={error} />;
    }
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <DashboardCard title="Gastos" value={formatCurrency(overviewKpis.gastos)} icon={<DollarSign />} />
        <DashboardCard title="Campanhas Ativas" value={formatNumber(overviewKpis.campanhasAtivas)} icon={<Activity />} />
        <DashboardCard title="Impressões" value={formatNumber(overviewKpis.impressoes)} icon={<Eye />} />
        <DashboardCard title="Receita Estimada" value={formatCurrency(overviewKpis.receitaEstimada)} icon={<TrendingUp />} />
        <DashboardCard title="Leads" value={formatNumber(overviewKpis.leads)} icon={<Users />} />
        <DashboardCard title="Checkouts" value={formatNumber(overviewKpis.checkouts)} icon={<ShoppingBag />} />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <TrafficFunnel />
        <FluidFunnelChart />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
          <CardHeader>
            <CardTitle className="font-headline text-accent">Gasto, Leads e Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Line yAxisId="left" type="monotone" dataKey="Gasto" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="Leads" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="Receita" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1 bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
            <CardHeader>
                <CardTitle className="font-headline text-accent">Distribuição de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={adSpendDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {adSpendDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    </Pie>
                    <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                    />
                </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
        <CardHeader>
          <CardTitle className="font-headline text-accent">Resumo das Campanhas</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignSummaryTable />
        </CardContent>
      </Card>
    </div>
  );
}
