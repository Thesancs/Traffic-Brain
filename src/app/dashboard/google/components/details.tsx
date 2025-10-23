"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { searchTerms, detailedMetrics, conversionFunnelData } from "../data";
import { formatNumber, formatCurrency } from "@/lib/formatters";
import { PieChartCard } from "../../meta/components/pie-chart-card";

const SearchTermsTable = () => (
  <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
    <CardHeader>
      <CardTitle className="font-headline text-accent">Termos de Pesquisa Principais</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Termo de Pesquisa</TableHead>
            <TableHead>Cliques</TableHead>
            <TableHead>Conversões</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchTerms.map((term, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{term.term}</TableCell>
              <TableCell>{formatNumber(term.clicks)}</TableCell>
              <TableCell>{formatNumber(term.conversions)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const ConversionFunnelChart = () => (
  <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
    <CardHeader>
      <CardTitle className="font-headline text-accent">Funil de Conversão (Google Ads)</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={conversionFunnelData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.5)"/>
          <XAxis type="number" />
          <YAxis type="category" dataKey="stage" width={150} tickLine={false} axisLine={false}/>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
            }}
          />
          <Bar dataKey="value" name="Usuários" fill="hsl(var(--chart-2))" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const DevicePerformanceTable = () => (
    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:shadow-neon-blue">
      <CardHeader>
        <CardTitle className="font-headline text-accent">Desempenho por Dispositivo</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Cliques</TableHead>
              <TableHead>Conversões</TableHead>
              <TableHead>Faturamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detailedMetrics.devicePerformance.map((row) => (
              <TableRow key={row.device}>
                <TableCell className="font-medium">{row.device}</TableCell>
                <TableCell>{formatNumber(row.clicks)}</TableCell>
                <TableCell>{formatNumber(row.conversions)}</TableCell>
                <TableCell>{formatCurrency(row.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
);

export default function Details() {
  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <PieChartCard title="CTR (%) por Rede" data={detailedMetrics.ctrByNetwork} />
        <PieChartCard title="CPC (R$) por Rede" data={detailedMetrics.cpcByNetwork} />
      </div>
      <SearchTermsTable />
      <ConversionFunnelChart />
      <DevicePerformanceTable />
    </div>
  );
}
