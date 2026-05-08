"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async () => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      router.push("/dashboard");
    } catch {
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-xl font-semibold">Login</h1>
      <input className="mt-4 w-full rounded bg-slate-800 p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="mt-3 w-full rounded bg-slate-800 p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <button className="mt-4 w-full rounded bg-brand p-2 text-black" onClick={submit}>Sign in</button>
    </div>
  );
}
