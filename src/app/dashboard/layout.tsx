"use client";

import RetroGrid from "@/components/magicui/retro-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrainCircuit, Menu } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./components/sidebar";
import { MobileSidebar } from "./components/mobile-sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          <MobileSidebar />

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
           <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
