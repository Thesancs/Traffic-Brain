import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Chrome,
  Facebook,
  Linkedin,
  PlugZap,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556v2.177c.144.715.54 1.617 1.235 2.512C10.895 11.39 11.797 12 13 12v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556V6.177c-1.32.016-2.517-.556-3.5-1.556v-2.2c1.32.016 2.517.556 3.5 1.556V0Z" />
  </svg>
);

type IntegrationStatus = 'connected' | 'available' | 'beta';

type IntegrationMetric = {
  label: string;
  value: string;
};

type IntegrationPlatform = {
  name: string;
  description: string;
  icon: ReactNode;
  status: IntegrationStatus;
  metrics: IntegrationMetric[];
  lastSync?: string;
  owner?: string;
};

const integrationPlatforms: IntegrationPlatform[] = [
  {
    name: 'Meta Ads (Facebook)',
    description:
      'Sincronize campanhas, conjuntos de anúncios e eventos do Facebook e Instagram sem atrito.',
    icon: <Facebook className="h-6 w-6" />,
    status: 'connected',
    lastSync: 'há 2 horas',
    owner: 'Squad Performance',
    metrics: [
      { label: 'Investimento', value: 'R$ 38,2K' },
      { label: 'ROAS', value: '3,2x' },
    ],
  },
  {
    name: 'Google Ads & Analytics',
    description:
      'Unifique mídia paga e comportamento onsite em um único fluxo com atribuição avançada.',
    icon: <Chrome className="h-6 w-6" />,
    status: 'connected',
    lastSync: 'há 15 minutos',
    owner: 'Growth Ops',
    metrics: [
      { label: 'Investimento', value: 'R$ 24,6K' },
      { label: 'Conversões', value: '1.240' },
    ],
  },
  {
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
    name: 'TikTok Ads',
    description: 'Analise criativos, tendências de engajamento e atribuição em um só lugar.',
    icon: <TikTokIcon className="h-6 w-6" />,
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
  const connectedPlatforms = integrationPlatforms.filter(
    (platform) => platform.status === 'connected',
  );
  const connectionProgress = Math.round(
    (connectedPlatforms.length / integrationPlatforms.length) * 100,
  );
  const globalLastSync = connectedPlatforms[0]?.lastSync ?? 'há instantes';

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
                  de {integrationPlatforms.length}
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
              <p className="mt-2 text-lg font-semibold text-foreground">{globalLastSync}</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Atualização automática a cada 15 minutos com monitoramento de falhas.
              </p>
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {integrationPlatforms.map((platform) => {
          const content = statusContent[platform.status];

          return (
            <Card
              key={platform.name}
              className="group relative overflow-hidden border-white/10 bg-white/5 shadow-glass transition-colors hover:border-accent/50 hover:shadow-glass-hover"
            >
              <div className="pointer-events-none absolute -right-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
              <CardHeader className="relative flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-accent">
                      {platform.icon}
                    </div>
                    <div>
                      <CardTitle className="font-headline text-lg text-foreground">
                        {platform.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground/75">
                        {platform.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="glass"
                    className={cn('text-[0.55rem] tracking-[0.35em]', content.badgeClassName)}
                  >
                    {content.label}
                  </Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {platform.metrics.map((metric) => (
                    <div
                      key={`${platform.name}-${metric.label}`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl"
                    >
                      <p className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/60">
                        {metric.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    variant="glass"
                    size="sm"
                    className={cn(
                      'w-full rounded-full px-5 text-[0.6rem] uppercase tracking-[0.35em] sm:w-auto',
                      content.actionClassName,
                    )}
                  >
                    {content.actionLabel}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'w-full rounded-full border-white/15 px-5 text-[0.6rem] uppercase tracking-[0.35em] sm:w-auto',
                      content.secondaryClassName,
                    )}
                  >
                    {content.secondaryLabel}
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/70">
                  {platform.owner && (
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-chart-2" />
                      {platform.owner}
                    </span>
                  )}
                  {platform.lastSync && (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-chart-1" />
                      Última sync {platform.lastSync}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
