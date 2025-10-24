"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { formatNumber, formatDecimal } from "@/lib/formatters";
import { kpis, sessionsByDevice, trafficByChannel, topPages, performanceOverTime } from "./data";
import { Users, Clock, BarChart, TrendingDown } from "lucide-react";
import { DashboardLoadingSkeleton } from "../../meta/components/dashboard-loading-skeleton";
import { DashboardErrorState } from "../../meta/components/dashboard-error-state";
import { DateRangePicker } from "../../meta/components/date-range-picker";
import { PieChartCard } from "../../meta/components/pie-chart-card";

const KpiCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard title="Usuários" value={formatNumber(kpis.users)} icon={<Users />} />
        <DashboardCard title="Sessões" value={formatNumber(kpis.sessions)} icon={<BarChart />} />
        <DashboardCard title="Taxa de Rejeição" value={`${formatDecimal(kpis.bounceRate)}%`} icon={<TrendingDown />} />
        <DashboardCard title="Duração da Sessão" value={kpis.sessionDuration} icon={<Clock />} />
    </div>
);

const PerformanceChart = () => (
    <Card className="glass-card border-white/10 hover:shadow-glass-hover">
        <CardHeader>
            <CardTitle className="font-headline text-accent">Usuários e Sessões</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceOverTime}>
                    <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                        }}
                    />
                    <Area type="monotone" dataKey="Usuários" stroke="hsl(var(--chart-1))" fill="url(#colorUsers)" />
                    <Area type="monotone" dataKey="Sessões" stroke="hsl(var(--chart-2))" fill="url(#colorSessions)" />
                </AreaChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

const TopPagesTable = () => (
    <Card className="glass-card border-white/10 hover:shadow-glass-hover">
        <CardHeader>
            <CardTitle className="font-headline text-accent">Páginas Mais Acessadas</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Página</TableHead>
                        <TableHead>Visualizações</TableHead>
                        <TableHead>Tempo Médio</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topPages.map((page, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{page.path}</TableCell>
                            <TableCell>{formatNumber(page.views)}</TableCell>
                            <TableCell>{page.avgTime}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default function GoogleAnalyticsPage() {
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
    <div className="text-foreground space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-accent">Google Analytics</h1>
          <p className="text-muted-foreground">Análise de performance do seu tráfego.</p>
        </div>
        <DateRangePicker />
      </div>

      <KpiCards />
      <PerformanceChart />
      
      <div className="grid lg:grid-cols-2 gap-8">
        <PieChartCard title="Sessões por Dispositivo" data={sessionsByDevice} />
        <PieChartCard title="Sessões por Canal" data={trafficByChannel} />
      </div>

      <TopPagesTable />
    </div>
  );
}
