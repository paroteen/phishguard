import Link from "next/link";

export default function Home() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
      <h1 className="text-3xl font-bold">PhishGuard</h1>
      <p className="mt-3 text-slate-300">
        Defensive cybersecurity education platform for phishing awareness.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/login" className="rounded bg-brand px-4 py-2 text-black">
          Login
        </Link>
        <Link href="/register" className="rounded border border-slate-700 px-4 py-2">
          Register
        </Link>
      </div>
    </div>
  );
}
