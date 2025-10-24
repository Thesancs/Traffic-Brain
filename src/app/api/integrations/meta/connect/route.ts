import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { BusinessManager, PieSlice } from "@/app/dashboard/data";
import { setDynamicBusinessManagers } from "@/app/dashboard/data";
import { MetaIntegration } from "@/lib/server/integrations/meta";
import { SyncHistoryStore } from "@/lib/server/sync-history";
import { TokenStore } from "@/lib/server/token-store";

const integration = new MetaIntegration();

const GRAPH_VERSION = "v21.0";
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_VERSION}`;

type MetaAccount = {
  id: string;
  name: string;
  business?: {
    id: string;
    name?: string;
  } | null;
};

type InsightRow = {
  date_start?: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  actions?: Array<{ action_type: string; value?: string }>;
  action_values?: Array<{ action_type: string; value?: string }>;
};

const parseNumber = (value?: string | number | null): number => {
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? Number(parsed) : 0;
};

const buildDistribution = (totals: {
  conversions: number;
  clicks: number;
  impressions: number;
}): PieSlice[] => {
  const slices: PieSlice[] = [];
  if (totals.conversions > 0) {
    slices.push({ name: "Conversões", value: totals.conversions, fill: "hsl(var(--chart-1))" });
  }
  if (totals.clicks > 0) {
    slices.push({ name: "Cliques", value: totals.clicks, fill: "hsl(var(--chart-2))" });
  }
  if (totals.impressions > 0) {
    slices.push({ name: "Impressões", value: totals.impressions, fill: "hsl(var(--chart-3))" });
  }
  return slices.length > 0
    ? slices
    : [
        { name: "Conversões", value: 1, fill: "hsl(var(--chart-1))" },
        { name: "Cliques", value: 1, fill: "hsl(var(--chart-2))" },
        { name: "Impressões", value: 1, fill: "hsl(var(--chart-3))" },
      ];
};

const fetchAdAccounts = async (accessToken: string): Promise<MetaAccount[]> => {
  const params = new URLSearchParams({
    access_token: accessToken,
    fields: "id,name,business{id,name}",
    limit: "200",
  });
  const response = await fetch(`${GRAPH_BASE_URL}/me/adaccounts?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Não foi possível listar as contas de anúncio do Meta.");
  }
  const json = await response.json();
  return (json.data as MetaAccount[]) ?? [];
};

const fetchAccountInsights = async (accessToken: string, accountId: string): Promise<InsightRow[]> => {
  const params = new URLSearchParams({
    access_token: accessToken,
    fields: "spend,impressions,clicks,actions,action_values,date_start",
    time_increment: "1",
    date_preset: "last_14d",
  });
  const response = await fetch(`${GRAPH_BASE_URL}/act_${accountId}/insights?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Não foi possível obter insights para a conta ${accountId}.`);
  }
  const json = await response.json();
  return (json.data as InsightRow[]) ?? [];
};

const buildBusinessManager = (
  account: MetaAccount,
  rows: InsightRow[]
): BusinessManager => {
  const accountId = account.id.replace(/^act_/, "");
  const managerId = `meta-live-${accountId}`;

  const totals = rows.reduce(
    (acc, row) => {
      const conversions = (row.actions ?? []).reduce((sum, action) => {
        return action.action_type?.toLowerCase().includes("purchase") ? sum + parseNumber(action.value) : sum;
      }, 0);
      const revenue = (row.action_values ?? []).reduce((sum, action) => {
        return action.action_type?.toLowerCase().includes("purchase") ? sum + parseNumber(action.value) : sum;
      }, 0);
      return {
        cost: acc.cost + parseNumber(row.spend),
        impressions: acc.impressions + parseNumber(row.impressions),
        clicks: acc.clicks + parseNumber(row.clicks),
        conversions: acc.conversions + conversions,
        revenue: acc.revenue + revenue,
      };
    },
    { cost: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );

  const daily = rows.map((row) => {
    const conversions = (row.actions ?? []).reduce((sum, action) => {
      return action.action_type?.toLowerCase().includes("purchase") ? sum + parseNumber(action.value) : sum;
    }, 0);
    const revenue = (row.action_values ?? []).reduce((sum, action) => {
      return action.action_type?.toLowerCase().includes("purchase") ? sum + parseNumber(action.value) : sum;
    }, 0);
    return {
      date: row.date_start ?? new Date().toISOString().split("T")[0],
      spend: parseNumber(row.spend),
      conversions,
      revenue,
      platform: "meta" as const,
      businessManagerId: managerId,
    };
  });

  return {
    id: managerId,
    name: account.name,
    accountId,
    metrics: {
      cost: totals.cost,
      impressions: totals.impressions,
      clicks: totals.clicks,
      conversions: totals.conversions,
      revenue: totals.revenue,
    },
    daily,
    distribution: buildDistribution({
      conversions: totals.conversions,
      clicks: totals.clicks,
      impressions: totals.impressions,
    }),
  };
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const code = body.code as string | undefined;
  const redirectUri = body.redirectUri as string | undefined;

  if (!code || !redirectUri) {
    return NextResponse.json(
      { message: "code e redirectUri são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const shortLived = await integration.exchangeCode({ code, redirectUri });
    const token = await integration.refreshAccessToken(shortLived);
    const accessToken = token.accessToken;

    const accounts = await fetchAdAccounts(accessToken);
    if (accounts.length === 0) {
      return NextResponse.json(
        { message: "Nenhuma conta de anúncio encontrada para este usuário." },
        { status: 404 }
      );
    }

    const managers: BusinessManager[] = [];
    for (const account of accounts) {
      const rows = await fetchAccountInsights(accessToken, account.id.replace(/^act_/, ""));
      managers.push(buildBusinessManager(account, rows));
    }

    setDynamicBusinessManagers("meta", managers);

    const store = new TokenStore();
    const history = new SyncHistoryStore();
    await Promise.all(
      managers.map((manager) =>
        store.set({
          platform: "meta",
          identifier: manager.accountId,
          token,
          metadata: {
            accountId: manager.accountId,
            businessManagerId: manager.id,
            businessManagerName: manager.name,
          },
        })
      )
    );

    const now = new Date().toISOString();
    await history.set({ platform: "meta", syncedAt: now, source: "api" });

    return NextResponse.json({
      success: true,
      managers: managers.map((manager) => ({
        id: manager.id,
        name: manager.name,
        accountId: manager.accountId,
        business: accounts.find((account) => account.id.replace(/^act_/, "") === manager.accountId)?.business?.name ?? null,
      })),
    });
  } catch (error: any) {
    console.error("[Meta] Falha ao conectar conta:", error);
    return NextResponse.json(
      { message: error?.message ?? "Falha ao conectar com o Meta." },
      { status: 500 }
    );
  }
}
