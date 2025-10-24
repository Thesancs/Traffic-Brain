import type { BusinessManagerMetrics } from "@/app/dashboard/data";
import type { IntegrationClient, OAuthTokenPayload, SyncOptions } from "./types";

const TIKTOK_AUTH_URL = "https://business-api.tiktok.com/open_api/v1.3/oauth2/authorize";
const TIKTOK_TOKEN_URL = "https://business-api.tiktok.com/open_api/v1.3/oauth2/token";
const TIKTOK_REPORT_URL = "https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/";

const getTikTokEnv = () => {
  const appId = process.env.TIKTOK_APP_ID;
  const appSecret = process.env.TIKTOK_APP_SECRET;
  if (!appId || !appSecret) {
    throw new Error("Configure TIKTOK_APP_ID e TIKTOK_APP_SECRET para autenticação.");
  }
  return { appId, appSecret };
};

const buildDateRange = (range?: SyncOptions["dateRange"]) => {
  const start = range?.from ? range.from.toISOString().split("T")[0] : undefined;
  const end = range?.to ? range.to.toISOString().split("T")[0] : undefined;
  if (!start || !end) return undefined;
  return { start_date: start, end_date: end };
};

export class TikTokIntegration implements IntegrationClient {
  key = "tiktok" as const;

  getAuthorizationUrl({ redirectUri, state, scopes }: { redirectUri: string; state: string; scopes?: string[] }): string {
    const { appId } = getTikTokEnv();
    const params = new URLSearchParams({
      app_id: appId,
      redirect_uri: redirectUri,
      state,
      scope: (scopes ?? ["ads.read", "ads.management"]).join(","),
      response_type: "code",
    });
    return `${TIKTOK_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCode({ code, redirectUri }: { code: string; redirectUri: string }): Promise<OAuthTokenPayload> {
    const { appId, appSecret } = getTikTokEnv();
    const response = await fetch(TIKTOK_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: appId,
        secret: appSecret,
        auth_code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error("Falha ao trocar código por token no TikTok.");
    }

    const json = await response.json();
    const data = json.data ?? {};
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
      scopes: data.scope?.split(","),
      tokenType: "Bearer",
    };
  }

  async refreshAccessToken(token: OAuthTokenPayload): Promise<OAuthTokenPayload> {
    const { appId, appSecret } = getTikTokEnv();
    if (!token.refreshToken) throw new Error("Refresh token obrigatório para o TikTok Ads.");

    const response = await fetch(TIKTOK_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: appId,
        secret: appSecret,
        refresh_token: token.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Não foi possível renovar o token do TikTok.");
    }

    const json = await response.json();
    const data = json.data ?? {};
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
      scopes: data.scope?.split(","),
      tokenType: "Bearer",
    };
  }

  async fetchKpis(token: OAuthTokenPayload, options: SyncOptions): Promise<BusinessManagerMetrics | null> {
    if (!options.accountId) return null;

    const payload = {
      advertiser_id: options.accountId,
      report_type: "BASIC",
      data_level: "AUCTION_CAMPAIGN",
      dimensions: ["stat_time_day"],
      metrics: ["spend", "impressions", "clicks", "conversions", "cost_per_conversion", "result"],
      filter: buildDateRange(options.dateRange),
    };

    try {
      const response = await fetch(TIKTOK_REPORT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`TikTok API retornou ${response.status}`);
      }

      const json = await response.json();
      const list: Array<Record<string, any>> = json.data?.list ?? [];
      if (!list.length) return null;

      const aggregate = list.reduce<BusinessManagerMetrics>(
        (acc, row) => {
          acc.cost += Number(row.spend ?? 0);
          acc.impressions += Number(row.impressions ?? 0);
          acc.clicks += Number(row.clicks ?? 0);
          acc.conversions += Number(row.conversions ?? row.result ?? 0);
          acc.revenue += Number(row.conversion_value ?? row.total_complete_payment ?? 0);
          return acc;
        },
        { cost: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
      );

      return aggregate;
    } catch (error) {
      console.error("[TikTokIntegration] Falha ao buscar KPIs:", error);
      return null;
    }
  }
}
