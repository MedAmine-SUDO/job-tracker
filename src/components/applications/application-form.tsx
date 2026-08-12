"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationStatus, WorkType, STATUS_LABELS } from "@/lib/core/domain/application";

async function createApplication(data: any) {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company *</label>
            <Input required placeholder="e.g., Google" value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Position *</label>
            <Input required placeholder="e.g., Senior Frontend Engineer" value={formData.positionTitle}
              onChange={(e) => setFormData({ ...formData, positionTitle: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as ApplicationStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Work Type</label>
            <Select value={formData.workType} onValueChange={(v) => setFormData({ ...formData, workType: v as WorkType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input placeholder="e.g., San Francisco, CA" value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Source</label>
            <Input placeholder="e.g., LinkedIn, Referral" value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job Posting URL</label>
          <Input type="url" placeholder="https://..." value={formData.jobPostingUrl}
            onChange={(e) => setFormData({ ...formData, jobPostingUrl: e.target.value })} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job Description</label>
          <Textarea placeholder="Paste the full job description here..." rows={6}
            value={formData.jobDescriptionText}
            onChange={(e) => setFormData({ ...formData, jobDescriptionText: e.target.value })} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags (comma separated)</label>
          <Input placeholder="e.g., dream-job, remote, react" value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea placeholder="Any additional notes..." rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
        </div>
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Saving..." : "Save Application"}
      </Button>
    </form>
  );
}