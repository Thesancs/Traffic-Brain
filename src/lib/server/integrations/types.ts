import type { BusinessManagerMetrics, DateRange, PlatformKey } from "@/app/dashboard/data";

export type OAuthTokenPayload = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  scopes?: string[];
  tokenType?: string;
};

export type SyncOptions = {
  businessManagerId?: string;
  accountId?: string;
  dateRange?: DateRange;
};

export interface IntegrationClient {
  key: PlatformKey;
  getAuthorizationUrl(params: { redirectUri: string; state: string; scopes?: string[] }): string;
  exchangeCode(params: { code: string; redirectUri: string }): Promise<OAuthTokenPayload>;
  refreshAccessToken(token: OAuthTokenPayload): Promise<OAuthTokenPayload>;
  fetchKpis(token: OAuthTokenPayload, options: SyncOptions): Promise<BusinessManagerMetrics | null>;
}

export type SyncResult = {
  platform: PlatformKey;
  metrics: BusinessManagerMetrics;
  source: "api" | "fallback";
};
