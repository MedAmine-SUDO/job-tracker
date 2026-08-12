"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApplicationStore } from "@/lib/stores/application-store";
import { STATUS_LABELS } from "@/types";

export function StatusFilter() {
  const { statusFilter, setStatusFilter } = useApplicationStore();

  return (
    <Select
      value={statusFilter}
      onValueChange={(v) => setStatusFilter(v as any)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Statuses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}