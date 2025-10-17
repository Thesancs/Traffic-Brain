"use client";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart,
  Calendar as CalendarIcon,
  ChevronDown,
  DollarSign,
  Eye,
  Filter,
  Info,
  MousePointerClick,
  PieChartIcon,
  ShoppingBag,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart as RechartsBarChart,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  adSpendDistribution,
  campaignSummary,
  conversionFunnelData,
  detailedMetrics,
  funnelData,
  overviewKpis,
  weeklyPerformance,
} from "./data";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR").format(value);

function Overview() {
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

      <FluidFunnelChart />

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-neon-blue">
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
        <TrafficFunnel />
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-neon-blue">
          <CardHeader>
            <CardTitle className="font-headline text-accent">Distribuição de Gastos por Anúncio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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
        <Card className="lg:col-span-3 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-neon-blue">
          <CardHeader>
            <CardTitle className="font-headline text-accent">Resumo das Campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            <CampaignSummaryTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const FluidFunnelChart = () => {
  const data = conversionFunnelData;
  const maxValue = Math.max(...data.map(d => d.value));

  const getPathD = (data: { stage: string; value: number }[], width: number, height: number): string => {
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = (d.value / maxValue) * (height / 2);
      return { x, y };
    });

    let path = `M ${points[0].x},${height / 2 - points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      const cp1x = start.x + (end.x - start.x) / 2;
      const cp1y = height / 2 - start.y;
      const cp2x = start.x + (end.x - start.x) / 2;
      const cp2y = height / 2 - end.y;
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${end.x},${height / 2 - end.y}`;
    }

    let lowerPath = `L ${points[points.length - 1].x},${height / 2 + points[points.length - 1].y}`;
    
    for (let i = points.length - 1; i > 0; i--) {
      const start = points[i];
      const end = points[i - 1];
       const cp1x = start.x - (start.x - end.x) / 2;
      const cp1y = height / 2 + start.y;
      const cp2x = start.x - (start.x - end.x) / 2;
      const cp2y = height / 2 + end.y;
      lowerPath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${end.x},${height / 2 + end.y}`;
    }
    
    return path + " " + lowerPath + " Z";
  };


  return (
    <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg hover:shadow-neon-blue transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-accent">Funil de Conversão (Meta Ads)</CardTitle>
        <TooltipProvider>
          <UiTooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <Info className="w-4 h-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Este funil mostra a jornada do usuário desde o primeiro clique.</p>
            </TooltipContent>
          </UiTooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="h-[250px] p-0">
        <ResponsiveContainer width="100%" height="100%">
          <div className="relative w-full h-full p-6 flex flex-col">
            <div className="flex justify-around items-start">
              {data.map((item, index) => (
                <div key={index} className="flex-1 text-center">
                  <h3 className="text-sm md:text-base text-blue-200">{item.stage}</h3>
                </div>
              ))}
            </div>

            <div className="relative flex-1 w-full flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 800 150" preserveAspectRatio="none" className="absolute top-0 left-0 drop-shadow-[0_0_10px_#00F7FF66]">
                 <defs>
                    <linearGradient id="funnelGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                      <stop offset="50%" stopColor="hsl(var(--chart-2))" />
                      <stop offset="100%" stopColor="#FF00AA" />
                    </linearGradient>
                  </defs>
                <path d={getPathD(data, 800, 150)} fill="url(#funnelGradient)" />
              </svg>

              <div className="w-full h-full flex justify-around items-center">
                 {data.map((item, index) => (
                  <div key={index} className="z-10 flex-1 text-center">
                    <p className="text-white font-semibold text-lg md:text-xl font-headline">
                      {((item.value / data[0].value) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-around items-end">
              {data.map((item, index) => (
                 <div key={index} className="flex-1 text-center">
                  <p className="text-sm md:text-base text-blue-200">{formatNumber(item.value)}</p>
                 </div>
              ))}
            </div>

            <div className="absolute top-1/2 left-0 w-full h-px" style={{ transform: 'translateY(-50%)' }}>
              <div className="flex justify-around h-full">
                {data.slice(0, -1).map((_, index) => (
                  <div key={index} className={cn("w-px bg-blue-300/20 h-full", index === 0 && 'ml-[20%]')}></div>
                ))}
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const FunnelStage = ({
  stage,
  value,
  percentage,
  color,
  icon: Icon,
}: {
  stage: string;
  value: number;
  percentage: number;
  color: string;
  icon: React.ElementType;
}) => {
  const width = `${percentage}%`;

  return (
    <div className="relative flex items-center justify-center group">
      <div
        className="h-16 transition-all duration-300 ease-in-out"
        style={{
          width: width,
          backgroundColor: color,
          clipPath:
            'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-semibold">{stage}</span>
        </div>
        <span className="text-lg font-bold font-headline">
          {formatNumber(value)}
        </span>
      </div>
    </div>
  );
};

function TrafficFunnel() {
  const maxCliques = funnelData.length > 0 ? funnelData[0].value : 0;
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];
  const icons = [MousePointerClick, Users, ShoppingBag, Target];

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-neon-blue">
      <CardHeader>
        <CardTitle className="font-headline text-accent">Funil de Tráfego</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {funnelData.map((item, index) => (
            <FunnelStage
              key={item.stage}
              stage={item.stage}
              value={item.value}
              percentage={maxCliques > 0 ? (item.value / maxCliques) * 80 + 20 : 0}
              color={colors[index % colors.length]}
              icon={icons[index % icons.length]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignSummaryTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campanha</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead>Impressões</TableHead>
            <TableHead>Cliques</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>CPC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaignSummary.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>{formatCurrency(campaign.Custo)}</TableCell>
              <TableCell>{formatNumber(campaign.Impressoes)}</TableCell>
              <TableCell>{formatNumber(campaign.Cliques)}</TableCell>
              <TableCell>{campaign.CTR}</TableCell>
              <TableCell>{campaign.CPC}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Details() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="text-xl font-bold font-headline text-accent">Detalhamento</h2>
        <div className="flex-grow" />
        <FilterDropdown label="Campanha" options={["Campanha A", "Campanha B"]} />
        <FilterDropdown label="Conjunto" options={["Conjunto 1", "Conjunto 2"]} />
        <FilterDropdown label="Anúncio" options={["Anúncio X", "Anúncio Y"]} />
        <Button variant="outline">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Período
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-3 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-neon-blue">
          <CardHeader>
            <CardTitle className="font-headline text-accent">Métricas de Performance (CTR, CPC, CPM)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={detailedMetrics.ctr}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)"/>
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Line type="monotone" dataKey="CTR" stroke="hsl(var(--chart-1))" strokeWidth={2} name="CTR (%)" />
                <Line type="monotone" dataKey="CPC" stroke="hsl(var(--chart-2))" strokeWidth={2} name="CPC (R$)" />
                <Line type="monotone" dataKey="CPM" stroke="hsl(var(--chart-3))" strokeWidth={2} name="CPM (R$)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <PieChartCard title="Campanhas com Melhor ROAS" data={detailedMetrics.bestRoasCampaigns} />
        <PieChartCard title="Anúncios com Menor CPA" data={detailedMetrics.lowestCpaAds} />
      </div>

      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-neon-blue">
        <CardHeader>
          <CardTitle className="font-headline text-accent">Tabela Comparativa de Campanhas</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonTable />
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-neon-blue">
        <CardHeader>
          <CardTitle className="font-headline text-accent">Comparação de Campanhas (Custo x Resultado)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={detailedMetrics.campaignCostResult}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)"/>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Bar dataKey="cost" fill="hsl(var(--chart-1))" name="Custo" />
              <Bar dataKey="result" fill="hsl(var(--chart-2))" name="Resultado" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function FilterDropdown({ label, options }: { label: string; options: string[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {label}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem key={option}>{option}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PieChartCard({ title, data }: { title: string; data: { name: string; value: number; fill: string }[] }) {
  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-neon-blue">
      <CardHeader>
        <CardTitle className="font-headline text-accent">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList dataKey="name" position="outside" />
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
  );
}

function ComparisonTable() {
  const getRoasColor = (roas: number) => {
    if (roas >= 5.5) return 'text-green-400';
    if (roas < 4.5) return 'text-red-400';
    return '';
  };

  const getCplColor = (cpl: number) => {
    if (cpl <= 15) return 'text-green-400';
    if (cpl > 25) return 'text-red-400';
    return '';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campanha</TableHead>
            <TableHead>Checkouts</TableHead>
            <TableHead>Gasto</TableHead>
            <TableHead>Receita</TableHead>
            <TableHead>CPL</TableHead>
            <TableHead>ROAS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {detailedMetrics.comparisonTable.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.Campanha}</TableCell>
              <TableCell>{formatNumber(row.Checkouts)}</TableCell>
              <TableCell>{formatCurrency(row.Gasto)}</TableCell>
              <TableCell>{formatCurrency(row.Receita)}</TableCell>
              <TableCell className={getCplColor(row.CPL)}>{formatCurrency(row.CPL)}</TableCell>
              <TableCell className={getRoasColor(row.ROAS)}>{row.ROAS.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function MetaAdsPage() {
  return (
    <div className="text-foreground">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline text-accent">Dashboard Meta Ads</h1>
          <p className="text-muted-foreground">Análise de performance das suas campanhas.</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="details">Detalhamento</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="details">
          <Details />
        </TabsContent>
      </Tabs>
    </div>
  );
}

    