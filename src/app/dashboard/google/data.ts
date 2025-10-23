export const overviewKpis = {
  cost: 95000,
  clicks: 180000,
  cpc: 0.53,
  conversions: 9500,
  cpa: 10.00,
  revenue: 285000,
};

export const performanceByDay = [
    { name: 'Seg', Custo: 12000, Faturamento: 38000 },
    { name: 'Ter', Custo: 13500, Faturamento: 42000 },
    { name: 'Qua', Custo: 14000, Faturamento: 45000 },
    { name: 'Qui', Custo: 12500, Faturamento: 40000 },
    { name: 'Sex', Custo: 15000, Faturamento: 55000 },
    { name: 'Sab', Custo: 18000, Faturamento: 65000 },
    { name: 'Dom', Custo: 10000, Faturamento: 30000 },
];

export const campaignPerformance = [
  { id: 1, name: 'Pesquisa - Marca', cost: 15000, clicks: 50000, cpc: 'R$ 0,30', conversions: 2500, cpa: 'R$ 6,00' },
  { id: 2, name: 'Display - Remarketing', cost: 10000, clicks: 20000, cpc: 'R$ 0,50', conversions: 1000, cpa: 'R$ 10,00' },
  { id: 3, name: 'Shopping - Verão', cost: 30000, clicks: 60000, cpc: 'R$ 0,50', conversions: 3000, cpa: 'R$ 10,00' },
  { id: 4, name: 'Youtube - Topo', cost: 25000, clicks: 40000, cpc: 'R$ 0,63', conversions: 2000, cpa: 'R$ 12,50' },
  { id: 5, name: 'Performance Max', cost: 15000, clicks: 10000, cpc: 'R$ 1,50', conversions: 1000, cpa: 'R$ 15,00' },
];

export const searchTerms = [
    { term: "tênis de corrida", clicks: 5000, conversions: 250 },
    { term: "comprar smartwatch", clicks: 3500, conversions: 180 },
    { term: "promoção de celular", clicks: 8000, conversions: 320 },
    { term: "notebook para trabalho", clicks: 4200, conversions: 150 },
    { term: "fone de ouvido bluetooth", clicks: 6000, conversions: 200 },
];

export const conversionFunnelData = [
    { stage: 'Cliques', value: 180000 },
    { stage: 'Visualizações de Página', value: 150000 },
    { stage: 'Adições ao Carrinho', value: 30000 },
    { stage: 'Finalizações de Compra', value: 9500 },
];

export const detailedMetrics = {
    ctrByNetwork: [
        { name: 'Pesquisa', value: 8.5, fill: 'hsl(var(--chart-1))' },
        { name: 'Display', value: 1.2, fill: 'hsl(var(--chart-2))' },
        { name: 'Shopping', value: 2.5, fill: 'hsl(var(--chart-3))' },
        { name: 'Youtube', value: 0.8, fill: 'hsl(var(--chart-4))' },
    ],
    cpcByNetwork: [
        { name: 'Pesquisa', value: 0.45, fill: 'hsl(var(--chart-1))' },
        { name: 'Display', value: 0.25, fill: 'hsl(var(--chart-2))' },
        { name: 'Shopping', value: 0.35, fill: 'hsl(var(--chart-3))' },
        { name: 'Youtube', value: 0.30, fill: 'hsl(var(--chart-4))' },
    ],
    devicePerformance: [
        { device: 'Desktop', clicks: 80000, conversions: 4500, revenue: 150000 },
        { device: 'Mobile', clicks: 90000, conversions: 4800, revenue: 120000 },
        { device: 'Tablet', clicks: 10000, conversions: 200, revenue: 15000 },
    ]
}
