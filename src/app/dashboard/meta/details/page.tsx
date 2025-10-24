
"use client"

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "../components/date-range-picker";
import { Download, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LabelList } from "recharts";
import { detailedMetrics, weeklyPerformance } from "../data";

const ConversionRateCard = () => {
    const percentage = 7.6;
    const change = -7.39;
    const radius = 50;
    const strokeWidth = 10;
    const semiCircumference = Math.PI * radius;
    const strokeDashoffset = semiCircumference - (semiCircumference * percentage) / 100;
  
    return (
      <Card className="glass-card border-white/10 hover:shadow-glass-hover">
        <CardContent className="p-4 relative flex flex-col items-center justify-center">
          <svg width="150" height="95" viewBox="0 0 120 75">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" />
              </linearGradient>
            </defs>
            {/* Background semi-circle */}
            <path
              d="M 10 60 A 50 50 0 0 1 110 60"
              fill="transparent"
              stroke="hsl(var(--muted-foreground)/0.2)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Foreground semi-circle */}
            <path
              d="M 10 60 A 50 50 0 0 1 110 60"
              fill="transparent"
              stroke="url(#gaugeGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={semiCircumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center mt-[-10px]">
            <div className="text-xs text-muted-foreground">Taxa de Conversão</div>
            <div className="text-3xl font-bold font-headline">7.6%</div>
            <div className={cn("text-xs", change >= 0 ? "text-green-400" : "text-red-400")}>
              {change.toFixed(2)}%
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

const CheckoutConversionCard = () => (
    <Card className="glass-card border-white/10 hover:shadow-glass-hover">
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

const PerformanceChart = () => (
    <Card className="glass-card border-white/10 hover:shadow-glass-hover">
      <CardHeader>
        <CardTitle className="font-headline text-accent">Compras vs ROAS</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 h-[418px]">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyPerformance} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <YAxis yAxisId="left" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} tick={{fontSize: 12}} name="Compras" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} tick={{fontSize: 12}} name="ROAS" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="Compras" stroke="hsl(var(--chart-2))" fill="url(#colorCompras)" strokeWidth={2} name="Compras" />
                <Line yAxisId="right" type="monotone" dataKey="ROAS" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="ROAS" style={{filter: 'drop-shadow(0 0 4px hsl(var(--chart-1)))'}} />
            </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
);

const DonutChartCard = ({ title, data }: { title: string; data: { name: string; value: number; fill: string }[] }) => (
    <Card className="glass-card border-white/10 hover:shadow-glass-hover">
      <CardHeader>
        <CardTitle className="font-headline text-accent">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              innerRadius={70} 
              outerRadius={90}
              paddingAngle={5}
              cornerRadius={8}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} style={{filter: `drop-shadow(0 0 5px ${entry.fill})`}} />
              ))}
              <LabelList dataKey="name" position="outside" fill="hsl(var(--foreground))" stroke="none" className="fill-foreground text-xs" />
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );


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
