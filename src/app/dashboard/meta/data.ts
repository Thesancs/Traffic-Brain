
export const overviewKpis = {
  gastos: 75000,
  campanhasAtivas: 12,
  impressoes: 1500000,
  receitaEstimada: 225000,
  leads: 5000,
  checkouts: 1200,
};

export const weeklyPerformance = [
    { name: 'Seg', Gasto: 80000, Faturamento: 25000 },
    { name: 'Ter', Gasto: 9500, Faturamento: 30000 },
    { name: 'Qua', Gasto: 11000, Faturamento: 35000 },
    { name: 'Qui', Gasto: 10000, Faturamento: 32000 },
    { name: 'Sex', Gasto: 13000, Faturamento: 45000 },
    { name: 'Sab', Gasto: 15000, Faturamento: 55000 },
    { name: 'Dom', Gasto: 12000, Faturamento: 40000 },
];

export type FunnelStageData = {
  stage: string;
  value: number;
  costLabel: string;
  costValue: number;
  costChange?: number;
};

export const infoproductFunnelData: FunnelStageData[] = [
    { stage: 'Impressões', value: 1200000, costLabel: 'CPM', costValue: 15.00, costChange: 20.5 },
    { stage: 'Cliques', value: 36000, costLabel: 'CPC', costValue: 0.50, costChange: 15.0 },
    { stage: 'Page View', value: 25000, costLabel: 'Custo/Page View', costValue: 0.72, costChange: 10.2 },
    { stage: 'Iniciou Checkout (IC)', value: 2500, costLabel: 'Custo/IC', costValue: 7.20 },
    { stage: 'Compras', value: 1000, costLabel: 'Custo/Compra', costValue: 18.00 },
];

export const messagesFunnelData: FunnelStageData[] = [
  { stage: 'Impressões', value: 800000, costLabel: 'CPM', costValue: 12.50, costChange: 18.0 },
  { stage: 'Cliques no Link', value: 16000, costLabel: 'CPC', costValue: 0.63, costChange: 22.0 },
  { stage: 'Mensagens', value: 4000, costLabel: 'Custo/Mensagem', costValue: 2.50 },
  { stage: 'Qualificados', value: 800, costLabel: 'Custo/Qualificado', costValue: 12.50 },
  { stage: 'Compras', value: 200, costLabel: 'Custo/Compra', costValue: 50.00 },
];

export const ecommerceFunnelData: FunnelStageData[] = [
  { stage: 'Impressões', value: 2500000, costLabel: 'CPM', costValue: 10.00, costChange: 30.0 },
  { stage: 'Cliques', value: 50000, costLabel: 'CPC', costValue: 0.50, costChange: 25.0 },
  { stage: 'Page View', value: 45000, costLabel: 'Custo/Page View', costValue: 0.56 },
  { stage: 'Adicionou ao Carrinho', value: 4500, costLabel: 'Custo/Add to Cart', costValue: 5.56 },
  { stage: 'Compras', value: 1500, costLabel: 'Custo/Compra', costValue: 16.67 },
];

export const engagementFunnelData: FunnelStageData[] = [
  { stage: 'Impressões', value: 5000000, costLabel: 'CPM', costValue: 2.00, costChange: 10.0 },
  { stage: 'Alcance', value: 3500000, costLabel: 'Custo/1k Pessoas', costValue: 2.86 },
  { stage: 'Engajamentos', value: 150000, costLabel: 'Custo/Engajamento', costValue: 0.07 },
  { stage: 'Visitas ao Perfil', value: 15000, costLabel: 'Custo/Visita', costValue: 0.67 },
  { stage: 'Novos Seguidores', value: 5000, costLabel: 'Custo/Seguidor', costValue: 2.00 },
];

export const leadsFunnelData: FunnelStageData[] = [
  { stage: 'Impressões', value: 1000000, costLabel: 'CPM', costValue: 20.00, costChange: 15.0 },
  { stage: 'Cliques', value: 20000, costLabel: 'CPC', costValue: 1.00, costChange: 12.0 },
  { stage: 'Landing Page Views', value: 18000, costLabel: 'Custo/LP View', costValue: 1.11 },
  { stage: 'Cadastros (Leads)', value: 4500, costLabel: 'Custo/Lead (CPL)', costValue: 4.44 },
  { stage: 'Leads Qualificados', value: 900, costLabel: 'Custo/Lead Qualificado', costValue: 22.22 },
];

export const deliveryFunnelData: FunnelStageData[] = [
  { stage: 'Impressões', value: 500000, costLabel: 'CPM', costValue: 10.00, costChange: 25.0 },
  { stage: 'Cliques', value: 25000, costLabel: 'CPC', costValue: 0.20, costChange: 18.0 },
  { stage: 'Visualizações do Menu', value: 20000, costLabel: 'Custo/Menu View', costValue: 0.25 },
  { stage: 'Pedidos', value: 2000, costLabel: 'Custo/Pedido', costValue: 2.50 },
  { stage: 'Pedidos Faturados', value: 1800, costLabel: 'Custo/Pedido Faturado', costValue: 2.78 },
];


