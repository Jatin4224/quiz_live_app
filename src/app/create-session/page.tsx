"use client";

import { useState } from "react";

export default function CreateSessionPage() {
  const [title, setTitle] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setJoinCode("");
    if (!title.trim()) {
      setError("Please enter a session title.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create session.");
      } else {
        setJoinCode(data.session.join_code);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h2 className="text-2xl font-bold">Create Quiz Session</h2>
      <form onSubmit={handleCreateSession} className="flex flex-col gap-3 w-72">
        <input
          type="text"
          placeholder="Enter session title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className={`p-2 rounded text-white ${
            title.trim() ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!title.trim() || loading}
        >
          {loading ? "Creating..." : "Create Session"}
        </button>
      </form>

      {joinCode && (
        <div className="text-center mt-4">
          <p className="text-green-600 font-semibold">
            Session created successfully!
          </p>
          <p className="mt-2">
            Join Code: <span className="font-bold">{joinCode}</span>
          </p>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
