import { NextResponse } from "next/server";

import type { PlatformKey } from "@/app/dashboard/data";
import { getPlatformDefinitions } from "@/app/dashboard/data";
import { TokenStore } from "@/lib/server/token-store";
import { SyncHistoryStore, toSyncMetadata } from "@/lib/server/sync-history";

const platforms: PlatformKey[] = ["meta", "google", "tiktok"];

const store = new TokenStore();
const history = new SyncHistoryStore();

export async function GET() {
  try {
    const connections = {} as Record<
      PlatformKey,
      Array<{ accountId: string; businessManagerId: string; name: string }>
    >;

    for (const platform of platforms) {
      const records = await store.list(platform);
      connections[platform] = records.map((record) => ({
        accountId: record.metadata?.accountId ?? record.identifier,
        businessManagerId: record.metadata?.businessManagerId ?? record.identifier,
        name: record.metadata?.businessManagerName ?? record.identifier,
      }));
    }

    const syncedAt = await history.list(platforms);

    return NextResponse.json({
      connections,
      definitions: getPlatformDefinitions(),
      syncedAt: Object.fromEntries(
        platforms.map((platform) => [platform, toSyncMetadata(syncedAt[platform])])
      ) as Record<PlatformKey, ReturnType<typeof toSyncMetadata>>,
    });
  } catch (error: any) {
    console.error("[API] integrations/connections erro:", error);
    return NextResponse.json(
      { message: error?.message ?? "Erro ao carregar conexões." },
      { status: 500 }
    );
  }
}
