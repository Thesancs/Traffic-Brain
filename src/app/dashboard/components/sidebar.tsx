
"use client";

import { BrainCircuit, LayoutDashboard, Telescope, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const platformNav = {
    meta: [
        { name: "Visão Geral", href: "/dashboard/meta", icon: <Telescope className="h-4 w-4" /> },
        { name: "Detalhamento", href: "/dashboard/meta/details", icon: <FileText className="h-4 w-4" /> },
    ],
    google: [
        { name: "Visão Geral", href: "/dashboard/google", icon: <Telescope className="h-4 w-4" /> },
        { name: "Detalhamento", href: "/dashboard/google/details", icon: <FileText className="h-4 w-4" /> },
        { name: "Analytics", href: "/dashboard/google/analytics", icon: <FileText className="h-4 w-4" /> },
    ],
    tiktok: [
        { name: "Visão Geral", href: "/dashboard/tiktok", icon: <Telescope className="h-4 w-4" /> },
    ],
    integrations: [
        // { name: "Visão Geral", href: "/dashboard/integrations", icon: <Telescope className="h-4 w-4" /> },
    ]
}

type Platform = keyof typeof platformNav;


export function Sidebar() {
  const pathname = usePathname();
  const currentPlatform = (pathname.split('/')[2] || '') as Platform;

  const isActive = (path: string) => pathname === path;

  const navItems = platformNav[currentPlatform] || [];

  return (
    <aside className="glass-panel hidden max-h-[calc(100vh-3.5rem)] flex-col justify-between overflow-hidden p-6 md:sticky md:top-6 md:flex">
      <div className="flex flex-col gap-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-3 text-accent shadow-neon-blue">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.45em] text-muted-foreground/70">Traffic Brain</span>
            <h1 className="text-xl font-semibold text-foreground">Command Center</h1>
          </div>
        </Link>

        <div className="glass-divider" />

        <nav className="flex flex-col gap-2 text-sm font-medium">
          <Link
            href="/dashboard"
            className={cn(
              "group relative flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-300",
              pathname === '/dashboard'
                ? "bg-white/15 text-foreground shadow-glass-hover"
                : "text-muted-foreground/80 hover:bg-white/5 hover:text-foreground"
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">Visão geral</span>
              <span className="text-sm">Painel unificado</span>
            </div>
          </Link>

          {navItems.length > 0 && (
            <div className="pt-2">
              <span className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground/60">Plataforma atual</span>
            </div>
          )}

          {navItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-300",
                isActive(item.href)
                  ? "bg-white/15 text-foreground shadow-glass-hover"
                  : "text-muted-foreground/75 hover:bg-white/5 hover:text-foreground"
              )}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
              {isActive(item.href) && <span className="ml-auto h-2 w-2 rounded-full bg-accent shadow-neon-blue" />}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6 space-y-3 text-xs text-muted-foreground/70">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="font-semibold text-foreground">Automação inteligente</p>
          <p className="mt-2 text-xs text-muted-foreground/70">
            Centralize decisões de mídia com IA e fluxos automatizados.
          </p>
          <Link
            href="/dashboard/meta"
            className="mt-3 inline-flex items-center text-xs font-semibold text-accent hover:text-accent/80"
          >
            Explorar road map →
          </Link>
        </div>
      </div>
    </aside>
  );
}
