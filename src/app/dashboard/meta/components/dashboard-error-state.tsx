"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const DashboardErrorState = ({ message }: { message: string }) => (
  <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
    <AlertCircle className="w-4 h-4" />
    <AlertTitle>Erro ao carregar o dashboard</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);
