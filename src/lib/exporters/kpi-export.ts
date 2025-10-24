import type { ExportRow } from "@/app/dashboard/data";

const DEFAULT_FILENAME_PREFIX = "KPI";

const buildFilename = () => {
  const now = new Date();
  const formatted = now.toISOString().split("T")[0];
  return `${DEFAULT_FILENAME_PREFIX}_${formatted}.xlsx`;
};

export const exportKpiWorkbook = async (rows: ExportRow[], filename = buildFilename()) => {
  if (!rows.length) return;
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "KPIs");
  XLSX.writeFile(workbook, filename, { bookType: "xlsx" });
};
