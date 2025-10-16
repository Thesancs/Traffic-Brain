
export const overviewKpis = {
  gastos: 3497.07,
  campanhasAtivas: 67,
  impressoes: 112185,
  receitaEstimada: 4710.12,
  leads: 223,
  checkouts: 67,
};

export const weeklyPerformance = [
  { name: 'Seg', Gasto: 400, Leads: 24, Receita: 240 },
  { name: 'Ter', Gasto: 300, Leads: 13, Receita: 221 },
  { name: 'Qua', Gasto: 200, Leads: 98, Receita: 229 },
  { name: 'Qui', Gasto: 278, Leads: 39, Receita: 200 },
  { name: 'Sex', Gasto: 189, Leads: 48, Receita: 218 },
  { name: 'Sab', Gasto: 239, Leads: 38, Receita: 250 },
  { name: 'Dom', Gasto: 349, Leads: 43, Receita: 210 },
];

export const funnelData = [
  { stage: 'Cliques', value: 10000 },
  { stage: 'Leads', value: 2000 },
  { stage: 'Checkouts', value: 500 },
  { stage: 'Vendas', value: 100 },
];

export const adSpendDistribution = [
  { name: 'Anúncio A', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Anúncio B', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Anúncio C', value: 300, fill: 'hsl(var(--chart-3))' },
  { name: 'Anúncio D', value: 200, fill: 'hsl(var(--chart-4))' },
];

export const campaignSummary = [
  { id: 1, name: 'Campanha de Verão', Custo: 1200, Impressoes: 50000, Cliques: 2500, CTR: '5%', CPC: 'R$ 0,48' },
  { id: 2, name: 'Promoção Outono', Custo: 800, Impressoes: 30000, Cliques: 1800, CTR: '6%', CPC: 'R$ 0,44' },
  { id: 3, name: 'Inverno Black', Custo: 1500, Impressoes: 60000, Cliques: 3000, CTR: '5%', CPC: 'R$ 0,50' },
  { id: 4, name: 'Primavera Ads', Custo: 500, Impressoes: 20000, Cliques: 1200, CTR: '6%', CPC: 'R$ 0,42' },
];

export const detailedMetrics = {
  ctr: [
    { date: '2023-01', CTR: 2.5, CPC: 0.5, CPM: 10 },
    { date: '2023-02', CTR: 2.8, CPC: 0.48, CPM: 9.5 },
    { date: '2023-03', CTR: 3.0, CPC: 0.45, CPM: 9 },
    { date: '2023-04', CTR: 2.7, CPC: 0.47, CPM: 9.8 },
    { date: '2023-05', CTR: 3.2, CPC: 0.42, CPM: 8.5 },
  ],
  bestRoasCampaigns: [
    { name: 'Campanha A', value: 5.5, fill: 'hsl(var(--chart-1))' },
    { name: 'Campanha B', value: 4.8, fill: 'hsl(var(--chart-2))' },
    { name: 'Campanha C', value: 4.2, fill: 'hsl(var(--chart-3))' },
    { name: 'Outras', value: 3.5, fill: 'hsl(var(--chart-4))' },
  ],
  lowestCpaAds: [
    { name: 'Anúncio X', value: 10, fill: 'hsl(var(--chart-1))' },
    { name: 'Anúncio Y', value: 12, fill: 'hsl(var(--chart-2))' },
    { name: 'Anúncio Z', value: 15, fill: 'hsl(var(--chart-3))' },
    { name: 'Outros', value: 18, fill: 'hsl(var(--chart-4))' },
  ],
  comparisonTable: [
    { id: 1, Campanha: 'Verão Quente', Checkouts: 120, Gasto: 2500, Receita: 13750, CPL: 20.83, ROAS: 5.5 },
    { id: 2, Campanha: 'Outono Imperdível', Checkouts: 95, Gasto: 1800, Receita: 8640, CPL: 18.95, ROAS: 4.8 },
    { id: 3, Campanha: 'Inverno Gelado', Checkouts: 80, Gasto: 2200, Receita: 9240, CPL: 27.50, ROAS: 4.2 },
    { id: 4, Campanha: 'Primavera Floral', Checkouts: 150, Gasto: 2000, Receita: 12000, CPL: 13.33, ROAS: 6.0 },
  ],
  campaignCostResult: [
    { name: 'Campanha A', cost: 4000, result: 2400 },
    { name: 'Campanha B', cost: 3000, result: 1398 },
    { name: 'Campanha C', cost: 2000, result: 9800 },
    { name: 'Campanha D', cost: 2780, result: 3908 },
    { name: 'Campanha E', cost: 1890, result: 4800 },
  ],
};
