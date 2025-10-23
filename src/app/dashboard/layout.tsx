"use client";

import RetroGrid from "@/components/magicui/retro-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrainCircuit, Chrome, Facebook, LayoutDashboard, Menu, Plug } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556v2.177c.144.715.54 1.617 1.235 2.512C10.895 11.39 11.797 12 13 12v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556V6.177c-1.32.016-2.517-.556-3.5-1.556v-2.2c1.32.016 2.517.556 3.5 1.556V0Z"/>
  </svg>
);

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
  { href: "/dashboard/meta", label: "Meta Ads", icon: <Facebook className="size-4" /> },
  { href: "/dashboard/tiktok", label: "Tiktok Ads", icon: <TikTokIcon /> },
  { href: "/dashboard/integrations", label: "Integrações", icon: <Plug className="size-4" /> },
];

function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
      <Link
        href="/dashboard"
        className={`flex items-center gap-2 transition-colors hover:text-accent ${pathname === '/dashboard' ? 'text-accent' : 'text-muted-foreground'}`}
      >
        <LayoutDashboard className="size-4" />
        Dashboard
      </Link>
      <Link
        href="/dashboard/meta"
        className={`flex items-center gap-2 transition-colors hover:text-accent ${pathname.startsWith('/dashboard/meta') ? 'text-accent' : 'text-muted-foreground'}`}
      >
        <Facebook className="size-4" />
        Meta Ads
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex items-center gap-2 transition-colors hover:text-accent ${pathname.startsWith('/dashboard/google') ? 'text-accent' : 'text-muted-foreground'}`}
          >
            <Chrome className="size-4" />
            Google
            <ChevronDown className="size-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/google">Google Ads</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/google/analytics">Analytics</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
       <Link
        href="/dashboard/tiktok"
        className={`flex items-center gap-2 transition-colors hover:text-accent ${pathname.startsWith('/dashboard/tiktok') ? 'text-accent' : 'text-muted-foreground'}`}
      >
        <TikTokIcon />
        Tiktok Ads
      </Link>
      <Link
        href="/dashboard/integrations"
        className={`flex items-center gap-2 transition-colors hover:text-accent ${pathname.startsWith('/dashboard/integrations') ? 'text-accent' : 'text-muted-foreground'}`}
      >
        <Plug className="size-4" />
        Integrações
      </Link>
    </nav>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
             <div className="p-2 rounded-lg text-accent" style={{ filter: 'drop-shadow(0 0 6px hsl(var(--accent)))' }}>
                <BrainCircuit className="size-6" />
             </div>
            <span className="sr-only">Traffic Brain</span>
          </Link>
          <Link href="/dashboard" className={`flex items-center gap-4 transition-colors hover:text-accent ${pathname === '/dashboard' ? 'text-accent' : 'text-muted-foreground'}`}>
            <LayoutDashboard className="size-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/meta" className={`flex items-center gap-4 transition-colors hover:text-accent ${pathname.startsWith('/dashboard/meta') ? 'text-accent' : 'text-muted-foreground'}`}>
            <Facebook className="size-5" />
            Meta Ads
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex w-full items-center gap-4 transition-colors hover:text-accent ${pathname.startsWith('/dashboard/google') ? 'text-accent' : 'text-muted-foreground'}`}
              >
                <Chrome className="size-5" />
                Google
                <ChevronDown className="size-4 ml-auto" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/google">Google Ads</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/google/analytics">Analytics</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/dashboard/tiktok" className={`flex items-center gap-4 transition-colors hover:text-accent ${pathname.startsWith('/dashboard/tiktok') ? 'text-accent' : 'text-muted-foreground'}`}>
            <div className="w-5 h-5 flex items-center justify-center">
              <TikTokIcon />
            </div>
            Tiktok Ads
          </Link>
          <Link href="/dashboard/integrations" className={`flex items-center gap-4 transition-colors hover:text-accent ${pathname.startsWith('/dashboard/integrations') ? 'text-accent' : 'text-muted-foreground'}`}>
            <Plug className="size-5" />
            Integrações
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-lg text-accent" style={{ filter: 'drop-shadow(0 0 6px hsl(var(--accent)))' }}>
              <BrainCircuit className="size-6" />
            </div>
            <h1 className="text-xl font-bold text-accent font-headline" style={{ filter: 'drop-shadow(0 0 6px hsl(var(--accent)))' }}>
              Traffic Brain
            </h1>
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center">
          <NavLinks />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden text-sm font-medium sm:inline">
            Conta Logada
          </span>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://picsum.photos/seed/123/40/40" alt="User" data-ai-hint="person avatar" />
            <AvatarFallback>TB</AvatarFallback>
          </Avatar>
          <MobileNav />
        </div>
      </header>
      <main className="relative flex-1 p-4 md:p-8">
        <RetroGrid />
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
