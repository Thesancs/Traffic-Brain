"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "./components/date-range-picker";
import { weeklyPerformance, adSpendDistribution, infoproductFunnelData } from "./data";
import { formatCurrency, formatNumber, formatDecimal } from "@/lib/formatters";
import { DashboardLoadingSkeleton } from "./components/dashboard-loading-skeleton";
import { DashboardErrorState } from "./components/dashboard-error-state";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PerformanceChart } from "./components/performance-chart";
import { DonutChartCard } from "./components/donut-chart-card";
import { KpiCard } from "./components/kpi-card";
import { TrafficFunnel } from "./components/traffic-funnel";
import { CampaignTable } from "./components/campaign-table";
import { VideoRetentionFunnel } from "./components/video-retention-funnel";

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

    const totalSpend = 12943.04;
    const totalPurchases = 400;
    const initiatedCheckouts = infoproductFunnelData.find(d => d.stage.includes('Checkout'))?.value || 0;
    const costPerCheckout = initiatedCheckouts > 0 ? totalSpend / initiatedCheckouts : 0;
    const cpa = totalPurchases > 0 ? totalSpend / totalPurchases : 0;
  
    if (loading) {
      return <DashboardLoadingSkeleton />;
    }
  
    if (error) {
      return <DashboardErrorState message={error} />;
    }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold font-headline text-accent">Visão Geral</h1>
          <p className="text-muted-foreground">Nome da Empresa</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size={isMobile ? 'icon' : 'default'}><Download className={cn(isMobile && "h-4 w-4")} /><span className="hidden md:inline">Exportar</span></Button>
            <Button variant="outline" size={isMobile ? 'icon' : 'default'}>
                <Filter className="mr-0 md:mr-2 h-4 w-4"/>
                <span className="hidden md:inline">Campanhas</span> 
                <ChevronDown className="ml-0 md:ml-2 h-4 w-4"/>
            </Button>
            <DateRangePicker />
        </div>
      </div>

      {/* Main Content - Single Column Layout */}
      <div className="flex flex-col gap-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Investimento" value={formatCurrency(totalSpend)} change="-28.2%" chartData={weeklyPerformance} chartDataKey="Gasto" chartColor="hsl(var(--chart-1))" />
            <KpiCard title="Faturamento" value={formatCurrency(18986.46)} change="-22.4%" chartData={weeklyPerformance} chartDataKey="Faturamento" chartColor="hsl(var(--chart-3))" />
            <KpiCard title="Compras" value={formatNumber(totalPurchases)} change="-23.8%" chartData={weeklyPerformance} chartDataKey="Compras" chartColor="hsl(var(--chart-2))" />
            <KpiCard title="ROAS Médio" value={formatDecimal(1.47)} change="+8.1%" chartData={weeklyPerformance} chartDataKey="ROAS" chartColor="hsl(var(--chart-4))" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard title="Checkouts Iniciados" value={formatNumber(initiatedCheckouts)} change="-15%" chartData={weeklyPerformance} chartDataKey="Checkouts" chartColor="hsl(var(--chart-5))"/>
            <KpiCard title="Custo por Checkout" value={formatCurrency(costPerCheckout)} change="+12%" chartData={[]} chartDataKey="" chartColor="hsl(var(--chart-1))"/>
            <KpiCard title="CPA (Custo por Compra)" value={formatCurrency(cpa)} change="+5%" chartData={[]} chartDataKey="" chartColor="hsl(var(--chart-2))" />
        </div>
        
        <TrafficFunnel />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
                <PerformanceChart />
            </div>
            <DonutChartCard title="Melhores Anúncios (Conversões)" data={adSpendDistribution} />
        </div>

        <CampaignTable />
        
        <VideoRetentionFunnel />
        
      </div>
    </div>
  );
}
