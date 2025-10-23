
"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BrainCircuit, LayoutDashboard, Menu, Telescope, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

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


export function MobileSidebar() {
    const pathname = usePathname();
    const currentPlatform = (pathname.split('/')[2] || '') as Platform;
    const isActive = (path: string) => pathname === path;
    const navItems = platformNav[currentPlatform] || [];

    return (
        <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <div className="p-2 rounded-lg text-accent" style={{ filter: 'drop-shadow(0 0 6px hsl(var(--accent)))' }}>
                    <BrainCircuit className="size-6" />
                  </div>
                  <span className="text-xl font-bold text-accent font-headline" style={{ filter: 'drop-shadow(0 0 6px hsl(var(--accent)))' }}>
                    Traffic Brain
                  </span>
                </Link>
                <Link
                    href="/dashboard"
                    className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === '/dashboard' && "text-primary bg-muted"
                    )}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Link>
                
                {navItems.length > 0 && <div className="my-2 border-t border-border/50"></div>}

                {navItems.map(item => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive(item.href) && "text-primary bg-muted"
                    )}
                >
                    {item.icon}
                    {item.name}
                </Link>
              ))}
            </nav>
            </SheetContent>
        </Sheet>
    )
}
    
