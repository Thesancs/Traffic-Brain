"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "./components/overview";
import Details from "./components/details";
import { DashboardLoadingSkeleton } from "@/app/dashboard/meta/components/dashboard-loading-skeleton";
import { DashboardErrorState } from "@/app/dashboard/meta/components/dashboard-error-state";
import { DateRangePicker } from "@/app/dashboard/meta/components/date-range-picker";
import Link from "next/link";


export default function GoogleAdsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        try {
          // Data fetch simulation
        } catch (e: any)          setError(e.message || "Ocorreu um erro desconhecido.");
        } finally {
          setLoading(false);
        }
      }, 1500);
  
      return () => clearTimeout(timer);
    }, []);
  
    if (loading) {
      return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                <h1 className="text-3xl font-bold font-headline text-accent">Dashboard Google Ads</h1>
                <p className="text-muted-foreground">Análise de performance das suas campanhas.</p>
                </div>
            </div>
            <Tabs defaultValue="overview">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <TabsList>
                  <TabsTrigger value="overview" asChild><Link href="/dashboard/google">Visão Geral</Link></TabsTrigger>
                  <TabsTrigger value="details" asChild><Link href="/dashboard/google/details">Detalhamento</Link></TabsTrigger>
                </TabsList>
                <DateRangePicker />
              </div>
              <TabsContent value="overview">
                  <DashboardLoadingSkeleton />
              </TabsContent>
            </Tabs>
        </div>
      )
    }
  
    if (error) {
      return <DashboardErrorState message={error} />;
    }

  return (
    <div className="text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-accent">Dashboard Google Ads</h1>
          <p className="text-muted-foreground">Análise de performance das suas campanhas.</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview" asChild><Link href="/dashboard/google">Visão Geral</Link></TabsTrigger>
            <TabsTrigger value="details" asChild><Link href="/dashboard/google/details">Detalhamento</Link></TabsTrigger>
          </TabsList>
          <DateRangePicker />
        </div>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
