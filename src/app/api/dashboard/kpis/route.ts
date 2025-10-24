import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { DateRange, PlatformKey } from "@/app/dashboard/data";
import { ensureValidPlatforms, getDefaultSelections } from "@/app/dashboard/data";
import { IntegrationService } from "@/lib/server/integrations/service";

const parseRange = (range?: { from?: string | null; to?: string | null }): DateRange | undefined => {
  if (!range?.from && !range?.to) return undefined;
  return {
    from: range?.from ? new Date(range.from) : undefined,
    to: range?.to ? new Date(range.to) : undefined,
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const availablePlatforms: PlatformKey[] = ["meta", "google", "tiktok"];
    const requestedPlatforms = Array.isArray(body.platforms)
      ? (body.platforms as string[]).filter((platform): platform is PlatformKey =>
          availablePlatforms.includes(platform as PlatformKey)
        )
      : [];
    const validPlatforms = ensureValidPlatforms(requestedPlatforms);

    const defaults = getDefaultSelections();
    const incomingSelections = (body.selections ?? {}) as Partial<Record<PlatformKey, string>>;
    const normalizedSelections = { ...defaults } as Record<PlatformKey, string>;
    for (const key of availablePlatforms) {
      const candidate = incomingSelections[key];
      if (typeof candidate === "string" && candidate.length > 0) {
        normalizedSelections[key] = candidate;
      }
    }

    const range = parseRange(body.range);

    const service = new IntegrationService();
    const snapshot = await service.getSnapshot({
      platforms: validPlatforms,
      selections: normalizedSelections,
      range,
    });

    return NextResponse.json({
      kpis: snapshot.kpis,
      daily: snapshot.daily,
      distribution: snapshot.distribution,
      syncedAt: snapshot.syncedAt,
    });
  } catch (error: any) {
    console.error("[API] dashboard/kpis erro:", error);
    return NextResponse.json({ message: error.message ?? "Erro ao carregar KPIs" }, { status: 500 });
  }
}
