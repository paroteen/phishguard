"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useState } from "react";

export default function HistoryPage() {
  const [q, setQ] = useState("");
  const scansQuery = useQuery({
    queryKey: ["history", q],
    queryFn: async () => (await api.get("/scan/history", { params: { q } })).data
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h1 className="text-xl font-semibold">Scan History</h1>
      <input className="mt-3 w-full rounded bg-slate-800 p-2" placeholder="Search scans" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mt-4 space-y-3">
        {(scansQuery.data ?? []).map((scan: { id: string; classification: string; score: number; createdAt: string; originalText: string }) => (
          <div key={scan.id} className="rounded border border-slate-800 p-3">
            <div className="flex items-center justify-between text-sm">
              <span>{new Date(scan.createdAt).toLocaleString()}</span>
              <span>{scan.classification} ({scan.score})</span>
            </div>
            <p className="mt-2 line-clamp-2 text-slate-300">{scan.originalText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
