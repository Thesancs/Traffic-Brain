
"use client";

import RetroGrid from "@/components/magicui/retro-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./components/sidebar";
import { MobileSidebar } from "./components/mobile-sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Plug, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { PlatformLoading } from "./components/platform-loading";
import { GoogleAdsIcon, MetaIcon, TikTokIcon } from "@/components/icons/platforms";

const topNavLinks = [
  { name: "Meta Ads", href: "/dashboard/meta", icon: <MetaIcon className="h-5 w-7" /> },
  { name: "Google Ads", href: "/dashboard/google", icon: <GoogleAdsIcon className="h-5 w-7" /> },
  { name: "TikTok Ads", href: "/dashboard/tiktok", icon: <TikTokIcon className="h-5 w-7" /> },
  { name: "Integrações", href: "/dashboard/integrations", icon: <Plug /> },
];

function HeaderNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 backdrop-blur-2xl">
      {topNavLinks.map(link => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            "group relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300",
            isActive(link.href)
              ? "bg-white/15 text-foreground shadow-glass-hover"
              : "text-muted-foreground/80 hover:bg-white/5 hover:text-foreground"
          )}
        >
          <span
            className={cn(
              "flex h-7 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10",
              isActive(link.href) ? "text-accent" : "text-muted-foreground"
            )}
          >
            {link.icon}
          </span>
          <span className="tracking-[0.2em]">{link.name}</span>
        </Link>
      ))}
    </nav>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      setLoading(true);
    }, 0);
    const settleTimer = window.setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(settleTimer);
    };
  }, [pathname]);

  return (
    <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 px-4 pb-10 pt-6 md:px-6 lg:px-10">
      <div className="grid w-full items-start gap-6 md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr]">
        <Sidebar />
        <div className="flex flex-col gap-6">
          <header className="glass-panel flex flex-wrap items-center gap-4 px-4 py-4 md:px-6">
            <div className="flex items-center gap-3">
              <MobileSidebar />
              <HeaderNav />
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-3">
              <div className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-medium text-muted-foreground/80 backdrop-blur-xl lg:flex lg:items-center lg:gap-2">
                <span className="flex items-center gap-1 text-accent neon-text">
                  <Sparkles className="h-3.5 w-3.5" />
                  Insights ao vivo
                </span>
                <span className="text-muted-foreground/70">Atualizado há 5 min</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground hover:bg-white/20"
              >
                Exportar
              </Button>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-muted-foreground/80 backdrop-blur-xl">
                <span className="hidden sm:inline">Conta Logada</span>
                <Avatar className="h-9 w-9 border border-white/20 shadow-glass">
                  <AvatarImage src="https://picsum.photos/seed/123/40/40" alt="User" data-ai-hint="person avatar" />
                  <AvatarFallback>TB</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <main className="relative flex flex-1 flex-col gap-6">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <RetroGrid className="opacity-40" />
            </div>
            {loading && <PlatformLoading />}
            <div
              className={cn(
                "relative z-10 flex flex-1 flex-col gap-6 transition-opacity duration-500",
                loading && "pointer-events-none opacity-0"
              )}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
