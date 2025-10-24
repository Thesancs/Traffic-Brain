import { addDays, formatISO } from "date-fns";

export type PlatformKey = "meta" | "google" | "tiktok";

export type DateRange = {
  from?: Date;
  to?: Date;
};

export type DailyData = {
  date: string;
  spend: number;
  conversions: number;
  revenue: number;
  platform: PlatformKey;
  businessManagerId: string;
};

export type PieSlice = {
  name: string;
  value: number;
  fill: string;
};

export type BusinessManagerMetrics = {
  cost: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
};

export type BusinessManager = {
  id: string;
  name: string;
  accountId: string;
  metrics: BusinessManagerMetrics;
  daily: DailyData[];
  distribution: PieSlice[];
};

export type PlatformDefinition = {
  key: PlatformKey;
  label: string;
  color: string;
  businessManagers: BusinessManager[];
};

const buildDailySeries = (
  platform: PlatformKey,
  businessManagerId: string,
  start: Date,
  values: Array<{ spend: number; conversions: number; revenue: number }>
): DailyData[] =>
  values.map((value, index) => ({
    date: formatISO(addDays(start, index), { representation: "date" }),
    platform,
    businessManagerId,
    ...value,
  }));

const platformPalette: Record<PlatformKey, string> = {
  meta: "hsl(var(--chart-1))",
  google: "hsl(var(--chart-2))",
  tiktok: "hsl(var(--chart-3))",
};

