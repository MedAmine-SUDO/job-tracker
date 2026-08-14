"use client";

import { memo, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ConnectionForm } from "@/components/connections/connection-form";
import { ConnectionList } from "@/components/connections/connection-list";
import { Button } from "@/components/ui/button";
import { Connection } from "@/lib/core/domain/connection";
import { UserPlus, Users } from "lucide-react";

const MemoizedConnectionList = memo(ConnectionList);

async function fetchConnections(): Promise<Connection[]> {
  const res = await fetch("/api/connections");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function ConnectionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Connection | null>(null);

  const { data: connections = [], isPending } = useQuery({
    queryKey: ["connections"],
    queryFn: fetchConnections,
  });

  const openAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = useCallback((connection: Connection) => {
    setEditing(connection);
    setShowForm(true);
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
            <Users className="h-5 w-5 text-indigo-500" />
            LinkedIn Connections
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            People you connected with on LinkedIn and want to message later.
          </p>
        </div>

        <Button onClick={openAdd} className="self-start sm:self-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Connection
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <ConnectionForm connection={editing ?? undefined} onDone={closeForm} />
        </div>
      )}

      {isPending ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        </div>
      ) : connections.length === 0 && !showForm ? (
        <div className="relative overflow-hidden rounded-2xl border border-dashed bg-card/50 py-24 text-center">
          <div className="bg-hero-gradient pointer-events-none absolute inset-0" />
          <div className="relative mx-auto flex max-w-sm flex-col items-center px-6">
            <div className="bg-brand-gradient mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg shadow-indigo-500/30">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold">No connections yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add the LinkedIn people you want to follow up with so you never
              forget who you still need to message.
            </p>
            <Button onClick={openAdd} size="lg" className="mt-6">
              <UserPlus className="mr-2 h-4 w-4" />
              Add your first connection
            </Button>
          </div>
        </div>
      ) : (
        <MemoizedConnectionList connections={connections} onEdit={openEdit} />
      )}
    </div>
  );
}
