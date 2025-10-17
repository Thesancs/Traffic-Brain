"use client";

import RetroGrid from "@/components/magicui/retro-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrainCircuit, Chrome, Facebook, LayoutDashboard, Plug } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

function NavLinks() {
  const pathname = usePathname();

  const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556v2.177c.144.715.54 1.617 1.235 2.512C10.895 11.39 11.797 12 13 12v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556V6.177c-1.32.016-2.517-.556-3.5-1.556v-2.2c1.32.016 2.517.556 3.5 1.556V0Z"/>
    </svg>
  );


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
          <Link
            href="/dashboard/google"
            className={`flex items-center gap-2 transition-colors hover:text-accent ${pathname.startsWith('/dashboard/google') ? 'text-accent' : 'text-muted-foreground'}`}
          >
            <Chrome className="size-4" />
            Google Ads
            <ChevronDown className="size-3" />
          </Link>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg text-accent" style={{ filter: 'drop-shadow(0 0 6px hsl(var(--accent)))' }}>
            <BrainCircuit className="size-6" />
          </div>
          <h1 className="text-xl font-bold text-accent font-headline" style={{ filter: 'drop-shadow(0 0 6px hsl(var(--accent)))' }}>
            Traffic Brain
          </h1>
        </div>
        <div className="flex items-center w-full justify-center">
            <NavLinks />
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <span className="hidden text-sm font-medium sm:inline">
            Conta Logada
          </span>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://picsum.photos/seed/123/40/40" alt="User" data-ai-hint="person avatar" />
            <AvatarFallback>TB</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="relative flex-1 p-4 md:p-8">
        <RetroGrid />
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