export const platformDefinitions: Record<PlatformKey, PlatformDefinition> = {
  meta: {
    key: "meta",
    label: "Meta Ads",
    color: platformPalette.meta,
    businessManagers: [
      {
        id: "meta-bm-1",
        name: "Ecommerce Brasil",
        accountId: "1234567890",
        metrics: {
          cost: 75230,
          impressions: 1820000,
          clicks: 34200,
          conversions: 2180,
          revenue: 248700,
        },
        daily: buildDailySeries(
          "meta",
          "meta-bm-1",
          new Date(2024, 8, 26),
          [
            { spend: 4200, conversions: 110, revenue: 13400 },
            { spend: 4650, conversions: 118, revenue: 14120 },
            { spend: 3980, conversions: 102, revenue: 12780 },
            { spend: 4880, conversions: 130, revenue: 15050 },
            { spend: 4720, conversions: 128, revenue: 14680 },
            { spend: 4390, conversions: 121, revenue: 13800 },
            { spend: 5120, conversions: 136, revenue: 15620 },
            { spend: 5010, conversions: 134, revenue: 15220 },
            { spend: 4860, conversions: 129, revenue: 14870 },
            { spend: 5130, conversions: 141, revenue: 16040 },
            { spend: 4980, conversions: 137, revenue: 15530 },
            { spend: 5200, conversions: 144, revenue: 16380 },
            { spend: 5025, conversions: 138, revenue: 15700 },
            { spend: 4925, conversions: 135, revenue: 15080 },
          ]
        ),
        distribution: [
          { name: "Conversão", value: 38, fill: "hsl(var(--chart-1))" },
          { name: "Topo de Funil", value: 24, fill: "hsl(var(--chart-5))" },
          { name: "Remarketing", value: 22, fill: "hsl(var(--chart-3))" },
          { name: "Awareness", value: 16, fill: "hsl(var(--chart-4))" },
        ],
      },
      {
        id: "meta-bm-2",
        name: "Produtos Digitais LATAM",
        accountId: "9876543210",
        metrics: {
          cost: 38210,
          impressions: 920000,
          clicks: 19420,
          conversions: 920,
          revenue: 118400,
        },
        daily: buildDailySeries(
          "meta",
          "meta-bm-2",
          new Date(2024, 8, 26),
          [
            { spend: 2100, conversions: 52, revenue: 5600 },
            { spend: 2350, conversions: 55, revenue: 5900 },
            { spend: 1980, conversions: 49, revenue: 5200 },
            { spend: 2560, conversions: 60, revenue: 6400 },
            { spend: 2440, conversions: 57, revenue: 6100 },
            { spend: 2260, conversions: 54, revenue: 5840 },
            { spend: 2680, conversions: 62, revenue: 6750 },
            { spend: 2610, conversions: 61, revenue: 6600 },
            { spend: 2490, conversions: 59, revenue: 6320 },
            { spend: 2700, conversions: 64, revenue: 7020 },
            { spend: 2580, conversions: 62, revenue: 6880 },
            { spend: 2740, conversions: 65, revenue: 7160 },
            { spend: 2650, conversions: 63, revenue: 6980 },
            { spend: 2590, conversions: 61, revenue: 6840 },
          ]
        ),
        distribution: [
          { name: "Leads", value: 41, fill: "hsl(var(--chart-2))" },
          { name: "Mensagens", value: 28, fill: "hsl(var(--chart-6))" },
          { name: "Remarketing", value: 21, fill: "hsl(var(--chart-4))" },
          { name: "Teste A/B", value: 10, fill: "hsl(var(--chart-1))" },
        ],
      },
    ],
  },
  google: {
    key: "google",
    label: "Google Ads",
    color: platformPalette.google,
    businessManagers: [
      {
        id: "google-bm-1",
        name: "Retail Search BR",
        accountId: "3456123498",
        metrics: {
          cost: 98500,
          impressions: 2400000,
          clicks: 420000,
          conversions: 16200,
          revenue: 312000,
        },
        daily: buildDailySeries(
          "google",
          "google-bm-1",
          new Date(2024, 8, 26),
          [
            { spend: 5200, conversions: 410, revenue: 8200 },
            { spend: 5450, conversions: 430, revenue: 8600 },
            { spend: 4980, conversions: 405, revenue: 8020 },
            { spend: 5620, conversions: 450, revenue: 9100 },
            { spend: 5480, conversions: 442, revenue: 8920 },
            { spend: 5320, conversions: 435, revenue: 8700 },
            { spend: 5880, conversions: 468, revenue: 9400 },
            { spend: 5760, conversions: 462, revenue: 9240 },
            { spend: 5640, conversions: 455, revenue: 9050 },
            { spend: 5920, conversions: 478, revenue: 9520 },
            { spend: 5780, conversions: 470, revenue: 9340 },
            { spend: 6040, conversions: 486, revenue: 9680 },
            { spend: 5960, conversions: 482, revenue: 9560 },
            { spend: 5880, conversions: 476, revenue: 9420 },
          ]
        ),
        distribution: [
          { name: "Pesquisa", value: 46, fill: "hsl(var(--chart-2))" },
          { name: "Shopping", value: 27, fill: "hsl(var(--chart-7))" },
          { name: "Display", value: 17, fill: "hsl(var(--chart-5))" },
          { name: "Vídeo", value: 10, fill: "hsl(var(--chart-6))" },
        ],
      },
      {
        id: "google-bm-2",
        name: "Apps Performance",
        accountId: "9988776655",
        metrics: {
          cost: 45120,
          impressions: 1350000,
          clicks: 286000,
          conversions: 6800,
          revenue: 126400,
        },
        daily: buildDailySeries(
          "google",
          "google-bm-2",
          new Date(2024, 8, 26),
          [
            { spend: 2600, conversions: 190, revenue: 4400 },
            { spend: 2740, conversions: 198, revenue: 4600 },
            { spend: 2480, conversions: 182, revenue: 4200 },
            { spend: 2860, conversions: 205, revenue: 4760 },
            { spend: 2780, conversions: 201, revenue: 4680 },
            { spend: 2660, conversions: 196, revenue: 4520 },
            { spend: 2940, conversions: 212, revenue: 4920 },
            { spend: 2880, conversions: 208, revenue: 4840 },
            { spend: 2800, conversions: 204, revenue: 4720 },
            { spend: 2980, conversions: 214, revenue: 4980 },
            { spend: 2860, conversions: 207, revenue: 4860 },
            { spend: 3040, conversions: 218, revenue: 5060 },
            { spend: 2960, conversions: 213, revenue: 4940 },
            { spend: 2920, conversions: 210, revenue: 4880 },
          ]
        ),
        distribution: [
          { name: "Apps", value: 52, fill: "hsl(var(--chart-3))" },
          { name: "Performance Max", value: 31, fill: "hsl(var(--chart-8))" },
          { name: "Display", value: 12, fill: "hsl(var(--chart-6))" },
          { name: "Outros", value: 5, fill: "hsl(var(--chart-4))" },
        ],
      },
    ],
  },
  tiktok: {
    key: "tiktok",
    label: "TikTok Ads",
    color: platformPalette.tiktok,
    businessManagers: [
      {
        id: "tiktok-bm-1",
        name: "Creator Commerce",
        accountId: "5544332211",
        metrics: {
          cost: 41200,
          impressions: 980000,
          clicks: 128000,
          conversions: 5400,
          revenue: 94800,
        },
        daily: buildDailySeries(
          "tiktok",
          "tiktok-bm-1",
          new Date(2024, 8, 26),
          [
            { spend: 2100, conversions: 170, revenue: 3800 },
            { spend: 2280, conversions: 182, revenue: 4000 },
            { spend: 1960, conversions: 160, revenue: 3520 },
            { spend: 2360, conversions: 188, revenue: 4140 },
            { spend: 2290, conversions: 184, revenue: 4040 },
            { spend: 2210, conversions: 179, revenue: 3920 },
            { spend: 2440, conversions: 195, revenue: 4280 },
            { spend: 2380, conversions: 192, revenue: 4200 },
            { spend: 2320, conversions: 188, revenue: 4100 },
            { spend: 2460, conversions: 198, revenue: 4360 },
            { spend: 2390, conversions: 193, revenue: 4240 },
            { spend: 2520, conversions: 202, revenue: 4440 },
            { spend: 2450, conversions: 198, revenue: 4320 },
            { spend: 2400, conversions: 195, revenue: 4260 },
          ]
        ),
        distribution: [
          { name: "Spark Ads", value: 34, fill: "hsl(var(--chart-9))" },
          { name: "Live Shopping", value: 26, fill: "hsl(var(--chart-3))" },
          { name: "Lead Ads", value: 21, fill: "hsl(var(--chart-6))" },
          { name: "Awareness", value: 19, fill: "hsl(var(--chart-1))" },
        ],
      },
      {
        id: "tiktok-bm-2",
        name: "Latam Growth",
        accountId: "6655443311",
        metrics: {
          cost: 28640,
          impressions: 620000,
          clicks: 88000,
          conversions: 3180,
          revenue: 64200,
        },
        daily: buildDailySeries(
          "tiktok",
          "tiktok-bm-2",
          new Date(2024, 8, 26),
          [
            { spend: 1500, conversions: 110, revenue: 2600 },
            { spend: 1620, conversions: 118, revenue: 2760 },
            { spend: 1420, conversions: 102, revenue: 2400 },
            { spend: 1700, conversions: 124, revenue: 2880 },
            { spend: 1650, conversions: 120, revenue: 2800 },
            { spend: 1580, conversions: 116, revenue: 2680 },
            { spend: 1760, conversions: 128, revenue: 2940 },
            { spend: 1720, conversions: 124, revenue: 2880 },
            { spend: 1660, conversions: 121, revenue: 2760 },
            { spend: 1780, conversions: 130, revenue: 2980 },
            { spend: 1710, conversions: 125, revenue: 2860 },
            { spend: 1840, conversions: 134, revenue: 3060 },
            { spend: 1760, conversions: 129, revenue: 2940 },
            { spend: 1720, conversions: 126, revenue: 2880 },
          ]
        ),
        distribution: [
          { name: "Conversão", value: 39, fill: "hsl(var(--chart-10))" },
          { name: "Lead", value: 25, fill: "hsl(var(--chart-5))" },
          { name: "Live", value: 21, fill: "hsl(var(--chart-8))" },
          { name: "Reach", value: 15, fill: "hsl(var(--chart-4))" },
        ],
      },
    ],
  },
};

