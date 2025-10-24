import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { PlatformKey } from "@/app/dashboard/data";
import { ensureValidPlatforms, getDefaultSelections } from "@/app/dashboard/data";
import { IntegrationService } from "@/lib/server/integrations/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const availablePlatforms: PlatformKey[] = ["meta", "google", "tiktok"];
    const requestedPlatforms = Array.isArray(body.platforms)
      ? (body.platforms as string[]).filter((platform): platform is PlatformKey =>
          availablePlatforms.includes(platform as PlatformKey)
        )
      : [];

    const defaultSelections = getDefaultSelections();
    const incomingSelections = (body.selections ?? {}) as Partial<Record<PlatformKey, string>>;
    const normalizedSelections = { ...defaultSelections } as Record<PlatformKey, string>;
    for (const key of availablePlatforms) {
      const candidate = incomingSelections[key];
      if (typeof candidate === "string" && candidate.length > 0) {
        normalizedSelections[key] = candidate;
      }
    }
    const range = body.range
      ? {
          from: body.range.from ? new Date(body.range.from) : undefined,
          to: body.range.to ? new Date(body.range.to) : undefined,
        }
      : undefined;

    const service = new IntegrationService();
    const snapshot = await service.getSnapshot({
      platforms: ensureValidPlatforms(requestedPlatforms),
      selections: normalizedSelections,
      range,
    });

    return NextResponse.json({
      synced: snapshot.hasLiveData,
      kpis: snapshot.kpis,
      daily: snapshot.daily,
      distribution: snapshot.distribution,
      syncedAt: snapshot.syncedAt,
    });
  } catch (error: any) {
    console.error("[API] integrations/sync erro:", error);
    return NextResponse.json({ message: error.message ?? "Erro ao sincronizar plataformas." }, { status: 500 });
  }
}
