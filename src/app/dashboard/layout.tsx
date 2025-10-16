"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BrainCircuit, Facebook } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLinks() {
  const pathname = usePathname();
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
          <Link href="/dashboard">Dashboard</Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === '/meta'}>
          <Link href="/meta">
            <Facebook className="size-4 mr-2" />
            Meta Ads
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// Since we are using 'use client', we can't export metadata directly.
// We'll manage the title in the RootLayout or individual pages if needed.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg border border-primary/20">
              <BrainCircuit className="size-6" />
            </div>
            <h1 className="text-xl font-bold font-headline text-foreground">
              Traffic Brain
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavLinks />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between h-16 px-4 border-b shrink-0 md:px-8">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium sm:inline">
              Conta Logada
            </span>
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://picsum.photos/seed/123/40/40" alt="User" data-ai-hint="person avatar" />
              <AvatarFallback>TB</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
