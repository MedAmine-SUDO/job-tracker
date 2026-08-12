"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Linkedin,
  Calendar,
  MapPin,
  Building2,
  FileText,
  StickyNote,
  Users,
  Mic,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { Application, WORK_TYPE_LABELS } from "@/lib/core/domain/application";
import { StatusBadge } from "@/components/ui/status-badge";
import { initials } from "@/lib/status-colors";

async function fetchApplication(id: string): Promise<Application> {
  const res = await fetch(`/api/applications/${id}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysSince(date: string | Date): number {
  const d = new Date(date);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const { data: app, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: () => fetchApplication(id as string),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Application not found</p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="outline">Go Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="bg-hero-gradient pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="bg-brand-gradient flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
              {initials(app.companyName)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{app.positionTitle}</h1>
                <StatusBadge status={app.status} />
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {app.companyName}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Applied {formatDate(app.applicationDate)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" />
                  {daysSince(app.applicationDate)} days ago
                </span>
                {app.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {app.location}
                  </span>
                )}
                {app.workType !== "unknown" && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    {WORK_TYPE_LABELS[app.workType]}
                  </span>
                )}
              </div>

              {app.jobPostingUrl && (
                <a
                  href={app.jobPostingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  View Job Posting <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {app.jobDescriptionText && (
        <section className="rounded-xl border bg-card p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4 text-indigo-500" />
            Job Description
          </h2>
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {app.jobDescriptionText}
          </div>
        </section>
      )}

      {app.notes && (
        <section className="rounded-xl border bg-card p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <StickyNote className="h-4 w-4 text-amber-500" />
            Notes
          </h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {app.notes}
          </p>
        </section>
      )}

      {app.contacts && app.contacts.length > 0 && (
        <section className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Users className="h-4 w-4 text-emerald-500" />
            Contacts
            <span className="text-xs font-normal text-muted-foreground">
              {app.contacts.length}
            </span>
          </h2>
          <div className="space-y-2.5">
            {app.contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3.5 py-3 text-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                  {initials(contact.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{contact.name}</p>
                  {contact.role && (
                    <p className="truncate text-muted-foreground">{contact.role}</p>
                  )}
                </div>
                {contact.email && (
                  <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.name}`}>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                {contact.linkedinUrl && (
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn profile of ${contact.name}`}
                  >
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {app.interviews && app.interviews.length > 0 && (
        <section className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Mic className="h-4 w-4 text-fuchsia-500" />
            Interviews
            <span className="text-xs font-normal text-muted-foreground">
              {app.interviews.length}
            </span>
          </h2>
          <div className="space-y-2.5">
            {app.interviews.map((interview) => (
              <div
                key={interview.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3.5 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{interview.round}</p>
                  <p className="text-muted-foreground">
                    {formatDate(interview.scheduledDate)} •{" "}
                    <span className="capitalize">{interview.format}</span>
                  </p>
                </div>
                {interview.rating ? (
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={i < interview.rating! ? "text-amber-400" : "text-muted-foreground/30"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2.5 py-0.5 text-xs font-semibold text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300">
                    {interview.completed ? "Completed" : "Upcoming"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {!app.jobDescriptionText &&
        !app.notes &&
        !app.contacts?.length &&
        !app.interviews?.length && (
          <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
            Nothing added yet for this application.
          </div>
        )}
    </div>
  );
}
