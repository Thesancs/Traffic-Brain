"use client";

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Linkedin,
  PlugZap,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Workflow,
  Loader2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { GoogleAdsIcon, MetaIcon, TikTokIcon } from '@/components/icons/platforms';
import type { PlatformKey } from '@/app/dashboard/data';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AutoScaleNumber } from '@/components/ui/auto-scale-number';
import { formatRelativeOrNever } from '@/lib/formatters/relative-time';

type IntegrationStatus = 'connected' | 'available' | 'beta';

type IntegrationMetric = {
  label: string;
  value: string;
};

type IntegrationKey = PlatformKey | 'linkedin';

type IntegrationPlatform = {
  key?: IntegrationKey;
  name: string;
  description: string;
  icon: ReactNode;
  status: IntegrationStatus;
  metrics: IntegrationMetric[];
  lastSync?: string;
  owner?: string;
};

type ComputedPlatform = IntegrationPlatform & {
  statusOverride?: IntegrationStatus;
  actionLabelOverride?: string;
};

const integrationPlatforms: IntegrationPlatform[] = [
  {
    key: 'meta',
    name: 'Meta Ads (Facebook)',
    description:
      'Sincronize campanhas, conjuntos de anúncios e eventos do Facebook e Instagram sem atrito.',
    icon: <MetaIcon className="h-6 w-9" />,
    status: 'connected',
    owner: 'Squad Performance',
    metrics: [
      { label: 'Investimento', value: 'R$ 38,2K' },
      { label: 'ROAS', value: '3,2x' },
    ],
  },
  {
    key: 'google',
    name: 'Google Ads & Analytics',
    description:
      'Unifique mídia paga e comportamento onsite em um único fluxo com atribuição avançada.',
    icon: <GoogleAdsIcon className="h-6 w-9" />,
    status: 'connected',
    owner: 'Growth Ops',
    metrics: [
      { label: 'Investimento', value: 'R$ 24,6K' },
      { label: 'Conversões', value: '1.240' },
    ],
  },
  {
    key: 'linkedin',
    name: 'LinkedIn Ads',
    description:
      'Consolide leads B2B, formulários e métricas de pipeline do LinkedIn Campaign Manager.',
    icon: <Linkedin className="h-6 w-6" />,
    status: 'available',
    owner: 'Equipe de Parcerias',
    metrics: [
      { label: 'Disponível', value: 'Conexão imediata' },
      { label: 'Playbooks', value: '4 fluxos sugeridos' },
    ],
  },
  {
    key: 'tiktok',
    name: 'TikTok Ads',
    description: 'Analise criativos, tendências de engajamento e atribuição em um só lugar.',
    icon: <TikTokIcon className="h-6 w-9" />,
    status: 'beta',
    owner: 'Beta fechado',
    metrics: [
      { label: 'Disponibilidade', value: 'Q4 2024' },
      { label: 'Lista de espera', value: '54 equipes' },
    ],
  },
];

const statusContent: Record<
  IntegrationStatus,
  {
    label: string;
    badgeClassName: string;
    actionLabel: string;
    secondaryLabel: string;
    actionClassName: string;
    secondaryClassName: string;
  }
> = {
  connected: {
    label: 'Ativo',
    badgeClassName:
      'border-emerald-400/40 bg-emerald-500/20 text-emerald-200 shadow-none',
    actionLabel: 'Sincronizar agora',
    secondaryLabel: 'Configurações',
    actionClassName:
      'border-emerald-400/40 text-emerald-50 hover:bg-emerald-500/20 hover:text-emerald-100',
    secondaryClassName: 'text-muted-foreground/80 hover:text-foreground',
  },
  available: {
    label: 'Disponível',
    badgeClassName: 'border-accent/40 bg-accent/15 text-accent shadow-none',
    actionLabel: 'Conectar conta',
    secondaryLabel: 'Ver documentação',
    actionClassName:
      'border-accent/40 text-accent hover:bg-accent/20 hover:text-accent-foreground',
    secondaryClassName: 'text-muted-foreground/80 hover:text-foreground',
  },
  beta: {
    label: 'Beta fechado',
    badgeClassName:
      'border-purple-400/50 bg-purple-500/20 text-purple-200 shadow-none',
    actionLabel: 'Entrar na lista beta',
    secondaryLabel: 'Saiba mais',
    actionClassName:
      'border-purple-400/50 text-purple-100 hover:bg-purple-500/20 hover:text-purple-50',
    secondaryClassName: 'text-purple-200/80 hover:text-purple-100',
  },
};

