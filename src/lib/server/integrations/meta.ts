import { z } from "zod";
import type { BusinessManagerMetrics } from "@/app/dashboard/data";
import type { IntegrationClient, OAuthTokenPayload, SyncOptions } from "./types";

const GRAPH_VERSION = "v21.0";
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_VERSION}`;

const insightsSchema = z.object({
  data: z
    .array(
      z.object({
        spend: z.string().optional(),
        impressions: z.string().optional(),
        clicks: z.string().optional(),
        actions: z
          .array(z.object({
            action_type: z.string(),
            value: z.string().optional(),
          }))
          .optional(),
        action_values: z
          .array(
            z.object({
              action_type: z.string(),
              value: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

const getMetaEnv = () => {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) {
    throw new Error("META_APP_ID e META_APP_SECRET são obrigatórios para autenticação OAuth.");
  }
  return { appId, appSecret };
};

const buildTimeRange = (range?: SyncOptions["dateRange"]) => {
  const from = range?.from ? range.from.toISOString().split("T")[0] : undefined;
  const to = range?.to ? range.to.toISOString().split("T")[0] : undefined;
  return from && to ? { since: from, until: to } : undefined;
};

export class MetaIntegration implements IntegrationClient {
  key = "meta" as const;

  getAuthorizationUrl({ redirectUri, state, scopes }: { redirectUri: string; state: string; scopes?: string[] }): string {
    const { appId } = getMetaEnv();
    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      state,
      response_type: "code",
      scope: (scopes ?? ["ads_read", "ads_management"]).join(","),
    });
    return `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?${params.toString()}`;
  }

  async exchangeCode({ code, redirectUri }: { code: string; redirectUri: string }): Promise<OAuthTokenPayload> {
    const { appId, appSecret } = getMetaEnv();
    const params = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    });

    const response = await fetch(`${GRAPH_BASE_URL}/oauth/access_token?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Falha ao trocar código por token no Meta.");
    }
    const json = await response.json();
    return {
      accessToken: json.access_token,
      tokenType: json.token_type,
      expiresAt: json.expires_in ? Date.now() + json.expires_in * 1000 : undefined,
    };
  }

  async refreshAccessToken(token: OAuthTokenPayload): Promise<OAuthTokenPayload> {
    const { appId, appSecret } = getMetaEnv();
    if (!token.accessToken) throw new Error("Token inválido para renovação no Meta.");

    const params = new URLSearchParams({
      grant_type: "fb_exchange_token",
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: token.accessToken,
    });

    const response = await fetch(`${GRAPH_BASE_URL}/oauth/access_token?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Não foi possível renovar o token do Meta.");
    }
    const json = await response.json();
    return {
      accessToken: json.access_token,
      tokenType: json.token_type,
      expiresAt: json.expires_in ? Date.now() + json.expires_in * 1000 : undefined,
      refreshToken: token.refreshToken,
    };
  }

  async fetchKpis(token: OAuthTokenPayload, options: SyncOptions): Promise<BusinessManagerMetrics | null> {
    if (!options.accountId) return null;
    const params = new URLSearchParams({
      access_token: token.accessToken,
      fields: "spend,impressions,clicks,actions,action_values",
      level: "account",
    });

    const range = buildTimeRange(options.dateRange);
    if (range) {
      params.set("time_range", JSON.stringify(range));
    }

    try {
      const response = await fetch(`${GRAPH_BASE_URL}/act_${options.accountId}/insights?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Meta Insights retornou status ${response.status}`);
      }
      const json = insightsSchema.parse(await response.json());
      const [row] = json.data ?? [];
      if (!row) return null;

      const spend = Number(row.spend ?? 0);
      const impressions = Number(row.impressions ?? 0);
      const clicks = Number(row.clicks ?? 0);

      const conversions = row.actions?.reduce((acc, action) => {
        if (action.action_type?.toLowerCase().includes("purchase")) {
          return acc + Number(action.value ?? 0);
        }
        return acc;
      }, 0) ?? 0;

      const revenue = row.action_values?.reduce((acc, action) => {
        if (action.action_type?.toLowerCase().includes("purchase")) {
          return acc + Number(action.value ?? 0);
        }
        return acc;
      }, 0) ?? 0;

      return {
        cost: spend,
        impressions,
        clicks,
        conversions,
        revenue,
      };
    } catch (error) {
      console.error("[MetaIntegration] Falha ao buscar KPIs:", error);
      return null;
    }
  }
}
