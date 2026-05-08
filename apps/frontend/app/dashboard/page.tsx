"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const historyQuery = useQuery({
    queryKey: ["history"],
    queryFn: async () => (await api.get("/scan/history")).data
  });
  const data = historyQuery.data ?? [];
  const dangerous = data.filter((s: { classification: string }) => s.classification === "Dangerous").length;
  const safe = data.filter((s: { classification: string }) => s.classification === "Safe").length;
  const suspicious = data.length - dangerous - safe;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total scans" value={String(data.length)} />
        <Card title="Dangerous scans" value={String(dangerous)} />
        <Card title="Safe scans" value={String(safe)} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-3 text-sm text-slate-300">Classification distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={[{ name: "Safe", value: safe }, { name: "Suspicious", value: suspicious }, { name: "Dangerous", value: dangerous }]} dataKey="value" cx="50%" cy="50%" outerRadius={90}>
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-3 text-sm text-slate-300">Recent score trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.slice(0, 10).map((s: { id: string; score: number }) => ({ name: s.id.slice(-4), score: s.score }))}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="score" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-sm text-slate-300">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
