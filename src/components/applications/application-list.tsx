"use client";

import { Application } from "@/lib/core/domain/application";
import Link from "next/link";
import { Building2, MapPin, Clock } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { STATUS_STYLES, avatarGradient, initials } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysSince(date: string | Date): number {
  return Math.max(
    0,
    Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  );
}

interface ApplicationListProps {
  applications: Application[];
}

export function ApplicationList({ applications }: ApplicationListProps) {
  return (
    <div className="space-y-3">
      {applications.map((app, i) => (
        <Link key={app.id} href={`/applications/${app.id}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
          <div
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
            )}
          >
            <div
              className={cn(
                "absolute inset-y-0 left-0 w-1 bg-gradient-to-b transition-all",
                STATUS_STYLES[app.status].bar
              )}
            />

            <div className="flex items-start gap-4 pl-2">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm",
                  avatarGradient(app.companyName)
                )}
              >
                {initials(app.companyName)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold group-hover:text-primary">
                    {app.positionTitle}
                  </h3>
                  <StatusBadge status={app.status} className="shrink-0" />
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {app.companyName}
                  </span>
                  {app.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {app.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {daysSince(app.applicationDate)}d ago
                  </span>
                  <span className="hidden text-xs sm:inline">
                    {formatDate(app.applicationDate)}
                  </span>
                </div>

                {app.tags.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {app.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {app.tags.length > 4 && (
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        +{app.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
