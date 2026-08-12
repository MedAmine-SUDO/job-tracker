"use client";

import { Application, ApplicationStatus, STATUS_LABELS } from "@/lib/core/domain/application";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ApplicationBoardProps {
  applications: Application[];
}

const ACTIVE_STATUSES: ApplicationStatus[] = [
  "wishlist", "applied", "phone_screen", "technical", "onsite", "offer",
];

export function ApplicationBoard({ applications }: ApplicationBoardProps) {
  const appsByStatus = ACTIVE_STATUSES.map((status) => ({
    status,
    apps: applications.filter((app) => app.status === status),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {appsByStatus.map(({ status, apps }) => (
        <div key={status} className="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/50">
          <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-semibold text-sm">{STATUS_LABELS[status]}</h3>
            <Badge variant="secondary" className="text-xs">{apps.length}</Badge>
          </div>
          <div className="flex flex-col gap-2 p-3">
            {apps.map((app) => (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <div className="rounded-md border bg-card p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                  <p className="font-medium text-sm truncate">{app.positionTitle}</p>
                  <p className="text-xs text-muted-foreground">{app.companyName}</p>
                </div>
              </Link>
            ))}
            {apps.length === 0 && (
              <div className="rounded-md border border-dashed p-4 text-center">
                <p className="text-xs text-muted-foreground">No applications</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}