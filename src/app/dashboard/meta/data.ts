
export const overviewKpis = {
  gastos: 3497.07,
  campanhasAtivas: 67,
  impressoes: 38079,
  receitaEstimada: 4710.12,
  leads: 223,
  checkouts: 116,
};

export const weeklyPerformance = [
  { name: 'Seg', Gasto: 400, Faturamento: 240 },
  { name: 'Ter', Gasto: 300, Faturamento: 221 },
  { name: 'Qua', Gasto: 200, Faturamento: 229 },
  { name: 'Qui', Gasto: 278, Faturamento: 200 },
  { name: 'Sex', Gasto: 189, Faturamento: 218 },
  { name: 'Sab', Gasto: 239, Faturamento: 250 },
  { name: 'Dom', Gasto: 349, Faturamento: 210 },
];

export type FunnelStageData = {
  stage: string;
  value: number;
  costLabel: string;
  costValue: number;
  costChange?: number;
};

export const infoproductFunnelData: FunnelStageData[] = [
    { stage: 'Impressões', value: 38079, costLabel: 'CPM', costValue: 40.61, costChange: 182.2 },
    { stage: 'Cliques', value: 1032, costLabel: 'CPC', costValue: 1.50, costChange: 157.0 },
    { stage: 'Page View', value: 918, costLabel: 'Custo/Page View', costValue: 1.68, costChange: 94.8 },
    { stage: 'Iniciou Checkout (IC)', value: 116, costLabel: 'Custo/IC', costValue: 13.33 },
    { stage: 'Compras', value: 44, costLabel: 'Custo/Compra', costValue: 35.14 },
];

export const messagesFunnelData: FunnelStageData[] = [
  { stage: 'Impressões', value: 52000, costLabel: 'CPM', costValue: 35.50, costChange: 150.0 },
  { stage: 'Cliques no Link', value: 1200, costLabel: 'CPC', costValue: 1.54, costChange: 130.0 },
  { stage: 'Mensagens', value: 350, costLabel: 'Custo/Mensagem', costValue: 5.28 },
  { stage: 'Qualificados', value: 80, costLabel: 'Custo/Qualificado', costValue: 23.12 },
  { stage: 'Compras', value: 25, costLabel: 'Custo/Compra', costValue: 74.00 },
];

export const ecommerceFunnelData: FunnelStageData[] = [
  { stage: 'Impressões', value: 150000, costLabel: 'CPM', costValue: 22.00, costChange: 80.5 },
  { stage: 'Cliques', value: 4500, costLabel: 'CPC', costValue: 0.73, costChange: 65.0 },
  { stage: 'Page View', value: 4000, costLabel: 'Custo/Page View', costValue: 0.82 },
  { stage: 'Adicionou ao Carrinho', value: 450, costLabel: 'Custo/Add to Cart', costValue: 7.33 },
  { stage: 'Compras', value: 150, costLabel: 'Custo/Compra', costValue: 22.00 },
];

export const engagementFunnelData: FunnelStageData[] = [
  { stage: 'Impressões', value: 250000, costLabel: 'CPM', costValue: 5.00, costChange: 25.0 },
  { stage: 'Alcance', value: 180000, costLabel: 'Custo/1k Pessoas', costValue: 6.94 },
  { stage: 'Engajamentos', value: 9000, costLabel: 'Custo/Engajamento', costValue: 0.14 },
  { stage: 'Visitas ao Perfil', value: 1200, costLabel: 'Custo/Visita', costValue: 1.04 },
  { stage: 'Novos Seguidores', value: 350, costLabel: 'Custo/Seguidor', costValue: 3.57 },
];

export const leadsFunnelData: FunnelStageData[] = [
  { stage: 'Impressões', value: 80000, costLabel: 'CPM', costValue: 18.75, costChange: 95.0 },
  { stage: 'Cliques', value: 2000, costLabel: 'CPC', costValue: 0.75, costChange: 75.0 },
  { stage: 'Landing Page Views', value: 1800, costLabel: 'Custo/LP View', costValue: 0.83 },
  { stage: 'Cadastros (Leads)', value: 500, costLabel: 'Custo/Lead (CPL)', costValue: 3.00 },
  { stage: 'Leads Qualificados', value: 100, costLabel: 'Custo/Lead Qualificado', costValue: 15.00 },
];

export const deliveryFunnelData: FunnelStageData[] = [
  { stage: 'Impressões', value: 45000, costLabel: 'CPM', costValue: 15.00, costChange: 110.0 },
  { stage: 'Cliques', value: 1500, costLabel: 'CPC', costValue: 0.45, costChange: 88.0 },
  { stage: 'Visualizações do Menu', value: 1200, costLabel: 'Custo/Menu View', costValue: 0.56 },
  { stage: 'Pedidos', value: 200, costLabel: 'Custo/Pedido', costValue: 3.37 },
  { stage: 'Pedidos Faturados', value: 180, costLabel: 'Custo/Pedido Faturado', costValue: 3.75 },
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

export type ConversionFunnelStage = {
  stage: string;
  value: number;
};

// Data based on the reference image
export const conversionFunnelData: ConversionFunnelStage[] = [
  { stage: 'Cliques', value: 1500 },
  { stage: 'Vis. Página', value: 1000 },
  { stage: 'ICs', value: 100 },
  { stage: 'Vendas Inic.', value: 120 },
  { stage: 'Vendas Apr.', value: 40 },
];

export const funnelDataSets = {
    'Infoproduto': infoproductFunnelData,
    'Mensagens': messagesFunnelData,
    'E-commerce': ecommerceFunnelData,
    'Engajamento': engagementFunnelData,
    'Cadastros': leadsFunnelData,
    'Delivery': deliveryFunnelData,
}

export type FunnelType = keyof typeof funnelDataSets;

export type VideoRetentionData = {
    stage: string;
    value: number;
};
  
export const videoRetentionDataSets: Record<string, VideoRetentionData[]> = {
    'Criativo 1': [
      { stage: 'Vv 25%', value: 8.57 },
      { stage: 'Vv 50%', value: 4.96 },
      { stage: 'Vv 75%', value: 3.22 },
      { stage: 'Vv 100%', value: 1.44 },
    ],
    'Criativo 2': [
      { stage: 'Vv 25%', value: 12.34 },
      { stage: 'Vv 50%', value: 8.12 },
      { stage: 'Vv 75%', value: 5.67 },
      { stage: 'Vv 100%', value: 2.01 },
    ],
    'Criativo 3': [
      { stage: 'Vv 25%', value: 5.55 },
      { stage: 'Vv 50%', value: 2.11 },
      { stage: 'Vv 75%', value: 1.05 },
      { stage: 'Vv 100%', value: 0.45 },
    ],
};

export type VideoCreativeType = keyof typeof videoRetentionDataSets;
