"use client";

import { Application, ApplicationStatus, STATUS_LABELS } from "@/lib/core/domain/application";
import Link from "next/link";
import { STATUS_STYLES, avatarGradient, initials } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

interface ApplicationBoardProps {
  applications: Application[];
}

const ACTIVE_STATUSES: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "phone_screen",
  "technical",
  "onsite",
  "offer",
];

function daysSince(date: string | Date): number {
  return Math.max(
    0,
    Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  );
}

export function ApplicationBoard({ applications }: ApplicationBoardProps) {
  const appsByStatus = ACTIVE_STATUSES.map((status) => ({
    status,
    apps: applications.filter((app) => app.status === status),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {appsByStatus.map(({ status, apps }) => (
        <div key={status} className="flex w-72 shrink-0 flex-col rounded-xl border bg-muted/40">
          <div className="flex items-center justify-between border-b p-3.5">
            <div className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_STYLES[status].dot)} />
              <h3 className="font-semibold text-sm">{STATUS_LABELS[status]}</h3>
            </div>
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
                STATUS_STYLES[status].soft
              )}
            >
              {apps.length}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 p-3">
            {apps.map((app, i) => (
              <Link key={app.id} href={`/applications/${app.id}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="rounded-lg border bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white",
                        avatarGradient(app.companyName)
                      )}
                    >
                      {initials(app.companyName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{app.positionTitle}</p>
                      <p className="truncate text-xs text-muted-foreground">{app.companyName}</p>
                    </div>
                  </div>

                  {app.tags.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {app.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md bg-secondary/60 px-1.5 py-0.5 text-[11px] font-medium text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span
                        className={cn("h-1.5 w-1.5 rounded-full", STATUS_STYLES[status].dot)}
                      />
                      {daysSince(app.applicationDate)}d
                    </span>
                    {app.location && <span className="truncate pl-2">{app.location}</span>}
                  </div>
                </div>
              </Link>
            ))}

            {apps.length === 0 && (
              <div className="rounded-lg border border-dashed p-5 text-center">
                <p className="text-xs text-muted-foreground">No applications here</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
