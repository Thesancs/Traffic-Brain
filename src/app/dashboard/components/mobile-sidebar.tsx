
"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BrainCircuit, LayoutDashboard, Menu, Telescope, FileText, PlugZap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { GoogleAdsIcon, MetaIcon, TikTokIcon } from "@/components/icons/platforms"

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

const platformOptions = [
    { name: "Meta Ads", href: "/dashboard/meta", icon: <MetaIcon className="h-5 w-5" /> },
    { name: "Google Ads", href: "/dashboard/google", icon: <GoogleAdsIcon className="h-5 w-5" /> },
    { name: "TikTok Ads", href: "/dashboard/tiktok", icon: <TikTokIcon className="h-5 w-5" /> },
    { name: "Integrações", href: "/dashboard/integrations", icon: <PlugZap className="h-5 w-5" /> },
]

type Platform = keyof typeof platformNav;


export function MobileSidebar() {
    const pathname = usePathname();
    const currentPlatform = (pathname.split('/')[2] || '') as Platform;
    const isActive = (path: string) => pathname === path;
    const isPlatformRoute = (path: string) => pathname.startsWith(path);
    const navItems = platformNav[currentPlatform] || [];

    return (
        <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 rounded-full border-white/20 bg-white/10 text-foreground hover:bg-white/20 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="glass-panel m-4 flex h-[calc(100%-2rem)] flex-col gap-6 overflow-hidden border-white/10 bg-white/10 p-6"
            >
              <nav className="flex flex-1 flex-col gap-4 text-base font-medium">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="rounded-2xl border border-accent/40 bg-accent/10 p-3 text-accent shadow-neon-blue">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground/70">Traffic Brain</span>
                    <span className="block text-lg font-semibold text-foreground">Command Center</span>
                  </div>
                </Link>

                <div className="glass-divider" />

                <Link
                  href="/dashboard"
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-300",
                    pathname === '/dashboard'
                      ? "bg-white/15 text-foreground shadow-glass-hover"
                      : "text-muted-foreground/80 hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                    <LayoutDashboard className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/70">Visão geral</span>
                    <span>Dashboard</span>
                  </div>
                </Link>

                <div>
                  <span className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/60">Plataformas</span>
                  <div className="mt-2 flex flex-col gap-2">
                    {platformOptions.map(option => (
                      <Link
                        key={option.name}
                        href={option.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-300",
                          isPlatformRoute(option.href)
                            ? "bg-white/15 text-foreground shadow-glass-hover"
                            : "text-muted-foreground/80 hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                          {option.icon}
                        </span>
                        <span>{option.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="glass-divider" />

                {navItems.length > 0 && (
                  <div>
                    <span className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/60">Plataforma atual</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {navItems.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-300",
                        isActive(item.href)
                          ? "bg-white/15 text-foreground shadow-glass-hover"
                          : "text-muted-foreground/80 hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
        </Sheet>
    )
}
    
