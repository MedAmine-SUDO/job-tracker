"use client";

import { ApplicationForm } from "@/components/applications/application-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NewApplicationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon" aria-label="Back to dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md shadow-indigo-500/30">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">New Application</h1>
            <p className="text-xs text-muted-foreground">
              Add a job to start tracking it
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
        <ApplicationForm />
      </div>
    </div>
  );
}
