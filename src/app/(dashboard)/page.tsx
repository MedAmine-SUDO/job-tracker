"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApplicationList } from "@/components/applications/application-list";
import { ApplicationBoard } from "@/components/applications/application-board";
import { SearchBar } from "@/components/layout/search-bar";
import { StatusFilter } from "@/components/layout/status-filter";
import { Button } from "@/components/ui/button";
import {
  Plus,
  LayoutGrid,
  List,
  Briefcase,
  Layers,
  Radio,
  Trophy,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Application, ApplicationStatus } from "@/lib/core/domain/application";

async function fetchApplications(): Promise<Application[]> {
  const res = await fetch("/api/applications");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

const ACTIVE_STATUSES: ApplicationStatus[] = [
  "applied",
  "phone_screen",
  "technical",
  "onsite",
];

const INTERVIEW_STATUSES: ApplicationStatus[] = [
  "phone_screen",
  "technical",
  "onsite",
];

const OFFER_STATUSES: ApplicationStatus[] = ["offer", "accepted"];

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}

function StatCard({ label, value, icon, gradient }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${gradient}`} />
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-none tabular-nums">{value}</p>
          <p className="mt-1 truncate text-xs font-medium text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const { data: applications = [], isPending } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });

  const stats = {
    total: applications.length,
    active: applications.filter((a) => ACTIVE_STATUSES.includes(a.status)).length,
    interviews: applications.filter((a) => INTERVIEW_STATUSES.includes(a.status)).length,
    offers: applications.filter((a) => OFFER_STATUSES.includes(a.status)).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick look at where your applications stand.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start rounded-lg border bg-card p-1 shadow-sm sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-accent text-accent-foreground" : ""}
          >
            <List className="h-4 w-4" />
            <span className="hidden md:inline">List</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("board")}
            className={viewMode === "board" ? "bg-accent text-accent-foreground" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden md:inline">Board</span>
          </Button>
          <Link href="/applications/new" className="md:hidden">
            <Button size="sm" className="ml-1">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Applications"
          value={stats.total}
          icon={<Layers className="h-5 w-5" />}
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          label="Active"
          value={stats.active}
          icon={<Briefcase className="h-5 w-5" />}
          gradient="from-sky-500 to-blue-600"
        />
        <StatCard
          label="In Interviews"
          value={stats.interviews}
          icon={<Radio className="h-5 w-5" />}
          gradient="from-rose-500 to-red-500"
        />
        <StatCard
          label="Offers"
          value={stats.offers}
          icon={<Trophy className="h-5 w-5" />}
          gradient="from-emerald-500 to-teal-600"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar />
        <StatusFilter />
      </div>

      {isPending ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        </div>
      ) : applications.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-dashed bg-card/50 py-24 text-center">
          <div className="bg-hero-gradient pointer-events-none absolute inset-0" />
          <div className="relative mx-auto flex max-w-sm flex-col items-center px-6">
            <div className="bg-brand-gradient mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg shadow-orange-500/30">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold">No applications yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Start tracking your job hunt. Add your first application and watch
              your pipeline come to life.
            </p>
            <Link href="/applications/new" className="mt-6">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Add your first application
              </Button>
            </Link>
          </div>
        </div>
      ) : viewMode === "list" ? (
        <ApplicationList applications={applications} />
      ) : (
        <ApplicationBoard applications={applications} />
      )}
    </div>
  );
}
