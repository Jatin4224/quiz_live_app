"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase-client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else router.push("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <h2 className="text-xl font-bold">Host Signup</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-3 w-72">
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white rounded p-2">
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
