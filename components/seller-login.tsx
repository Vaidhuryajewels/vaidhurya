"use client";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function SellerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setStatus("Signing in…");
    const supabase = createClient();
    if (!supabase) { setStatus("Supabase is not configured."); return; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setStatus(error.message); return; }
    window.location.assign("/seller");
  }
  return <main className="seller-login"><section><Image src="/vaidhurya-logo.png" width={210} height={90} alt="VAIDHURYA" /><p className="seller-kicker">Private seller workspace</p><h1>Welcome back</h1><p>Manage conversations and create exquisite listings from anywhere.</p><form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="seller-primary">Sign in securely</button><p role="status">{status}</p></form></section></main>;
}
