import type { BusinessManagerMetrics } from "@/app/dashboard/data";
import type { IntegrationClient, OAuthTokenPayload, SyncOptions } from "./types";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_API_VERSION = "v17";

const getGoogleEnv = () => {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;

  if (!clientId || !clientSecret || !developerToken) {
    throw new Error("Credenciais do Google Ads incompletas. Configure GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET e GOOGLE_ADS_DEVELOPER_TOKEN.");
  }

  return { clientId, clientSecret, developerToken, loginCustomerId };
};

const buildDateRangeClause = (range?: SyncOptions["dateRange"]) => {
  const start = range?.from ? range.from.toISOString().split("T")[0] : undefined;
  const end = range?.to ? range.to.toISOString().split("T")[0] : undefined;
  if (!start || !end) return "LAST_30_DAYS";
  return `{ start_date: '${start}', end_date: '${end}' }`;
};

export class GoogleAdsIntegration implements IntegrationClient {
  key = "google" as const;

  getAuthorizationUrl({ redirectUri, state, scopes }: { redirectUri: string; state: string; scopes?: string[] }): string {
    const { clientId } = getGoogleEnv();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      access_type: "offline",
      state,
      include_granted_scopes: "true",
      prompt: "consent",
      scope: (scopes ?? [
        "https://www.googleapis.com/auth/adwords",
      ]).join(" "),
    });
    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCode({ code, redirectUri }: { code: string; redirectUri: string }): Promise<OAuthTokenPayload> {
    const { clientId, clientSecret } = getGoogleEnv();
    const body = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      throw new Error("Não foi possível obter o token do Google Ads.");
    }

    const json = await response.json();
    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresAt: json.expires_in ? Date.now() + json.expires_in * 1000 : undefined,
      tokenType: json.token_type,
      scopes: json.scope?.split(" "),
    };
  }

  async refreshAccessToken(token: OAuthTokenPayload): Promise<OAuthTokenPayload> {
    const { clientId, clientSecret } = getGoogleEnv();
    if (!token.refreshToken) throw new Error("Refresh token obrigatório para renovar acesso ao Google Ads.");

    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    });

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      throw new Error("Falha ao renovar token do Google Ads.");
    }

    const json = await response.json();
    return {
      accessToken: json.access_token,
      refreshToken: token.refreshToken,
      expiresAt: json.expires_in ? Date.now() + json.expires_in * 1000 : undefined,
      tokenType: json.token_type,
      scopes: json.scope?.split(" "),
    };
  }

  async fetchKpis(token: OAuthTokenPayload, options: SyncOptions): Promise<BusinessManagerMetrics | null> {
    if (!options.accountId) return null;
    const { developerToken, loginCustomerId } = getGoogleEnv();

    const query = `
      SELECT
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversion_value,
        metrics.clicks,
        metrics.impressions
      FROM customer
      WHERE segments.date DURING ${buildDateRangeClause(options.dateRange)}
    `;

    const endpoint = `https://googleads.googleapis.com/${GOOGLE_API_VERSION}/customers/${options.accountId}/googleAds:searchStream`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "developer-token": developerToken,
          "Content-Type": "application/json",
          ...(loginCustomerId ? { "login-customer-id": loginCustomerId } : {}),
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Google Ads API retornou ${response.status}`);
      }

      const stream = (await response.json()) as Array<{ results?: Array<{ metrics?: Record<string, any> }> }>;
      const totals = stream.flatMap((chunk) => chunk.results ?? []);
      if (!totals.length) return null;

      const aggregate = totals.reduce(
        (acc, result) => {
          const metrics = result.metrics ?? {};
          acc.cost += Number(metrics.costMicros ?? metrics.cost_micros ?? 0) / 1_000_000;
          acc.revenue += Number(metrics.conversionValue ?? metrics.conversion_value ?? 0);
          acc.conversions += Number(metrics.conversions ?? 0);
          acc.clicks += Number(metrics.clicks ?? 0);
          acc.impressions += Number(metrics.impressions ?? 0);
          return acc;
        },
        { cost: 0, revenue: 0, conversions: 0, clicks: 0, impressions: 0 }
      );

      return aggregate;
    } catch (error) {
      console.error("[GoogleAdsIntegration] Falha ao buscar KPIs:", error);
      return null;
    }
  }
}
