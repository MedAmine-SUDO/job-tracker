"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search companies, positions, notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
