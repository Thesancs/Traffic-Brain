"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

type ConnectionStatus = "loading" | "success" | "error";

type ConnectedManager = {
  id: string;
  name: string;
  accountId: string;
  business: string | null;
};

export function MetaCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<ConnectionStatus>("loading");
  const [message, setMessage] = useState("Processando autorização do Meta...");
  const [managers, setManagers] = useState<ConnectedManager[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const errorParam = searchParams.get("error");
    const code = searchParams.get("code");

    if (errorParam) {
      setStatus("error");
      setMessage("Autorização cancelada pelo Meta. Tente novamente.");
      return () => controller.abort();
    }

    if (!code) {
      setStatus("error");
      setMessage("Código de autorização ausente na resposta do Meta.");
      return () => controller.abort();
    }

    const completeConnection = async () => {
      try {
        setStatus("loading");
        setMessage("Sincronizando contas do Meta...");
        const redirectUri = `${window.location.origin}/oauth/meta/callback`;
        const response = await fetch("/api/integrations/meta/connect", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, redirectUri }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message ?? "Falha ao concluir a integração com o Meta.");
        }
        setManagers(data.managers ?? []);
        setStatus("success");
        setMessage("Meta conectado com sucesso! As contas serão atualizadas em instantes.");
      } catch (error: any) {
        if (error?.name === "AbortError") return;
        console.error("Erro ao concluir callback do Meta", error);
        setStatus("error");
        setMessage(error?.message ?? "Não foi possível concluir a integração com o Meta.");
      }
    };

    completeConnection();

    return () => controller.abort();
  }, [searchParams]);

  const statusIcon = useMemo(() => {
    if (status === "success") {
      return <CheckCircle2 className="h-6 w-6 text-emerald-400" />;
    }
    if (status === "error") {
      return <XCircle className="h-6 w-6 text-rose-400" />;
    }
    return <Loader2 className="h-6 w-6 animate-spin text-accent" />;
  }, [status]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-8 p-6 text-center">
      <Card className="glass-card w-full border-white/10 bg-white/5 shadow-glass">
        <CardContent className="space-y-6 p-8">
          <div className="flex flex-col items-center gap-3">
            {statusIcon}
            <h1 className="text-2xl font-headline text-foreground">Conectando Meta Ads</h1>
            <p className="text-sm text-muted-foreground/80">{message}</p>
          </div>

          {status === "success" && managers.length > 0 && (
            <div className="space-y-3 text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/60">
                Business Managers sincronizados
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground/80">
                {managers.map((manager) => (
                  <li
                    key={manager.id}
                    className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl"
                  >
                    <p className="font-semibold text-foreground">{manager.name}</p>
                    <p className="text-xs text-muted-foreground/70">Conta: {manager.accountId}</p>
                    {manager.business && (
                      <p className="text-xs text-muted-foreground/70">Business: {manager.business}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {status === "error" && (
            <Alert className="glass-panel border-destructive/40 bg-destructive/15 text-destructive-foreground">
              <AlertTitle>Não foi possível conectar</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/dashboard">
          <Button variant="glass" className="rounded-full px-6 text-xs uppercase tracking-[0.35em]">
            Ir para o dashboard
          </Button>
        </Link>
        <Button
          variant="outline"
          className="rounded-full border-white/20 px-6 text-xs uppercase tracking-[0.35em]"
          onClick={() => router.push("/dashboard/integrations")}
        >
          Voltar para integrações
        </Button>
      </div>
    </div>
  );
}
