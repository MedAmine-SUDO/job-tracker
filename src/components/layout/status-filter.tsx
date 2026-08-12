"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_LABELS, type ApplicationStatus } from "@/lib/core/domain/application";
import { STATUS_STYLES } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

export function StatusFilter() {
  return (
    <Select defaultValue="all">
      <SelectTrigger className="w-full sm:w-[190px]">
        <SelectValue placeholder="All Statuses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted-foreground" />
            All Statuses
          </span>
        </SelectItem>
        {(Object.entries(STATUS_LABELS) as [ApplicationStatus, string][]).map(
          ([value, label]) => (
            <SelectItem key={value} value={value}>
              <span className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", STATUS_STYLES[value].dot)} />
                {label}
              </span>
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
}
