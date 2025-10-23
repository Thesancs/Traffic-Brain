"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { campaignSummary } from "../data";
import { formatCurrency, formatNumber } from "@/lib/formatters";

export function CampaignSummaryTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campanha</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead>Impressões</TableHead>
            <TableHead>Cliques</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>CPC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaignSummary.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>{formatCurrency(campaign.Custo)}</TableCell>
              <TableCell>{formatNumber(campaign.Impressoes)}</TableCell>
              <TableCell>{formatNumber(campaign.Cliques)}</TableCell>
              <TableCell>{campaign.CTR}</TableCell>
              <TableCell>{campaign.CPC}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