const heroHighlights = [
  {
    title: 'Playbooks com IA',
    description: 'Active fluxos preditivos que otimizam bids, orçamentos e criativos.',
    icon: <Sparkles className="h-4 w-4 text-accent" />,
  },
  {
    title: 'Governança',
    description: 'Controle permissões, auditoria e níveis de acesso por squad.',
    icon: <ShieldCheck className="h-4 w-4 text-chart-2" />,
  },
  {
    title: 'Orquestração',
    description: 'Crie automações multicanal ligadas a gatilhos de performance.',
    icon: <Workflow className="h-4 w-4 text-chart-3" />,
  },
];

type SyncMetadata = {
  syncedAt: string | null;
  source: 'api' | 'fallback';
};

type SyncSchedule = {
  frequency: 'hourly' | 'daily' | 'custom';
  cron?: string;
  timezone?: string;
};

const EMPTY_SYNC: SyncMetadata = { syncedAt: null, source: 'fallback' };

const INITIAL_SYNC_STATE: Record<PlatformKey, SyncMetadata> = {
  meta: { ...EMPTY_SYNC },
  google: { ...EMPTY_SYNC },
  tiktok: { ...EMPTY_SYNC },
};

const describeSchedule = (schedule: SyncSchedule | null): string => {
  if (!schedule) {
    return 'Rotina automática desativada. Execute sincronizações manuais quando necessário.';
  }

  if (schedule.frequency === 'hourly') {
    return 'Atualização automática a cada hora com monitoramento de falhas.';
  }

  if (schedule.frequency === 'daily') {
    return 'Atualização automática diária com alertas inteligentes.';
  }

  if (schedule.frequency === 'custom' && schedule.cron) {
    if (schedule.cron.includes('*/2')) {
      return 'Atualização automática a cada 2 horas com failover inteligente.';
    }
    if (schedule.cron.includes('*/1')) {
      return 'Atualização automática a cada hora personalizada.';
    }
    return `Rotina customizada (${schedule.cron}${schedule.timezone ? ` · ${schedule.timezone}` : ''}).`;
  }

  return 'Atualização programada disponível.';
};

const onboardingSteps = [
  {
    title: 'Escolha a plataforma',
    description: 'Selecione as contas e defina as permissões necessárias para sincronização.',
  },
  {
    title: 'Configure eventos',
    description: 'Ative webhooks, pixels e conversões com validação automática de schema.',
  },
  {
    title: 'Habilite playbooks',
    description: 'Combine triggers de IA com ações recomendadas pelo Command Center.',
  },
];