export type AggregatedTotals = {
  cost: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
};

export type AggregatedKpis = AggregatedTotals & {
  cpm: number;
  ctr: number;
  cpa: number;
};

const sumReducer = (acc: number, value: number) => acc + value;

const round = (value: number) => Number(value.toFixed(2));

type ManagerScaling = {
  spend: number;
  conversions: number;
  revenue: number;
};

const managerScaleCache = new Map<string, ManagerScaling>();

const computeManagerScale = (manager: BusinessManager): ManagerScaling => {
  const totals = manager.daily.reduce(
    (acc, item) => {
      acc.spend += item.spend;
      acc.conversions += item.conversions;
      acc.revenue += item.revenue;
      return acc;
    },
    { spend: 0, conversions: 0, revenue: 0 }
  );

  const normalize = (target: number, source: number) => {
    if (source <= 0 || !Number.isFinite(source)) return 1;
    const ratio = target / source;
    return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  };

  return {
    spend: normalize(manager.metrics.cost, totals.spend),
    conversions: normalize(manager.metrics.conversions, totals.conversions),
    revenue: normalize(manager.metrics.revenue, totals.revenue),
  };
};

const getManagerScale = (manager: BusinessManager): ManagerScaling => {
  const cached = managerScaleCache.get(manager.id);
  if (cached) return cached;
  const scale = computeManagerScale(manager);
  managerScaleCache.set(manager.id, scale);
  return scale;
};

const deriveRates = ({ cost, impressions, clicks, conversions }: AggregatedTotals) => ({
  cpm: impressions > 0 ? round((cost / impressions) * 1000) : 0,
  ctr: impressions > 0 ? round((clicks / impressions) * 100) : 0,
  cpa: conversions > 0 ? round(cost / conversions) : 0,
});

const filterDailyByRange = (daily: DailyData[], range?: DateRange) => {
  if (!range?.from && !range?.to) return daily;
  const fromTime = range?.from ? range.from.setHours(0, 0, 0, 0) : undefined;
  const toTime = range?.to ? range.to.setHours(23, 59, 59, 999) : undefined;

  return daily.filter((item) => {
    const time = new Date(item.date).getTime();
    if (fromTime !== undefined && time < fromTime) return false;
    if (toTime !== undefined && time > toTime) return false;
    return true;
  });
};

