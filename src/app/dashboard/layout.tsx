
"use client";

import RetroGrid from "@/components/magicui/retro-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "./components/sidebar";
import { MobileSidebar } from "./components/mobile-sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Facebook, Chrome, Plug } from "lucide-react";
import { useState, useEffect } from "react";
import { PlatformLoading } from "./components/platform-loading";

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556v2.177c.144.715.54 1.617 1.235 2.512C10.895 11.39 11.797 12 13 12v2.19c-1.7-.016-2.618-.59-3.5-1.556-.983.996-2.17 1.57-3.5 1.556V6.177c-1.32.016-2.517-.556-3.5-1.556v-2.2c1.32.016 2.517.556 3.5 1.556V0Z"/>
  </svg>
);

const topNavLinks = [
  { name: "Meta Ads", href: "/dashboard/meta", icon: <Facebook /> },
  { name: "Google Ads", href: "/dashboard/google", icon: <Chrome /> },
  { name: "TikTok Ads", href: "/dashboard/tiktok", icon: <TikTokIcon /> },
  { name: "Integrações", href: "/dashboard/integrations", icon: <Plug /> },
];

function HeaderNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
      {topNavLinks.map(link => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            "flex items-center gap-2 text-sm font-medium rounded-md px-3 py-2 transition-colors hover:bg-muted",
            isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground"
          )}
        >
          {link.icon}
          {link.name}
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
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate loading time

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          <MobileSidebar />
          <HeaderNav />

          <div className="w-full flex-1">
            {/* Can add a search bar here if needed */}
          </div>
          <span className="hidden text-sm font-medium sm:inline">
            Conta Logada
          </span>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://picsum.photos/seed/123/40/40" alt="User" data-ai-hint="person avatar" />
            <AvatarFallback>TB</AvatarFallback>
          </Avatar>
        </header>
        <main className="relative flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
           <RetroGrid />
           {loading && <PlatformLoading />}
           <div className={cn("relative z-10 transition-opacity duration-500", loading && "opacity-0")}>{children}</div>
        </main>
      </div>
    </div>
  );
}