export const adSpendDistribution = [
  { name: 'Campanha de Vendas', value: 4500, fill: 'hsl(var(--chart-1))' },
  { name: 'Campanha de Leads', value: 2500, fill: 'hsl(var(--chart-2))' },
  { name: 'Campanha de Tráfego', value: 2000, fill: 'hsl(var(--chart-3))' },
  { name: 'Remarketing', value: 1000, fill: 'hsl(var(--chart-4))' },
];

export const campaignSummary = [
  { id: 1, name: 'Venda Direta - Verão', Custo: 25000, Impressoes: 500000, Cliques: 15000, CTR: '3.00%', CPC: 'R$ 1,67' },
  { id: 2, name: 'Captura de Leads - Ebook', Custo: 15000, Impressoes: 300000, Cliques: 12000, CTR: '4.00%', CPC: 'R$ 1,25' },
  { id: 3, name: 'Remarketing - Carrinho', Custo: 10000, Impressoes: 200000, Cliques: 20000, CTR: '10.00%', CPC: 'R$ 0,50' },
  { id: 4, name: 'Institucional - Branding', Custo: 5000, Impressoes: 400000, Cliques: 4000, CTR: '1.00%', CPC: 'R$ 1,25' },
];

export const detailedMetrics = {
  ctr: [
    { date: 'Jan', CTR: 3.5, CPC: 0.80, CPM: 12.5 },
    { date: 'Fev', CTR: 3.8, CPC: 0.75, CPM: 12.0 },
    { date: 'Mar', CTR: 4.2, CPC: 0.70, CPM: 11.5 },
    { date: 'Abr', CTR: 4.0, CPC: 0.72, CPM: 11.8 },
    { date: 'Mai', CTR: 4.5, CPC: 0.65, CPM: 10.5 },
  ],
  bestRoasCampaigns: [
    { name: 'Remarketing', value: 8.5, fill: 'hsl(var(--chart-1))' },
    { name: 'Venda Direta', value: 5.2, fill: 'hsl(var(--chart-2))' },
    { name: 'Topo de Funil', value: 3.1, fill: 'hsl(var(--chart-3))' },
    { name: 'Outras', value: 2.5, fill: 'hsl(var(--chart-4))' },
  ],
  lowestCpaAds: [
    { name: 'Criativo A (Vídeo)', value: 15.50, fill: 'hsl(var(--chart-1))' },
    { name: 'Criativo B (Carrossel)', value: 18.20, fill: 'hsl(var(--chart-2))' },
    { name: 'Criativo C (Estático)', value: 22.00, fill: 'hsl(var(--chart-3))' },
    { name: 'Outros', value: 25.00, fill: 'hsl(var(--chart-4))' },
  ],
  comparisonTable: [
    { id: 1, Campanha: 'Venda Direta - Verão', Checkouts: 500, Gasto: 25000, Receita: 137500, CPL: 50.00, ROAS: 5.5 },
    { id: 2, Campanha: 'Outono Imperdível', Checkouts: 380, Gasto: 18000, Receita: 86400, CPL: 47.37, ROAS: 4.8 },
    { id: 3, Campanha: 'Remarketing - Carrinho', Checkouts: 400, Gasto: 10000, Receita: 92000, CPL: 25.00, ROAS: 9.2 },
    { id: 4, Campanha: 'Captura de Leads', Checkouts: 150, Gasto: 15000, Receita: 60000, CPL: 100.00, ROAS: 4.0 },
  ],
  campaignCostResult: [
    { name: 'Venda Direta', cost: 25000, result: 137500 },
    { name: 'Captura de Leads', cost: 15000, result: 60000 },
    { name: 'Remarketing', cost: 10000, result: 92000 },
    { name: 'Branding', cost: 5000, result: 10000 },
  ],
};


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
      { stage: 'ThruPlay (15s)', value: 45.8 },
      { stage: 'Vv 50%', value: 30.2 },
      { stage: 'Vv 75%', value: 22.5 },
      { stage: 'Vv 100%', value: 15.1 },
    ],
    'Criativo 2': [
      { stage: 'ThruPlay (15s)', value: 55.2 },
      { stage: 'Vv 50%', value: 42.1 },
      { stage: 'Vv 75%', value: 35.7 },
      { stage: 'Vv 100%', value: 28.9 },
    ],
    'Criativo 3': [
      { stage: 'ThruPlay (15s)', value: 35.0 },
      { stage: 'Vv 50%', value: 20.5 },
      { stage: 'Vv 75%', value: 14.3 },
      { stage: 'Vv 100%', value: 8.8 },
    ],
};

export type VideoCreativeType = keyof typeof videoRetentionDataSets;
