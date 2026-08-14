"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Connection,
  ConnectionPurpose,
  ConnectionStatus,
  CONNECTION_PURPOSE_LABELS,
  CONNECTION_STATUS_LABELS,
} from "@/lib/core/domain/connection";
import { User, Link as LinkIcon, Loader2, X } from "lucide-react";

interface ConnectionFormProps {
  connection?: Connection;
  onDone: () => void;
}

export function ConnectionForm({ connection, onDone }: ConnectionFormProps) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(connection);

  const [formData, setFormData] = useState({
    name: connection?.name ?? "",
    linkedinUrl: connection?.linkedinUrl ?? "",
    purpose: (connection?.purpose ?? "discuss_opportunity") as ConnectionPurpose,
    customPurpose: connection?.customPurpose ?? "",
    status: (connection?.status ?? "to_reach_out") as ConnectionStatus,
    notes: connection?.notes ?? "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formData,
        customPurpose:
          formData.purpose === "other" && formData.customPurpose.trim()
            ? formData.customPurpose.trim()
            : null,
      };
      const res = await fetch(
        isEditing ? `/api/connections/${connection!.id}` : "/api/connections",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      onDone();
    },
  });

  const set = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {isEditing ? "Edit Connection" : "Add a Connection"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onDone} aria-label="Close" className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Name <span className="text-destructive"> *</span>
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              required
              placeholder="e.g., Sarah Johnson"
              className="pl-9"
              value={formData.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            LinkedIn Profile <span className="text-destructive"> *</span>
          </label>
          <div className="relative">
            <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              required
              type="url"
              placeholder="https://www.linkedin.com/in/..."
              className="pl-9"
              value={formData.linkedinUrl}
              onChange={(e) => set("linkedinUrl", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Purpose <span className="text-destructive"> *</span>
          </label>
          <Select
            value={formData.purpose}
            onValueChange={(v) => set("purpose", v as ConnectionPurpose)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(CONNECTION_PURPOSE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={formData.status}
            onValueChange={(v) => set("status", v as ConnectionStatus)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(CONNECTION_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.purpose === "other" && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Custom Purpose</label>
          <Input
            placeholder="e.g., They posted an open role in my field"
            value={formData.customPurpose}
            onChange={(e) => set("customPurpose", e.target.value)}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          placeholder="Why you want to message them, what to say..."
          rows={3}
          value={formData.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            isEditing ? "Save Changes" : "Add Connection"
          )}
        </Button>
      </div>
    </form>
  );
}
