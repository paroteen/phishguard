"use client";

import Link from "next/link";
import { useTheme } from "next-themes";

export function Navbar() {
  const { setTheme } = useTheme();
  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="font-semibold text-brand">
          PhishGuard
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/scan">Scan</Link>
          <Link href="/history">History</Link>
          <Link href="/admin">Admin</Link>
          <button onClick={() => setTheme("dark")}>Dark</button>
          <button onClick={() => setTheme("light")}>Light</button>
        </div>
      </div>
    </nav>
  );
}
