"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, LayoutDashboard, PlusCircle, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
}

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/connections", label: "Connections", icon: Users },
  { href: "/applications/new", label: "New Application", icon: PlusCircle },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="flex h-16 items-center gap-2.5 border-b px-5">
        <div className="bg-brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md shadow-indigo-500/30">
          <Briefcase className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-gradient text-base font-bold tracking-tight">Job Tracker</p>
          <p className="text-xs text-muted-foreground">Your career, organized</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 lg:hidden"
          onClick={onNavigate}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px]", active && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t px-4 py-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
        <ThemeToggle />
      </div>
    </>
  );
}
