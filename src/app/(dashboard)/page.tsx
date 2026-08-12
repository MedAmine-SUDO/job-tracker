"use client";

import { useEffect, useState } from "react;
import { useQuery } from "@tanstack/react-query";
import { ApplicationList } from "@/components/applications/application-list";
import { ApplicationBoard } from "@/components/applications/application-board";
import { SearchBar } from "@/components/layout/search-bar";
import { StatusFilter } from "@/components/layout/status-filter";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { Application } from "@/lib/core/domain/application";

async function fetchApplications(): Promise<Application[]> {
  const res = await fetch("/api/applications");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4">
          <h1 className="text-lg font-semibold tracking-tight">Job Tracker</h1>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-accent" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("board")}
              className={viewMode === "board" ? "bg-accent" : ""}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Link href="/applications/new">
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                New
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchBar />
          <StatusFilter />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No applications yet</p>
            <p className="text-sm">Add your first job application to get started</p>
            <Link href="/applications/new" className="mt-4">
              <Button>Add Application</Button>
            </Link>
          </div>
        ) : viewMode === "list" ? (
          <ApplicationList applications={applications} />
        ) : (
          <ApplicationBoard applications={applications} />
        )}
      </main>
    </div>
  );
}