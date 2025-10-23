"use client"

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "../components/date-range-picker";
import { Download, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DonutChartCard } from "../components/donut-chart-card";
import { detailedMetrics, weeklyPerformance } from "../data";
import { PerformanceChart } from "../components/performance-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GaugeCircle } from "lucide-react";

const ConversionRateCard = () => (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
        <CardHeader className="pb-2">
            <CardDescription>Taxa de Conversão</CardDescription>
            <CardTitle className="text-4xl font-headline">7.6%</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-xs text-red-400">-7.39% vs período anterior</div>
            <div className="relative h-20 mt-4">
                 <GaugeCircle value={76} className="w-full h-auto absolute top-0 left-0 text-green-400" strokeWidth={2} style={{ filter: "drop-shadow(0 0 5px currentColor)" }}/>
            </div>
        </CardContent>
    </Card>
)

const CheckoutConversionCard = () => (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
        <CardHeader className="pb-2">
            <CardDescription>Conversão de Checkout</CardDescription>
            <CardTitle className="text-4xl font-headline">25.62%</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-xs text-green-400">+82.1% vs período anterior</div>
            <Progress value={25.62} className="w-full mt-4 h-3 bg-muted/30" indicatorClassName="bg-green-400" />
        </CardContent>
    </Card>
)


export default function MetaAdsDetailsPage() {
    const isMobile = useIsMobile();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                <h1 className="text-2xl font-bold font-headline text-accent">Detalhamento Geral</h1>
                <p className="text-muted-foreground">Meta Ads</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size={isMobile ? 'icon' : 'default'}><Filter className={cn(isMobile && "h-4 w-4")} /><span className="hidden md:inline">Filtros</span></Button>
                    <Button variant="outline" size={isMobile ? 'icon' : 'default'}><Download className={cn(isMobile && "h-4 w-4")} /><span className="hidden md:inline">Exportar</span></Button>
                    <DateRangePicker />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-1 flex flex-col gap-6">
                <ConversionRateCard />
                <CheckoutConversionCard />
              </div>

              <div className="lg:col-span-2">
                <PerformanceChart />
              </div>
              
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <DonutChartCard title="Gênero" data={detailedMetrics.genderDistribution} />
                <DonutChartCard title="Faixa Etária" data={detailedMetrics.ageDistribution} />
              </div>
          </div>
        </div>
    )
}
