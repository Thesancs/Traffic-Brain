import { NextResponse } from "next/server";

import { getPlatformDefinitions } from "@/app/dashboard/data";

export function GET() {
  try {
    const definitions = getPlatformDefinitions();
    return NextResponse.json(definitions);
  } catch (error: any) {
    console.error("[API] dashboard/platforms erro:", error);
    return NextResponse.json(
      { message: error?.message ?? "Erro ao carregar plataformas" },
      { status: 500 }
    );
  }
}
