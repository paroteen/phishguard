"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export default function AdminPage() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get("/admin/stats")).data
  });
  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await api.get("/admin/users")).data
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h1 className="text-xl font-semibold">Admin Overview</h1>
        <pre className="mt-3 overflow-auto rounded bg-slate-950 p-3 text-xs">{JSON.stringify(stats.data, null, 2)}</pre>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="font-semibold">Users</h2>
        <pre className="mt-3 overflow-auto rounded bg-slate-950 p-3 text-xs">{JSON.stringify(users.data, null, 2)}</pre>
      </div>
    </div>
  );
}
