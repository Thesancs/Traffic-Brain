import { Suspense } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { MetaCallbackClient } from "./meta-callback-client";

function CallbackFallback() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-8 p-6 text-center">
      <Card className="glass-card w-full border-white/10 bg-white/5 shadow-glass">
        <CardContent className="space-y-6 p-8">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <h1 className="text-2xl font-headline text-foreground">Conectando Meta Ads</h1>
            <p className="text-sm text-muted-foreground/80">Processando autorização do Meta...</p>
          </div>
        </CardContent>
      </Card>

      <Link
        href="/dashboard"
        className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70 transition hover:text-foreground"
      >
        Voltar ao dashboard
      </Link>
    </div>
  );
}

export default function MetaCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <MetaCallbackClient />
    </Suspense>
  );
}
