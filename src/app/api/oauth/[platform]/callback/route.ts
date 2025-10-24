import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { PlatformKey } from "@/app/dashboard/data";
import { getIntegrationClient } from "@/lib/server/integrations/registry";
import { TokenStore } from "@/lib/server/token-store";

const supportedPlatforms: PlatformKey[] = ["meta", "google", "tiktok"];

export async function POST(request: NextRequest, { params }: { params: { platform: string } }) {
  const platform = params.platform as PlatformKey;
  if (!supportedPlatforms.includes(platform)) {
    return NextResponse.json({ message: "Plataforma não suportada." }, { status: 400 });
  }

  const client = getIntegrationClient(platform);
  const body = await request.json();
  const code = body.code as string | undefined;
  const redirectUri = body.redirectUri as string | undefined;
  const accountId = body.accountId as string | undefined;
  const businessManagerId = body.businessManagerId as string | undefined;

  if (!code || !redirectUri || !accountId) {
    return NextResponse.json(
      { message: "code, redirectUri e accountId são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const token = await client.exchangeCode({ code, redirectUri });
    const store = new TokenStore();
    await store.set({
      platform,
      identifier: accountId,
      token,
      metadata: {
        accountId,
        businessManagerId: businessManagerId ?? "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`[OAuthCallback] Falha para ${platform}:`, error);
    return NextResponse.json({ message: error.message ?? "Erro ao registrar token." }, { status: 500 });
  }
}
