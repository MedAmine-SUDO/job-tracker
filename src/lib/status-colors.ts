import type { ApplicationStatus } from "@/lib/core/domain/application";

export interface StatusStyle {
  badge: string;
  dot: string;
  bar: string;
  soft: string;
}

export const STATUS_STYLES: Record<ApplicationStatus, StatusStyle> = {
  wishlist: {
    badge: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400 dark:bg-slate-500",
    bar: "from-slate-400 to-slate-500",
    soft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  applied: {
    badge: "border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
    dot: "bg-sky-500",
    bar: "from-sky-400 to-blue-500",
    soft: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  phone_screen: {
    badge: "border-cyan-200 bg-cyan-100 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-300",
    dot: "bg-cyan-500",
    bar: "from-cyan-400 to-teal-500",
    soft: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  },
  technical: {
    badge: "border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
    dot: "bg-violet-500",
    bar: "from-violet-400 to-purple-500",
    soft: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  onsite: {
    badge: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    dot: "bg-amber-500",
    bar: "from-amber-400 to-orange-500",
    soft: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  offer: {
    badge: "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
    bar: "from-emerald-400 to-green-500",
    soft: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  accepted: {
    badge: "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
    dot: "bg-green-500",
    bar: "from-green-400 to-emerald-500",
    soft: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  rejected: {
    badge: "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    dot: "bg-red-500",
    bar: "from-red-400 to-rose-500",
    soft: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  ghosted: {
    badge: "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400",
    dot: "bg-zinc-400 dark:bg-zinc-600",
    bar: "from-zinc-400 to-zinc-500 dark:from-zinc-600 dark:to-zinc-700",
    soft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  withdrawn: {
    badge: "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
    dot: "bg-orange-500",
    bar: "from-orange-400 to-amber-500",
    soft: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
};

export const AVATAR_GRADIENTS = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-blue-600",
  "from-fuchsia-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-sky-600",
  "from-purple-500 to-indigo-600",
];

export function avatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length > 1) {
    return parts
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}
