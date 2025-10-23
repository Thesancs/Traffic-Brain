"use client";

import { useEffect, useState } from "react";
import { DollarSign, Activity, Eye, TrendingUp, Users, ShoppingBag } from "lucide-react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { overviewKpis, weeklyPerformance, adSpendDistribution } from "../data";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { TrafficFunnel } from "./traffic-funnel";
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
        <DashboardCard title="Faturamento" value={formatCurrency(overviewKpis.receitaEstimada)} icon={<TrendingUp />} />
        <DashboardCard title="Leads" value={formatNumber(overviewKpis.leads)} icon={<Users />} />
        <DashboardCard title="Checkouts" value={formatNumber(overviewKpis.checkouts)} icon={<ShoppingBag />} />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <TrafficFunnel />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
          <CardHeader>
            <CardTitle className="font-headline text-accent">Gastos e Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyPerformance}>
                <defs>
                  <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} domain={[0, 100000]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="Gasto" stroke="hsl(var(--chart-1))" fill="url(#colorGasto)" strokeWidth={2} />
                <Area yAxisId="left" type="monotone" dataKey="Faturamento" stroke="hsl(var(--chart-3))" fill="url(#colorFaturamento)" strokeWidth={2} />
                 <Line yAxisId="left" type="monotone" dataKey="Gasto" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-1)))'}} />
                <Line yAxisId="left" type="monotone" dataKey="Faturamento" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-3)))'}}/>
              </AreaChart>
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
                  <Pie 
                    data={adSpendDistribution} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70}
                    outerRadius={90} 
                    paddingAngle={5}
                    cornerRadius={8}
                    label
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {adSpendDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} style={{filter: `drop-shadow(0 0 5px ${entry.fill})`}} />
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
