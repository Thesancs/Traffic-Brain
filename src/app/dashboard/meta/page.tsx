"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "./components/overview";
import Details from "./components/details";
import { DashboardLoadingSkeleton } from "./components/dashboard-loading-skeleton";
import { DashboardErrorState } from "./components/dashboard-error-state";
import { DateRangePicker } from "./components/date-range-picker";


export default function MetaAdsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        try {
          // Data fetch simulation
        } catch (e: any) {
          setError(e.message || "Ocorreu um erro desconhecido.");
        } finally {
          setLoading(false);
        }
      }, 1500);
  
      return () => clearTimeout(timer);
    }, []);
  
    if (loading) {
      return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                <h1 className="text-3xl font-bold font-headline text-accent">Dashboard Meta Ads</h1>
                <p className="text-muted-foreground">Análise de performance das suas campanhas.</p>
                </div>
            </div>
            <Tabs defaultValue="overview">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="details">Detalhamento</TabsTrigger>
                </TabsList>
                <DateRangePicker />
              </div>
              <TabsContent value="overview">
                  <DashboardLoadingSkeleton />
              </TabsContent>
              <TabsContent value="details">
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline text-accent">Dashboard Meta Ads</h1>
          <p className="text-muted-foreground">Análise de performance das suas campanhas.</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="details">Detalhamento</TabsTrigger>
          </TabsList>
          <DateRangePicker />
        </div>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="details">
          <Details />
        </TabsContent>
      </Tabs>
    </div>
  );
}
