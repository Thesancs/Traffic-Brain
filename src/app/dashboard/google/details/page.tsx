
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "../../meta/components/date-range-picker";
import Details from "../components/details";

export default function GoogleAdsDetailsPage() {

  return (
    <div className="text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-accent">Detalhamento Google Ads</h1>
          <p className="text-muted-foreground">Análise detalhada das suas campanhas.</p>
        </div>
      </div>

      <Tabs defaultValue="details">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
           <div className="flex-1"></div>
          <DateRangePicker />
        </div>
        <TabsContent value="details">
          <Details />
        </TabsContent>
      </Tabs>
    </div>
  );
}
