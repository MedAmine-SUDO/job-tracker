"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationStatus, WorkType, STATUS_LABELS } from "@/lib/core/domain/application";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Briefcase, MapPin, Link as LinkIcon, FileText, Tags, StickyNote, Share2 } from "lucide-react";

async function createApplication(data: any) {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
}

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b pb-2">
      <span className="text-indigo-500">{icon}</span>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
    </div>
  );
}

export function ApplicationForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    companyName: "",
    positionTitle: "",
    status: "applied" as ApplicationStatus,
    jobPostingUrl: "",
    jobDescriptionText: "",
    location: "",
    workType: "unknown" as WorkType,
    source: "",
    tags: "",
    notes: "",
  });

  const mutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      router.push("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  const set = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <SectionHeader icon={<Briefcase className="h-4 w-4" />} title="Position" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company" required>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                required
                placeholder="e.g., Google"
                className="pl-9"
                value={formData.companyName}
                onChange={(e) => set("companyName", e.target.value)}
              />
            </div>
          </Field>
          <Field label="Position" required>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                required
                placeholder="e.g., Senior Frontend Engineer"
                className="pl-9"
                value={formData.positionTitle}
                onChange={(e) => set("positionTitle", e.target.value)}
              />
            </div>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Select
                  value={formData.status}
                  onValueChange={(v) => set("status", v as ApplicationStatus)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <StatusBadge status={formData.status} className="shrink-0" />
            </div>
          </Field>
          <Field label="Work Type">
            <Select
              value={formData.workType}
              onValueChange={(v) => set("workType", v as WorkType)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeader icon={<MapPin className="h-4 w-4" />} title="Location & Source" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="e.g., San Francisco, CA"
                className="pl-9"
                value={formData.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
          </Field>
          <Field label="Source">
            <div className="relative">
              <Share2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="e.g., LinkedIn, Referral"
                className="pl-9"
                value={formData.source}
                onChange={(e) => set("source", e.target.value)}
              />
            </div>
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeader icon={<FileText className="h-4 w-4" />} title="Details" />
        <Field label="Job Posting URL">
          <div className="relative">
            <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://..."
              className="pl-9"
              value={formData.jobPostingUrl}
              onChange={(e) => set("jobPostingUrl", e.target.value)}
            />
          </div>
        </Field>

        <Field label="Job Description">
          <Textarea
            placeholder="Paste the full job description here..."
            rows={6}
            value={formData.jobDescriptionText}
            onChange={(e) => set("jobDescriptionText", e.target.value)}
          />
        </Field>

        <Field label="Tags">
          <div className="relative">
            <Tags className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="e.g., dream-job, remote, react"
              className="pl-9"
              value={formData.tags}
              onChange={(e) => set("tags", e.target.value)}
            />
          </div>
        </Field>

        <Field label="Notes">
          <div className="relative">
            <StickyNote className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Textarea
              placeholder="Any additional notes..."
              rows={3}
              className="pl-9"
              value={formData.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </Field>
      </div>

      <Button type="submit" disabled={mutation.isPending} size="lg" className="w-full">
        {mutation.isPending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Saving...
          </span>
        ) : (
          "Save Application"
        )}
      </Button>
    </form>
  );
}
