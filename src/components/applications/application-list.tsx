"use client";

import { Application, STATUS_LABELS } from "@/lib/core/domain/application";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Clock } from "lucide-react";

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysSince(date: string | Date): number {
  return Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

interface ApplicationListProps {
  applications: Application[];
}

export function ApplicationList({ applications }: ApplicationListProps) {
  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <Link key={app.id} href={`/applications/${app.id}`}>
          <div className="group rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{app.positionTitle}</h3>
                  <Badge variant="secondary" className="shrink-0">
                    {STATUS_LABELS[app.status]}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {app.companyName}
                  </span>
                  {app.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {app.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {daysSince(app.applicationDate)}d
                  </span>
                </div>
                {app.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {app.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(app.applicationDate)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}