"use client";

import Link from "next/link";
import {
  Connection,
  CONNECTION_STATUS_LABELS,
  isFollowUpPending,
} from "@/lib/core/domain/connection";
import { CONNECTION_STATUS_STYLES } from "@/lib/connection-colors";
import { avatarGradient, initials } from "@/lib/status-colors";
import { cn } from "@/lib/utils";
import { ArrowRight, Handshake } from "lucide-react";

const STATUS_PRIORITY: Record<string, number> = { messaged: 0, to_reach_out: 1 };
const MAX_VISIBLE = 5;

function toTimestamp(c: Connection): number {
  return c.createdAt instanceof Date
    ? c.createdAt.getTime()
    : new Date(c.createdAt).getTime();
}

interface FollowUpPanelProps {
  connections: Connection[];
}

export function FollowUpPanel({ connections }: FollowUpPanelProps) {
  const pending = connections
    .filter((c) => isFollowUpPending(c.status))
    .sort((a, b) => {
      const diff = (STATUS_PRIORITY[a.status] ?? 2) - (STATUS_PRIORITY[b.status] ?? 2);
      return diff !== 0 ? diff : toTimestamp(a) - toTimestamp(b);
    })
    .slice(0, MAX_VISIBLE);

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md shadow-orange-500/30">
            <Handshake className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-bold tracking-tight">Follow up with</h2>
            <p className="text-xs text-muted-foreground">
              {pending.length === 0
                ? "Nothing waiting on you"
                : `${pending.length} connection${pending.length === 1 ? "" : "s"} still need a nudge`}
            </p>
          </div>
        </div>
        <Link
          href="/connections"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {pending.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
          You&apos;re all caught up. Add connections from the Connections page to start
          tracking follow-ups.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {pending.map((connection) => {
            const style = CONNECTION_STATUS_STYLES[connection.status];
            return (
              <li
                key={connection.id}
                className="flex items-center gap-3 rounded-xl border bg-card/60 px-3 py-2.5 transition-colors hover:bg-accent/40"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white shadow-sm",
                    avatarGradient(connection.name)
                  )}
                >
                  {initials(connection.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{connection.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {connection.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    style.badge
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                  {CONNECTION_STATUS_LABELS[connection.status]}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
