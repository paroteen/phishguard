"use client";

import { useMemo, useState } from "react";
import { api } from "../../lib/api";

export default function ScanPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | { score: number; classification: string; aiAnalysis: string; indicators: Array<{ description: string }> }>(null);
  const liveScore = useMemo(() => {
    let score = 0;
    if (/urgent|immediately|action required/i.test(text)) score += 20;
    if (/verify your account|password|otp/i.test(text)) score += 25;
    if (/gift card|crypto/i.test(text)) score += 15;
    return Math.min(score, 100);
  }, [text]);

  const submit = async () => {
    const { data } = await api.post("/scan/message", { text });
    setResult(data);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h1 className="text-xl font-semibold">Live Message Scanner</h1>
        <textarea className="mt-4 h-52 w-full rounded bg-slate-800 p-3" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste SMS, email, WhatsApp or Telegram message..." />
        <div className="mt-3 text-sm text-slate-300">Live risk score: <span className="font-bold">{liveScore}</span></div>
        <button className="mt-4 rounded bg-brand px-4 py-2 text-black" onClick={submit}>Scan Message</button>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-lg font-semibold">Scan result</h2>
        {!result ? (
          <p className="mt-4 text-slate-400">Run a scan to view phishing indicators.</p>
        ) : (
          <div className="mt-4 space-y-3">
            <p>Classification: <b>{result.classification}</b></p>
            <p>Risk score: <b>{result.score}/100</b></p>
            <p className="text-slate-300">{result.aiAnalysis}</p>
            <ul className="list-disc pl-6 text-slate-300">
              {result.indicators.map((x, i) => <li key={i}>{x.description}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
