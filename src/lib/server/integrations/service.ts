import {
  aggregateDailySeries,
  aggregateKpis,
  ensureValidPlatforms,
  getDistributionForSelection,
  getPlatformDefinitions,
  type AggregatedKpis,
  type AggregatedTotals,
  type DateRange,
  type PlatformKey,
} from "@/app/dashboard/data";
import { TokenStore, type StoredTokenRecord } from "../token-store";
import { getIntegrationClient } from "./registry";
import type { OAuthTokenPayload, SyncOptions } from "./types";

const round = (value: number) => Number(value.toFixed(2));

const combineTotals = (entries: AggregatedTotals[]): AggregatedTotals =>
  entries.reduce(
    (acc, item) => ({
      cost: acc.cost + item.cost,
      impressions: acc.impressions + item.impressions,
      clicks: acc.clicks + item.clicks,
      conversions: acc.conversions + item.conversions,
      revenue: acc.revenue + item.revenue,
    }),
    { cost: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );

const deriveRates = (totals: AggregatedTotals): AggregatedKpis => ({
  ...totals,
  cpm: totals.impressions > 0 ? round((totals.cost / totals.impressions) * 1000) : 0,
  ctr: totals.impressions > 0 ? round((totals.clicks / totals.impressions) * 100) : 0,
  cpa: totals.conversions > 0 ? round(totals.cost / totals.conversions) : 0,
});

type SnapshotInput = {
  platforms: PlatformKey[];
  selections: Record<PlatformKey, string>;
  range?: DateRange;
};

type LiveMetric = {
  platform: PlatformKey;
  totals: AggregatedTotals;
  source: "api" | "fallback";
};

export class IntegrationService {
  private store: TokenStore;

  constructor(store = new TokenStore()) {
    this.store = store;
  }

  async registerToken(record: StoredTokenRecord) {
    await this.store.set(record);
  }

  async revokeToken(platform: PlatformKey, identifier: string) {
    await this.store.delete(platform, identifier);
  }

  private async fetchLiveMetrics(platform: PlatformKey, managerId: string, range?: DateRange): Promise<LiveMetric | null> {
    const platformDef = getPlatformDefinitions()[platform];
    const manager = platformDef.businessManagers.find((item) => item.id === managerId);
    if (!manager) return null;

    const stored = await this.store.get(platform, manager.accountId);
    if (!stored) return null;

    const client = getIntegrationClient(platform);
    if (!client) return null;

    const token = stored.token;
    const options: SyncOptions = {
      accountId: stored.metadata?.accountId ?? manager.accountId,
      businessManagerId: managerId,
      dateRange: range,
    };

    try {
      const metrics = await client.fetchKpis(token as OAuthTokenPayload, options);
      if (!metrics) return null;
      return {
        platform,
        totals: {
          cost: metrics.cost,
          impressions: metrics.impressions,
          clicks: metrics.clicks,
          conversions: metrics.conversions,
          revenue: metrics.revenue,
        },
        source: "api",
      };
    } catch (error) {
      console.error(`[IntegrationService] Falha ao sincronizar ${platform}:`, error);
      return null;
    }
  }

  async getSnapshot({ platforms, selections, range }: SnapshotInput) {
    const validPlatforms: PlatformKey[] = ensureValidPlatforms(platforms);
    const liveResults = await Promise.all(
      validPlatforms.map((platform) => this.fetchLiveMetrics(platform, selections[platform], range))
    );

    const totalsPerPlatform: AggregatedTotals[] = [];

    validPlatforms.forEach((platform, index) => {
      const live = liveResults[index];
      if (live) {
        totalsPerPlatform.push(live.totals);
      } else {
        const fallback = aggregateKpis([platform], selections, range);
        totalsPerPlatform.push({
          cost: fallback.cost,
          impressions: fallback.impressions,
          clicks: fallback.clicks,
          conversions: fallback.conversions,
          revenue: fallback.revenue,
        });
      }
    });

    const combined = combineTotals(totalsPerPlatform);
    const kpis = deriveRates(combined);

    return {
      kpis,
      daily: aggregateDailySeries(validPlatforms, selections, range),
      distribution: getDistributionForSelection(validPlatforms, selections),
      hasLiveData: liveResults.some(Boolean),
    };
  }
}
