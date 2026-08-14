"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Connection,
  ConnectionStatus,
  CONNECTION_PURPOSE_LABELS,
  CONNECTION_STATUS_LABELS,
} from "@/lib/core/domain/connection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { avatarGradient, initials } from "@/lib/status-colors";
import { CONNECTION_STATUS_STYLES, CONNECTION_PURPOSE_STYLES } from "@/lib/connection-colors";
import { cn } from "@/lib/utils";
import { Linkedin, Pencil, Trash2, StickyNote, ExternalLink } from "lucide-react";

function purposeText(connection: Connection): string {
  return connection.purpose === "other" && connection.customPurpose
    ? connection.customPurpose
    : CONNECTION_PURPOSE_LABELS[connection.purpose];
}

interface ConnectionListProps {
  connections: Connection[];
  onEdit: (connection: Connection) => void;
}

export function ConnectionList({ connections, onEdit }: ConnectionListProps) {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ConnectionStatus }) => {
      const res = await fetch(`/api/connections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["connections"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/connections/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["connections"] }),
  });

  return (
    <div className="space-y-3">
      {connections.map((connection, i) => {
        const statusStyle = CONNECTION_STATUS_STYLES[connection.status];
        return (
          <div
            key={connection.id}
            className="group animate-fade-in-up rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm",
                  avatarGradient(connection.name)
                )}
              >
                {initials(connection.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold">{connection.name}</h3>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      CONNECTION_PURPOSE_STYLES[connection.purpose]
                    )}
                  >
                    {purposeText(connection)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      statusStyle.badge
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusStyle.dot)} />
                    {CONNECTION_STATUS_LABELS[connection.status]}
                  </span>
                </div>

                <a
                  href={connection.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  <span className="max-w-[28ch] truncate">{connection.linkedinUrl}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                {connection.notes && (
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
                    <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-2">{connection.notes}</span>
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => onEdit(connection)}
                    aria-label={`Edit ${connection.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (confirm(`Remove ${connection.name}?`)) {
                        remove.mutate(connection.id);
                      }
                    }}
                    aria-label={`Delete ${connection.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Select
                  value={connection.status}
                  onValueChange={(v) =>
                    updateStatus.mutate({ id: connection.id, status: v as ConnectionStatus })
                  }
                >
                  <SelectTrigger className="h-8 w-[130px] text-xs" aria-label="Update status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONNECTION_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
