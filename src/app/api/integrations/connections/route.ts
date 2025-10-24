import { NextResponse } from "next/server";

import type { PlatformKey } from "@/app/dashboard/data";
import { getPlatformDefinitions } from "@/app/dashboard/data";
import { TokenStore } from "@/lib/server/token-store";

const platforms: PlatformKey[] = ["meta", "google", "tiktok"];

const store = new TokenStore();

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

    return NextResponse.json({
      connections,
      definitions: getPlatformDefinitions(),
    });
  } catch (error: any) {
    console.error("[API] integrations/connections erro:", error);
    return NextResponse.json(
      { message: error?.message ?? "Erro ao carregar conexões." },
      { status: 500 }
    );
  }
}