export default function IntegrationsPage() {
  const [connections, setConnections] = useState<Record<PlatformKey, number>>({
    meta: 0,
    google: 0,
    tiktok: 0,
  });
  const [syncMetadata, setSyncMetadata] = useState<Record<PlatformKey, SyncMetadata>>(() => ({
    meta: { ...INITIAL_SYNC_STATE.meta },
    google: { ...INITIAL_SYNC_STATE.google },
    tiktok: { ...INITIAL_SYNC_STATE.tiktok },
  }));
  const [syncing, setSyncing] = useState<Record<PlatformKey, boolean>>({
    meta: false,
    google: false,
    tiktok: false,
  });
  const [schedule, setSchedule] = useState<SyncSchedule | null>(null);
  const [loadingMetaConnect, setLoadingMetaConnect] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadConnections = async () => {
      try {
        const response = await fetch('/api/integrations/connections', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Não foi possível carregar conexões.');
        }
        const payload = await response.json() as {
          connections: Record<PlatformKey, Array<{ accountId: string }>>;
          syncedAt?: Partial<Record<PlatformKey, SyncMetadata>>;
        };
        setConnections({
          meta: payload.connections.meta.length,
          google: payload.connections.google.length,
          tiktok: payload.connections.tiktok.length,
        });
        if (payload.syncedAt) {
          const syncedEntries = Object.entries(payload.syncedAt ?? {}) as [
            PlatformKey,
            SyncMetadata | undefined,
          ][];
          setSyncMetadata((current) => ({
            ...current,
            ...Object.fromEntries(
              syncedEntries.map(([platform, metadata]) => [platform, metadata ?? { ...EMPTY_SYNC }]),
            ),
          }));
        }
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
        console.error('Erro ao buscar conexões de integrações', error);
      }
    };

    loadConnections();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadSchedule = async () => {
      try {
        const response = await fetch('/api/integrations/schedule', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Não foi possível carregar agendamento.');
        }
        const payload = await response.json() as { schedule?: SyncSchedule | null };
        setSchedule(payload.schedule ?? null);
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
        console.error('Erro ao carregar agendamento de sincronização', error);
      }
    };

    loadSchedule();

    return () => controller.abort();
  }, []);

  const computedPlatforms = useMemo<ComputedPlatform[]>(
    () =>
      integrationPlatforms.map((platform) => {
        const metadata = platform.key && platform.key in syncMetadata
          ? syncMetadata[platform.key as PlatformKey]
          : undefined;
        const fallbackSync = platform.lastSync ?? 'nunca';
        const relativeSync = metadata?.syncedAt
          ? formatRelativeOrNever(metadata.syncedAt)
          : fallbackSync;

        if (platform.key === 'meta') {
          const isConnected = connections.meta > 0;
          return {
            ...platform,
            statusOverride: isConnected ? 'connected' : 'available',
            metrics: isConnected
              ? [
                  { label: 'BM conectados', value: `${connections.meta}` },
                  {
                    label: 'Sincronização',
                    value: metadata?.syncedAt ? 'Ativa' : 'Pendente',
                  },
                ]
              : platform.metrics,
            lastSync: isConnected ? relativeSync : fallbackSync,
            actionLabelOverride: isConnected ? 'Sincronizar agora' : 'Conectar via Facebook',
          };
        }

        if (platform.key && platform.key in connections) {
          const typedKey = platform.key as PlatformKey;
          const total = connections[typedKey];
          if (total > 0) {
            return {
              ...platform,
              metrics: [
                { label: 'BM conectados', value: `${total}` },
                ...platform.metrics.slice(1),
              ],
              lastSync: relativeSync,
            };
          }
        }

        return { ...platform, lastSync: relativeSync };
      }),
    [connections, syncMetadata],
  );

  const connectedPlatforms = computedPlatforms.filter(
    (platform) => (platform.statusOverride ?? platform.status) === 'connected',
  );

  const connectionProgress = computedPlatforms.length
    ? Math.round((connectedPlatforms.length / computedPlatforms.length) * 100)
    : 0;
  const globalLastSync = useMemo(() => {
    const timestamps = Object.values(syncMetadata)
      .map((item) => item?.syncedAt)
      .filter((value): value is string => Boolean(value));
    if (!timestamps.length) return 'nunca';
    const latest = timestamps.reduce((acc, current) => (acc > current ? acc : current));
    return formatRelativeOrNever(latest);
  }, [syncMetadata]);
  const scheduleDescription = describeSchedule(schedule);

  const handleMetaConnect = async () => {
    if (typeof window === 'undefined') return;
    setConnectError(null);
    setLoadingMetaConnect(true);
    let redirected = false;

    try {
      const redirectUri = `${window.location.origin}/oauth/meta/callback`;
      const params = new URLSearchParams({ redirectUri, state: 'meta-connect' });
      params.append('scope', 'ads_read');
      params.append('scope', 'ads_management');
      const response = await fetch(`/api/oauth/meta/authorize?${params.toString()}`);
      const data = await response.json();
      if (!response.ok || !data?.url) {
        throw new Error(data?.message ?? 'Falha ao iniciar a conexão com o Meta.');
      }
      redirected = true;
      window.location.href = data.url as string;
    } catch (error: any) {
      console.error('Erro ao iniciar integração Meta', error);
      setConnectError(error?.message ?? 'Não foi possível iniciar a conexão com o Meta.');
    } finally {
      if (!redirected) {
        setLoadingMetaConnect(false);
      }
    }
  };

  const handleManualSync = async (platform: PlatformKey) => {
    setConnectError(null);
    setSyncing((current) => ({ ...current, [platform]: true }));
    try {
      const response = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platforms: [platform] }),
      });
      const payload = await response.json() as {
        syncedAt?: Partial<Record<PlatformKey, SyncMetadata>>;
        message?: string;
      };
      if (!response.ok) {
        throw new Error(payload?.message ?? 'Falha ao sincronizar plataforma.');
      }
      if (payload.syncedAt) {
        const syncedEntries = Object.entries(payload.syncedAt ?? {}) as [
          PlatformKey,
          SyncMetadata | undefined,
        ][];
        setSyncMetadata((current) => ({
          ...current,
          ...Object.fromEntries(
            syncedEntries.map(([key, value]) => [key, value ?? { ...EMPTY_SYNC }]),
          ),
        }));
      }
    } catch (error: any) {
      console.error('Erro ao sincronizar plataformas', error);
      setConnectError(error?.message ?? 'Não foi possível sincronizar a plataforma selecionada.');
    } finally {
      setSyncing((current) => ({ ...current, [platform]: false }));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <div className="glass-card relative overflow-hidden px-6 py-8 shadow-glass">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 top-0 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute -left-24 bottom-0 h-60 w-60 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-5">
              <Badge variant="glass" className="w-fit text-[0.6rem]">
                Hub de integrações
              </Badge>
              <div className="space-y-3">
                <h1 className="text-3xl font-headline font-semibold text-foreground md:text-4xl">
                  Expanda seu ecossistema de mídia
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground/80">
                  Conecte plataformas, automatize fluxos e mantenha seus dados em tempo real com um visual centralizado e ultra responsivo.
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button
                variant="glass"
                size="lg"
                className="rounded-full px-8 text-[0.65rem] uppercase tracking-[0.35em]"
              >
                <PlugZap className="h-4 w-4" />
                Adicionar integração
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/20 px-8 text-[0.65rem] uppercase tracking-[0.35em]"
              >
                <Sparkles className="h-4 w-4" />
                Explorar roadmap
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/60">
                Conexões ativas
              </p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-semibold text-foreground">
                  {connectedPlatforms.length}
                </span>
                <span className="text-xs text-muted-foreground/60">
                  de {computedPlatforms.length}
                </span>
              </div>
              <Progress
                value={connectionProgress}
                className="mt-3 h-2 border border-white/10 bg-white/5"
                indicatorClassName="bg-gradient-to-r from-accent via-primary to-chart-3 shadow-neon-blue"
              />
              <span className="mt-2 block text-[0.65rem] text-muted-foreground/60">
                {connectionProgress}% de cobertura do ecossistema
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/60">
                <span>Sync global</span>
                <RefreshCw className="h-3.5 w-3.5 text-chart-2" />
              </div>
              <p className="mt-2 text-lg font-semibold text-foreground">Última sync: {globalLastSync}</p>
              <p className="mt-1 text-xs text-muted-foreground/70">{scheduleDescription}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/60">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Playbooks ativos</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-foreground">8 fluxos inteligentes</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Recomendações de otimização baseadas em sinais de performance cruzados.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {heroHighlights.map((highlight) => (
              <div
                key={highlight.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/60">
                  {highlight.icon}
                  {highlight.title}
                </div>
                <p className="mt-2 text-sm text-muted-foreground/75">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card relative overflow-hidden p-6 shadow-glass">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-chart-2/25 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>
          <CardHeader className="space-y-1 p-0">
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/60">
              Onboarding guiado
            </span>
            <CardTitle className="text-2xl text-foreground">Ative integrações em 3 passos</CardTitle>
            <CardDescription className="text-muted-foreground/75">
              Fluxo assistido com validações automáticas para evitar interrupções e garantir governança.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6 space-y-5 p-0">
            <ol className="space-y-4">
              {onboardingSteps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs font-semibold text-muted-foreground/80 backdrop-blur-xl">
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground/75">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted-foreground/70 backdrop-blur-xl">
              <p className="font-semibold text-foreground">Precisa de apoio especialista?</p>
              <p className="mt-1">
                Agende uma sessão com o time de onboarding para desenhar automações multicanal.
              </p>
            </div>
          </CardContent>
        </div>
      </section>

      {connectError && (
        <Alert className="glass-panel border-destructive/40 bg-destructive/15 text-destructive-foreground">
          <AlertDescription>{connectError}</AlertDescription>
        </Alert>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        {computedPlatforms.map((platform) => {
          const statusKey = platform.statusOverride ?? platform.status;
          const status = statusContent[statusKey];
          const actionLabel = platform.actionLabelOverride ?? status.actionLabel;
          const isMeta = platform.key === 'meta';
          const typedPlatform =
            platform.key && ['meta', 'google', 'tiktok'].includes(platform.key)
              ? (platform.key as PlatformKey)
              : null;
          const canSync = statusKey === 'connected' && typedPlatform !== null;
          const isSyncing = typedPlatform ? syncing[typedPlatform] : false;
          const isMetaConnecting = isMeta && statusKey !== 'connected' && loadingMetaConnect;
          const primaryDisabled =
            statusKey === 'beta' || isMetaConnecting || (canSync && isSyncing);
          const onPrimaryClick = canSync && typedPlatform
            ? () => handleManualSync(typedPlatform)
            : isMeta && statusKey !== 'connected'
              ? handleMetaConnect
              : undefined;

          return (
            <Card
              key={platform.name}
              className="glass-card group overflow-hidden border-white/10 bg-white/5 shadow-glass transition-all duration-500 hover:shadow-glass-hover"
            >
              <CardHeader className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-neon-blue">
                      {platform.icon}
                    </span>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {platform.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground/70">
                        {platform.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="glass" className={cn('text-[0.6rem]', status.badgeClassName)}>
                    {status.label}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {platform.metrics.map((metric) => (
                    <div
                      key={`${platform.name}-${metric.label}`}
                      className="rounded-2xl border border-white/10 bg-white/10 p-3 text-xs text-muted-foreground/70 backdrop-blur-xl"
                    >
                      <p className="font-semibold uppercase tracking-[0.35em] text-muted-foreground/60">
                        {metric.label}
                      </p>
                      <div className="mt-2">
                        <AutoScaleNumber
                          value={metric.value}
                          className="text-lg font-semibold text-foreground"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/70">
                  <PlugZap className="h-3.5 w-3.5" />
                  <span>{platform.owner ?? 'Integração oficial Traffic Brain'}</span>
                  {platform.lastSync && (
                    <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[0.6rem] uppercase tracking-[0.35em]">
                      Última sync: {platform.lastSync}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full rounded-full border px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] transition-all duration-300',
                      status.actionClassName,
                      isMeta && 'border-accent/40'
                    )}
                    disabled={primaryDisabled}
                    onClick={onPrimaryClick}
                  >
                    {isMetaConnecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Conectando...
                      </span>
                    ) : canSync && isSyncing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Sincronizando...
                      </span>
                    ) : (
                      actionLabel
                    )}
                  </Button>
                  <Button
                    variant="link"
                    className={cn(
                      'w-full rounded-full px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] transition-colors',
                      status.secondaryClassName,
                    )}
                  >
                    {status.secondaryLabel}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
