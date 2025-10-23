"use client";

import { useEffect, useState } from "react";
import { DollarSign, Eye, TrendingUp, Users, ShoppingBag, Target, ArrowDown, ArrowRight, BarChart, Download, Filter, Search, Clapperboard, ChevronDown } from "lucide-react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "./components/date-range-picker";
import { overviewKpis, weeklyPerformance, adSpendDistribution, campaignSummary, detailedMetrics } from "./data";
import { formatCurrency, formatNumber, formatDecimal } from "@/lib/formatters";
import { DashboardLoadingSkeleton } from "./components/dashboard-loading-skeleton";
import { DashboardErrorState } from "./components/dashboard-error-state";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// KPI Card Mini Chart
const KpiChart = ({ data, dataKey, color }: { data: any[], dataKey: string, color: string }) => (
  <div className="h-10 w-full">
    <ResponsiveContainer>
      <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#color-${dataKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// Enhanced KPI Card
const KpiCard = ({ title, value, change, chartData, chartDataKey, chartColor }: { title: string, value: string, change: string, chartData: any[], chartDataKey: string, chartColor: string }) => {
  const isPositive = change.startsWith('+');
  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-headline">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{change}</div>
        <KpiChart data={chartData} dataKey={chartDataKey} color={chartColor} />
      </CardContent>
    </Card>
  );
};

// Funil de Tráfego
const TrafficFunnel = () => (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-between">
        <CardHeader>
            <CardTitle className="font-headline text-accent">Funil de Tráfego</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-sm relative">
                {/* Funnel visual */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                    <div className="w-full h-full" style={{ perspective: '300px' }}>
                        <div className="w-full h-full bg-gradient-to-b from-accent/20 to-accent/5" style={{ transform: 'rotateX(50deg)', transformOrigin: 'top center' }} />
                    </div>
                    <div className="absolute -top-1 left-0 w-full h-2 rounded-full bg-accent/50 opacity-50" />
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[102%] h-2 rounded-full bg-accent opacity-80" />
                </div>
                
                {/* Funnel Stages */}
                <div className="relative z-10 space-y-4 text-center text-white p-4">
                    {overviewKpis.funnel.map((stage, i) => (
                        <div key={stage.name} className="flex justify-around items-center w-full" style={{paddingLeft: `${i*10}%`, paddingRight: `${i*10}%`}}>
                            <div className="w-full">
                                <p className="font-bold text-lg">{formatNumber(stage.value)}</p>
                                <p className="text-xs text-muted-foreground">{stage.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
         <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                    <p className="text-muted-foreground">Add to Cart</p>
                    <p className="font-bold">{formatNumber(0)}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Frequência</p>
                    <p className="font-bold">{formatDecimal(2.98)}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">CPM</p>
                    <p className="font-bold">{formatCurrency(21.81)}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

// Donut Chart
const DonutChartCard = ({ title, data }: { title: string, data: { name: string, value: number, fill: string }[] }) => (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30">
        <CardHeader>
            <CardTitle className="font-headline text-accent">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} cornerRadius={8}>
                        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

// Line Chart Card
const PerformanceChart = () => (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 col-span-1 md:col-span-2 lg:col-span-2">
        <CardHeader>
            <CardTitle className="font-headline text-accent">Faturamento vs Compras</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] pr-8">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="hsl(var(--chart-3))" tickLine={false} axisLine={false}/>
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                    <Line yAxisId="left" type="monotone" dataKey="Faturamento" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-3)))'}} />
                    <Line yAxisId="right" type="monotone" dataKey="Compras" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-2)))'}} />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

// Campaign Table
const CampaignTable = () => (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 col-span-1 md:col-span-4 lg:col-span-4">
        <Tabs defaultValue="campaigns">
            <CardHeader>
                <TabsList>
                    <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
                    <TabsTrigger value="adsets">Conjuntos</TabsTrigger>
                    <TabsTrigger value="ads">Anúncios</TabsTrigger>
                </TabsList>
            </CardHeader>
            <CardContent>
                <TabsContent value="campaigns">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campanha</TableHead>
                                <TableHead>Investimento</TableHead>
                                <TableHead>Faturamento</TableHead>
                                <TableHead>ROAS</TableHead>
                                <TableHead>CPA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaignSummary.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>{formatCurrency(c.Custo)}</TableCell>
                                    <TableCell>{formatCurrency(c.Custo * 4.5)}</TableCell>
                                    <TableCell>{formatDecimal(4.5)}</TableCell>
                                    <TableCell>{formatCurrency(c.Custo / 150)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="adsets"><p className="text-center text-muted-foreground p-8">Dados de Conjuntos de Anúncios.</p></TabsContent>
                <TabsContent value="ads"><p className="text-center text-muted-foreground p-8">Dados de Anúncios.</p></TabsContent>
            </CardContent>
        </Tabs>
    </Card>
);

export default function MetaAdsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMobile = useIsMobile();
    
    useEffect(() => {
      const timer = setTimeout(() => {
        try {
          // Data fetch simulation
        } catch (e: any) {
          setError(e.message || "Ocorreu um erro desconhecido.");
        } finally {
          setLoading(false);
        }
      }, 500);
  
      return () => clearTimeout(timer);
    }, []);
  
    if (loading) {
      return <DashboardLoadingSkeleton />;
    }
  
    if (error) {
      return <DashboardErrorState message={error} />;
    }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold font-headline text-accent">Relatório Meta Ads</h1>
          <p className="text-muted-foreground">Nome da Empresa</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size={isMobile ? 'icon' : 'default'}><Download className={cn(isMobile && "h-4 w-4")} /><span className="hidden md:inline">Exportar</span></Button>
            <Button variant="outline" size={isMobile ? 'icon' : 'default'}><BarChart className={cn(isMobile && "h-4 w-4")} /><span className="hidden md:inline">Relatórios</span></Button>
            <Button variant="outline" size={isMobile ? 'icon' : 'default'}>
                <Filter className="mr-0 md:mr-2 h-4 w-4"/>
                <span className="hidden md:inline">Campanhas</span> 
                <ChevronDown className="ml-0 md:ml-2 h-4 w-4"/>
            </Button>
            <DateRangePicker />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPIs */}
        <KpiCard title="Investimento" value={formatCurrency(12943.04)} change="-28.2%" chartData={weeklyPerformance} chartDataKey="Gasto" chartColor="hsl(var(--chart-1))" />
        <KpiCard title="Faturamento" value={formatCurrency(18986.46)} change="-22.4%" chartData={weeklyPerformance} chartDataKey="Faturamento" chartColor="hsl(var(--chart-3))" />
        <KpiCard title="Compras" value={formatNumber(400)} change="-23.8%" chartData={weeklyPerformance} chartDataKey="Compras" chartColor="hsl(var(--chart-2))" />
        <KpiCard title="ROAS Médio" value={formatDecimal(1.47)} change="+8.1%" chartData={weeklyPerformance} chartDataKey="ROAS" chartColor="hsl(var(--chart-4))" />
        
        {/* Funnel */}
        <TrafficFunnel />

        {/* Charts */}
        <PerformanceChart />
        <DonutChartCard title="Melhores Anúncios (Conversões)" data={adSpendDistribution} />

        {/* Table */}
        <CampaignTable />
      </div>
    </div>
  );
}
