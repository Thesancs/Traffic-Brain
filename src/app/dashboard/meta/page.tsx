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

    const totalSpend = weeklyPerformance.reduce((sum, item) => sum + item.Gasto, 0);
    const totalRevenue = weeklyPerformance.reduce((sum, item) => sum + item.Faturamento, 0);
    const totalPurchases = weeklyPerformance.reduce((sum, item) => sum + item.Compras, 0);
    const totalCheckouts = weeklyPerformance.reduce((sum, item) => sum + item.Checkouts, 0);
    const initiatedCheckouts = infoproductFunnelData.find(d => d.stage.includes('Checkout'))?.value || 0;

    const checkoutCostTrend = weeklyPerformance.map((item) => ({
      name: item.name,
      value: item.Checkouts > 0 ? Number((item.Gasto / item.Checkouts).toFixed(2)) : 0,
    }));

    const cpaTrend = weeklyPerformance.map((item) => ({
      name: item.name,
      value: item.Compras > 0 ? Number((item.Gasto / item.Compras).toFixed(2)) : 0,
    }));

    const roasTrend = weeklyPerformance.map((item) => item.ROAS);

    const formatChange = (current?: number, previous?: number) => {
      if (current === undefined || previous === undefined) {
        return "0.0%";
      }

      if (previous === 0) {
        if (current === 0) return "0.0%";
        return current > 0 ? "+100%" : "-100%";
      }

      const change = ((current - previous) / Math.abs(previous)) * 100;
      const rounded = change.toFixed(1);
      return `${change >= 0 ? "+" : ""}${rounded}%`;
    };

    const getLatestChange = (series: number[]) => {
      if (series.length < 2) {
        return "0.0%";
      }
      const current = series[series.length - 1];
      const previous = series[series.length - 2];
      return formatChange(current, previous);
    };

    const spendChange = getLatestChange(weeklyPerformance.map((item) => item.Gasto));
    const revenueChange = getLatestChange(weeklyPerformance.map((item) => item.Faturamento));
    const purchasesChange = getLatestChange(weeklyPerformance.map((item) => item.Compras));
    const roasChange = getLatestChange(roasTrend);
    const checkoutChange = getLatestChange(weeklyPerformance.map((item) => item.Checkouts));
    const checkoutCostChange = getLatestChange(checkoutCostTrend.map((item) => item.value));
    const cpaChange = getLatestChange(cpaTrend.map((item) => item.value));

    const costPerCheckout = initiatedCheckouts > 0 ? totalSpend / initiatedCheckouts : 0;
    const cpa = totalPurchases > 0 ? totalSpend / totalPurchases : 0;
    const averageRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  
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
            <KpiCard title="Investimento" value={formatCurrency(totalSpend)} change={spendChange} chartData={weeklyPerformance} chartDataKey="Gasto" chartColor="hsl(var(--chart-1))" tooltipFormatter={(value) => formatCurrency(value)} />
            <KpiCard title="Faturamento" value={formatCurrency(totalRevenue)} change={revenueChange} chartData={weeklyPerformance} chartDataKey="Faturamento" chartColor="hsl(var(--chart-3))" tooltipFormatter={(value) => formatCurrency(value)} />
            <KpiCard title="Compras" value={formatNumber(totalPurchases)} change={purchasesChange} chartData={weeklyPerformance} chartDataKey="Compras" chartColor="hsl(var(--chart-2))" />
            <KpiCard title="ROAS Médio" value={formatDecimal(averageRoas)} change={roasChange} chartData={weeklyPerformance} chartDataKey="ROAS" chartColor="hsl(var(--chart-4))" tooltipFormatter={(value) => formatDecimal(value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard title="Checkouts Iniciados" value={formatNumber(totalCheckouts)} change={checkoutChange} chartData={weeklyPerformance} chartDataKey="Checkouts" chartColor="hsl(var(--chart-5))" />
            <KpiCard title="Custo por Checkout" value={formatCurrency(costPerCheckout)} change={checkoutCostChange} chartData={checkoutCostTrend} chartColor="hsl(var(--chart-1))" tooltipFormatter={(value) => formatCurrency(value)} />
            <KpiCard title="CPA (Custo por Compra)" value={formatCurrency(cpa)} change={cpaChange} chartData={cpaTrend} chartColor="hsl(var(--chart-2))" tooltipFormatter={(value) => formatCurrency(value)} />
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
