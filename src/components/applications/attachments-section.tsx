"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Attachment,
  AttachmentCategory,
  CATEGORY_LABELS,
} from "@/lib/core/domain/application";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Paperclip,
  Loader2,
  Trash2,
  Download,
  CheckCircle2,
} from "lucide-react";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as AttachmentCategory[];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AttachmentsSection({
  applicationId,
  attachments,
}: {
  applicationId: string;
  attachments?: Attachment[];
}) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<AttachmentCategory>("resume");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
  };

  const handleCategoryChange = (value: AttachmentCategory) => {
    setCategory(value);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      const res = await fetch(`/api/applications/${applicationId}/attachments`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!confirm("Delete this attachment?")) return;
    setError(null);
    try {
      const res = await fetch(
        `/api/applications/${applicationId}/attachments/${attachmentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const existingForCategory = attachments?.find((a) => a.category === category);

  return (
    <section className="rounded-xl border bg-card p-6">
      <h2 className="mb-4 flex items-center gap-2 font-semibold">
        <Paperclip className="h-4 w-4 text-sky-500" />
        Attachments
        {attachments && attachments.length > 0 && (
          <span className="text-xs font-normal text-muted-foreground">
            {attachments.length}
          </span>
        )}
      </h2>

      <div className="mb-5 rounded-lg border border-dashed bg-muted/30 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value as AttachmentCategory)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>

          <input
            ref={fileInputRef}
            type="file"
            className="h-10 flex-1 cursor-pointer rounded-lg border border-input bg-background px-2 text-sm text-muted-foreground file:mr-3 file:h-full file:cursor-pointer file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:text-sm file:font-medium file:text-secondary-foreground hover:file:bg-secondary/80"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          />

          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload
          </Button>
        </div>
        {file ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {file.name} • {formatFileSize(file.size)}
          </p>
        ) : existingForCategory ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            {CATEGORY_LABELS[category]} already uploaded: {existingForCategory.fileName}
          </p>
        ) : null}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      {attachments && attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3.5 py-3 text-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{attachment.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-sky-600 dark:text-sky-400">
                    {CATEGORY_LABELS[attachment.category]}
                  </span>{" "}
                  • {formatFileSize(attachment.fileSize)} •{" "}
                  {formatDate(attachment.uploadedAt)}
                </p>
              </div>
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${attachment.fileName}`}
              >
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Download className="h-4 w-4" />
                </Button>
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleDelete(attachment.id)}
                aria-label={`Delete ${attachment.fileName}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No attachments yet. Upload your resume, cover letter, or job description.
        </p>
      )}
    </section>
  );
}