export const getDefaultSelections = () =>
  Object.fromEntries(
    (Object.keys(platformDefinitions) as PlatformKey[]).map((key) => {
      const [first] = platformDefinitions[key].businessManagers;
      return [key, first?.id ?? ""];
    })
  ) as Record<PlatformKey, string>;

export const aggregateKpis = (
  platforms: PlatformKey[],
  selections: Record<PlatformKey, string>,
  range?: DateRange
): AggregatedKpis => {
  const totals = platforms.reduce<AggregatedTotals>(
    (acc, platformKey) => {
      const platform = platformDefinitions[platformKey];
      const manager = platform.businessManagers.find((item) => item.id === selections[platformKey]);
      if (!manager) return acc;

      const filteredDaily = filterDailyByRange(manager.daily, range);
      const hasFilteredData = filteredDaily.length > 0;
      const spendTotal = filteredDaily.map((item) => item.spend).reduce(sumReducer, 0);
      const conversionsTotal = filteredDaily.map((item) => item.conversions).reduce(sumReducer, 0);
      const revenueTotal = filteredDaily.map((item) => item.revenue).reduce(sumReducer, 0);
      const scale = getManagerScale(manager);

      const adjustedSpend = hasFilteredData ? spendTotal * scale.spend : manager.metrics.cost;
      const adjustedConversions = hasFilteredData
        ? conversionsTotal * scale.conversions
        : manager.metrics.conversions;
      const adjustedRevenue = hasFilteredData ? revenueTotal * scale.revenue : manager.metrics.revenue;

      acc.cost += adjustedSpend;
      acc.impressions += manager.metrics.impressions;
      acc.clicks += manager.metrics.clicks;
      acc.conversions += adjustedConversions;
      acc.revenue += adjustedRevenue;
      return acc;
    },
    { cost: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );

  const rates = deriveRates(totals);
  return { ...totals, ...rates };
};

export const aggregateDailySeries = (
  platforms: PlatformKey[],
  selections: Record<PlatformKey, string>,
  range?: DateRange
) => {
  const data = platforms
    .map((platformKey) => {
      const platform = platformDefinitions[platformKey];
      const manager = platform.businessManagers.find((item) => item.id === selections[platformKey]);
      if (!manager) return [] as DailyData[];
      const scale = getManagerScale(manager);
      return filterDailyByRange(manager.daily, range).map((item) => ({
        ...item,
        spend: item.spend * scale.spend,
        conversions: item.conversions * scale.conversions,
        revenue: item.revenue * scale.revenue,
      }));
    })
    .flat();

  const grouped = data.reduce<Record<string, { spend: number; conversions: number; revenue: number }>>((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = { spend: 0, conversions: 0, revenue: 0 };
    }
    acc[item.date].spend += item.spend;
    acc[item.date].conversions += item.conversions;
    acc[item.date].revenue += item.revenue;
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, values]) => ({
      date,
      spend: round(values.spend),
      conversions: Math.round(values.conversions),
      revenue: round(values.revenue),
      platform: "meta",
      businessManagerId: "aggregated",
    }));
};

export type ExportRow = {
  Plataforma: string;
  "Business Manager": string;
  Custo: number;
  CPM: number;
  CTR: number;
  "Conversões": number;
  "CPA Médio": number;
  Faturamento: number;
};

export const buildExportRows = (
  platforms: PlatformKey[],
  selections: Record<PlatformKey, string>,
  range?: DateRange
): ExportRow[] => {
  return platforms.map((platformKey) => {
    const platform = platformDefinitions[platformKey];
    const manager = platform.businessManagers.find((item) => item.id === selections[platformKey]);
    if (!manager) {
      return {
        Plataforma: platform.label,
        "Business Manager": "Não configurado",
        Custo: 0,
        CPM: 0,
        CTR: 0,
        "Conversões": 0,
        "CPA Médio": 0,
        Faturamento: 0,
      };
    }

    const totals = aggregateKpis([platformKey], selections, range);

    return {
      Plataforma: platform.label,
      "Business Manager": manager.name,
      Custo: round(totals.cost),
      CPM: round(totals.cpm),
      CTR: round(totals.ctr),
      "Conversões": Math.round(totals.conversions),
      "CPA Médio": round(totals.cpa),
      Faturamento: round(totals.revenue),
    };
  });
};

export const getDistributionForSelection = (
  platforms: PlatformKey[],
  selections: Record<PlatformKey, string>
): PieSlice[] => {
  return platforms.flatMap((platformKey) => {
    const platform = platformDefinitions[platformKey];
    const manager = platform.businessManagers.find((item) => item.id === selections[platformKey]);
    return manager?.distribution ?? [];
  });
};

export const ensureValidPlatforms = (platforms: PlatformKey[]): PlatformKey[] => {
  if (platforms.length > 0) {
    return platforms;
  }
  return ["meta"] as PlatformKey[];
};
