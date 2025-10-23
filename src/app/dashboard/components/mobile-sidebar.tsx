"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BrainCircuit, Chrome, Facebook, LayoutDashboard, Menu, Plug } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556v2.177c.144.715.54 1.617 1.235 2.512C10.895 11.39 11.797 12 13 12v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556V6.177c-1.32.016-2.517-.556-3.5-1.556v-2.2c1.32.016 2.517.556 3.5 1.556V0Z"/>
    </svg>
  );

export function MobileSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname.startsWith(path);

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
                    isActive('/dashboard') && !pathname.includes('meta') && !pathname.includes('google') && !pathname.includes('tiktok') && !pathname.includes('integrations') && "text-primary bg-muted"
                    )}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Link>
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="py-2 hover:no-underline [&[data-state=open]>svg]:text-primary">
                        <div className={cn("flex items-center gap-3 rounded-lg text-muted-foreground transition-all", isActive('/dashboard/meta') && "text-primary")}>
                            <Facebook className="h-4 w-4" />
                            Meta Ads
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-12">
                        <nav className="grid gap-4">
                            <Link href="/dashboard/meta" className={cn("text-muted-foreground hover:text-primary", pathname === '/dashboard/meta' && "text-primary")}>Visão Geral</Link>
                            <Link href="/dashboard/meta/details" className={cn("text-muted-foreground hover:text-primary", pathname === '/dashboard/meta/details' && "text-primary")}>Detalhamento</Link>
                        </nav>
                    </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Link
                href="/dashboard/google"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive('/dashboard/google') && "text-primary bg-muted"
                )}
              >
                <Chrome className="h-4 w-4" />
                Google Ads
              </Link>
               <Link
                href="/dashboard/tiktok"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive('/dashboard/tiktok') && "text-primary bg-muted"
                )}
              >
                <TikTokIcon />
                TikTok Ads
              </Link>
               <Link
                href="/dashboard/integrations"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive('/dashboard/integrations') && "text-primary bg-muted"
                )}
              >
                <Plug className="h-4 w-4" />
                Integrações
              </Link>
            </nav>
            </SheetContent>
        </Sheet>
    )
}
    