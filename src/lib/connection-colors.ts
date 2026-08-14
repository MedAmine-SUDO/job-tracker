import type { ConnectionPurpose, ConnectionStatus } from "@/lib/core/domain/connection";

export const CONNECTION_STATUS_STYLES: Record<
  ConnectionStatus,
  { badge: string; dot: string; soft: string }
> = {
  to_reach_out: {
    badge: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    dot: "bg-amber-500",
    soft: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  messaged: {
    badge: "border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
    dot: "bg-sky-500",
    soft: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  replied: {
    badge: "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
    soft: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  not_interested: {
    badge: "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400",
    dot: "bg-zinc-400 dark:bg-zinc-600",
    soft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

export const CONNECTION_PURPOSE_STYLES: Record<
  ConnectionPurpose,
  string
> = {
  discuss_opportunity: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  look_for_opportunity: "border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  apply_for_opportunity: "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
  referral: "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  other: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};
