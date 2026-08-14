"use client";

import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ExportFormat = "json" | "csv";

async function downloadExport(format: ExportFormat) {
  const res = await fetch(`/api/export?format=${format}`);
  if (!res.ok) throw new Error(`Export failed (${res.status})`);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `job-tracker-export.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function ExportMenu() {
  const [loading, setLoading] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (loading) return;
    setLoading(format);
    try {
      await downloadExport(format);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          aria-label="Export data"
        >
          <Download className="h-[18px] w-[18px]" />
          Export data
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" sideOffset={10} className="w-48">
        <DropdownMenuItem
          disabled={loading !== null}
          onClick={() => handleExport("json")}
        >
          {loading === "json" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileJson className="h-4 w-4" />
          )}
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={loading !== null}
          onClick={() => handleExport("csv")}
        >
          {loading === "csv" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-4 w-4" />
          )}
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
