export type DailyData = {
  date: string;
  spend: number;
  conversions: number;
  revenue: number;
};

export const mockChartData: DailyData[] = [
  { date: "Oct 1", spend: 1200, conversions: 30, revenue: 3000 },
  { date: "Oct 2", spend: 1500, conversions: 40, revenue: 4000 },
  { date: "Oct 3", spend: 1100, conversions: 28, revenue: 3200 },
  { date: "Oct 4", spend: 1800, conversions: 55, revenue: 5500 },
  { date: "Oct 5", spend: 1600, conversions: 45, revenue: 4800 },
  { date: "Oct 6", spend: 2000, conversions: 60, revenue: 6200 },
  { date: "Oct 7", spend: 1400, conversions: 35, revenue: 3800 },
  { date: "Oct 8", spend: 2200, conversions: 65, revenue: 7000 },
  { date: "Oct 9", spend: 1900, conversions: 50, revenue: 5800 },
  { date: "Oct 10", spend: 2500, conversions: 75, revenue: 8000 },
  { date: "Oct 11", spend: 2300, conversions: 70, revenue: 7500 },
  { date: "Oct 12", spend: 2100, conversions: 62, revenue: 6800 },
  { date: "Oct 13", spend: 2800, conversions: 80, revenue: 9000 },
  { date: "Oct 14", spend: 2600, conversions: 78, revenue: 8500 },
  { date: "Oct 15", spend: 3000, conversions: 90, revenue: 10000 },
];

export type KpiData = {
  totalInvestment: number;
  totalLeads: number;
  estimatedRevenue: number;
  averageRoas: number;
  cpl: number;
};

export const calculateKpis = (data: DailyData[]): KpiData => {
  const totals = data.reduce(
    (acc, item) => {
      acc.spend += item.spend;
      acc.conversions += item.conversions;
      acc.revenue += item.revenue;
      return acc;
    },
    { spend: 0, conversions: 0, revenue: 0 }
  );

  const totalInvestment = totals.spend;
  const totalLeads = totals.conversions;
  const estimatedRevenue = totals.revenue;
  const averageRoas =
    totalInvestment > 0 ? estimatedRevenue / totalInvestment : 0;
  const cpl = totalLeads > 0 ? totalInvestment / totalLeads : 0;

  return {
    totalInvestment,
    totalLeads,
    estimatedRevenue,
    averageRoas,
    cpl,
  };
};
