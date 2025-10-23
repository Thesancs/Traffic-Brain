
"use client";

import { useEffect, useState } from "react";
import { DollarSign, MousePointerClick, TrendingUp, Target, Percent, ShoppingCart } from "lucide-react";
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { overviewKpis, performanceByDay, campaignPerformance } from "./data";
import { formatCurrency, formatNumber, formatDecimal } from "@/lib/formatters";
import { DashboardLoadingSkeleton } from "../meta/components/dashboard-loading-skeleton";
import { DashboardErrorState } from "../meta/components/dashboard-error-state";
import { DateRangePicker } from "../meta/components/date-range-picker";

export default function TiktokAdsPage() {
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
        return (
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-headline text-accent">Dashboard TikTok Ads</h1>
                        <p className="text-muted-foreground">Análise de performance das suas campanhas.</p>
                    </div>
                </div>
                <DashboardLoadingSkeleton />
            </div>
        )
    }
  
    if (error) {
      return <DashboardErrorState message={error} />;
    }

  return (
    <div className="text-foreground space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline text-accent">Dashboard TikTok Ads</h1>
            <p className="text-muted-foreground">Análise de performance das suas campanhas.</p>
        </div>
        <DateRangePicker />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <DashboardCard title="Custo" value={formatCurrency(overviewKpis.cost)} icon={<DollarSign />} />
        <DashboardCard title="CPM" value={formatCurrency(overviewKpis.cpm)} icon={<Target />} />
        <DashboardCard title="CTR" value={`${formatDecimal(overviewKpis.ctr)}%`} icon={<Percent />} />
        <DashboardCard title="Conversões" value={formatNumber(overviewKpis.conversions)} icon={<ShoppingCart />} />
        <DashboardCard title="CPA Médio" value={formatCurrency(overviewKpis.cpa)} icon={<MousePointerClick />} />
        <DashboardCard title="Faturamento" value={formatCurrency(overviewKpis.revenue)} icon={<TrendingUp />} />
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
        <CardHeader>
          <CardTitle className="font-headline text-accent">Desempenho por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceByDay}>
            <defs>
                <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
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
            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} />
            <Tooltip
                contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                }}
            />
            <Area yAxisId="left" type="monotone" dataKey="Custo" stroke="hsl(var(--chart-1))" fill="url(#colorCusto)" strokeWidth={2} />
            <Area yAxisId="left" type="monotone" dataKey="Faturamento" stroke="hsl(var(--chart-3))" fill="url(#colorFaturamento)" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="Custo" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-1)))'}} />
            <Line yAxisId="left" type="monotone" dataKey="Faturamento" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-3)))'}}/>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
        <CardHeader>
          <CardTitle className="font-headline text-accent">Desempenho das Campanhas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Cliques</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Conversões</TableHead>
                <TableHead>CPA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignPerformance.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{formatCurrency(campaign.cost)}</TableCell>
                  <TableCell>{formatNumber(campaign.clicks)}</TableCell>
                  <TableCell>{campaign.ctr}</TableCell>
                  <TableCell>{formatNumber(campaign.conversions)}</TableCell>
                  <TableCell>{campaign.cpa}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
