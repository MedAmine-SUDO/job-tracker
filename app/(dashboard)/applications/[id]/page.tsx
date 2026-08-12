"use client";

import { useParams } from "next/navigation";
import { useApplicationStore } from "@/lib/stores/application-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Mail, Linkedin } from "lucide-react";
import Link from "next/link";
import { formatDate, daysSince } from "@/lib/utils";
import { STATUS_LABELS } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const { applications } = useApplicationStore();
  const app = applications.find((a) => a.id === id);

  if (!app) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Application not found</p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="outline">Go Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">{app.companyName}</h1>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl py-8 space-y-8">
        {/* Header Card */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{app.positionTitle}</h2>
              <p className="text-muted-foreground mt-1">{app.companyName}</p>
            </div>
            <Badge variant="secondary" className="status-pill">
              {STATUS_LABELS[app.status]}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Applied: {formatDate(app.applicationDate)}</span>
            <span>•</span>
            <span>{daysSince(app.applicationDate)} days ago</span>
            {app.location && (
              <>
                <span>•</span>
                <span>{app.location}</span>
              </>
            )}
            {app.workType !== "unknown" && (
              <>
                <span>•</span>
                <span className="capitalize">{app.workType}</span>
              </>
            )}
          </div>

          {app.jobPostingUrl && (
            <a
              href={app.jobPostingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View Job Posting <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Job Description */}
        {app.jobDescriptionText && (
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-3">Job Description</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {app.jobDescriptionText}
            </div>
          </div>
        )}

        {/* Notes */}
        {app.notes && (
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-3">Notes</h3>
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">{app.notes}</p>
          </div>
        )}

        {/* Contacts */}
        {app.contacts && app.contacts.length > 0 && (
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-3">Contacts</h3>
            <div className="space-y-3">
              {app.contacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{contact.name}</p>
                    {contact.role && <p className="text-muted-foreground">{contact.role}</p>}
                  </div>
                  {contact.email && (
                    <a href={`mailto:${contact.email}`}>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {contact.linkedinUrl && (
                    <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interviews */}
        {app.interviews && app.interviews.length > 0 && (
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-3">Interviews</h3>
            <div className="space-y-3">
              {app.interviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between text-sm border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{interview.round}</p>
                    <p className="text-muted-foreground">
                      {formatDate(interview.scheduledDate)} • {interview.format}
                    </p>
                  </div>
                  {interview.rating && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < interview.rating! ? "text-yellow-500" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}