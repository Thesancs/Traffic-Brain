"use client";

import RetroGrid from "@/components/magicui/retro-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrainCircuit, Chrome, Facebook, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
      <Link
        href="/dashboard"
        className={`flex items-center gap-2 transition-colors hover:text-foreground ${pathname === '/dashboard' ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <LayoutDashboard className="size-4" />
        Dashboard
      </Link>
      <Link
        href="/dashboard/meta"
        className={`flex items-center gap-2 transition-colors hover:text-foreground ${pathname.startsWith('/dashboard/meta') ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <Facebook className="size-4" />
        Meta Ads
      </Link>
      <Link
        href="/dashboard/google"
        className={`flex items-center gap-2 transition-colors hover:text-foreground ${pathname.startsWith('/dashboard/google') ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <Chrome className="size-4" />
        Google Ads
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
          <div className="bg-primary/10 text-primary p-2 rounded-lg border border-primary/20">
            <BrainCircuit className="size-6" />
          </div>
          <h1 className="text-xl font-bold font-headline text-foreground">
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
