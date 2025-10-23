"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { detailedMetrics } from "../data";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function ComparisonTable() {
  const getRoasColor = (roas: number) => {
    if (roas >= 5.5) return 'text-green-400';
    if (roas < 4.5) return 'text-red-400';
    return '';
  };

  const getCplColor = (cpl: number) => {
    if (cpl <= 15) return 'text-green-400';
    if (cpl > 25) return 'text-red-400';
    return '';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campanha</TableHead>
            <TableHead>Checkouts</TableHead>
            <TableHead>Gasto</TableHead>
            <TableHead>Receita</TableHead>
            <TableHead>CPL</TableHead>
            <TableHead>ROAS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {detailedMetrics.comparisonTable.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.Campanha}</TableCell>
              <TableCell>{formatNumber(row.Checkouts)}</TableCell>
              <TableCell>{formatCurrency(row.Gasto)}</TableCell>
              <TableCell>{formatCurrency(row.Receita)}</TableCell>
              <TableCell className={getCplColor(row.CPL)}>{formatCurrency(row.CPL)}</TableCell>
              <TableCell className={getRoasColor(row.ROAS)}>{row.ROAS.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
