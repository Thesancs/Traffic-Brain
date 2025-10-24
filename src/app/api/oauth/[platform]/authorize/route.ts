import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { PlatformKey } from "@/app/dashboard/data";
import { getIntegrationClient } from "@/lib/server/integrations/registry";

const supportedPlatforms: PlatformKey[] = ["meta", "google", "tiktok"];

export function GET(request: NextRequest, { params }: { params: { platform: string } }) {
  const platform = params.platform as PlatformKey;
  if (!supportedPlatforms.includes(platform)) {
    return NextResponse.json({ message: "Plataforma não suportada." }, { status: 400 });
  }

  const client = getIntegrationClient(platform);
  const url = new URL(request.url);
  const redirectUri = url.searchParams.get("redirectUri") ?? url.searchParams.get("redirect_uri");
  const state = url.searchParams.get("state") ?? "integration";
  const scopes = url.searchParams.getAll("scope");

  if (!redirectUri) {
    return NextResponse.json({ message: "redirectUri é obrigatório." }, { status: 400 });
  }

  const authUrl = client.getAuthorizationUrl({ redirectUri, state, scopes: scopes.length ? scopes : undefined });
  return NextResponse.json({ url: authUrl });
}
