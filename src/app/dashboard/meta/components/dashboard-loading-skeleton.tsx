"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardLoadingSkeleton = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
        <Card key={i} className="glass-card border-white/10">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-1/2 h-8" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card border-white/10">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
