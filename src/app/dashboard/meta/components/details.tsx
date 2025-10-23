"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart as RechartsBarChart } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { detailedMetrics } from "../data";
import { FilterDropdown } from "./filter-dropdown";
import { PieChartCard } from "./pie-chart-card";
import { ComparisonTable } from "./comparison-table";

export default function Details() {
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
        <Card className="lg:col-span-3 bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
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

      <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
        <CardHeader>
          <CardTitle className="font-headline text-accent">Tabela Comparativa de Campanhas</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonTable />
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
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
