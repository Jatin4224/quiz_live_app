"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateSessionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [session, setSession] = useState<{
    id: string;
    join_code: string;
  } | null>(null);
  const [questions, setQuestions] = useState<any[]>([]); // store questions
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Please enter a session title.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create session.");
      } else {
        setSession(data.session);
        fetchQuestions(data.session.id); // fetch questions after session creation
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch questions for the session
  async function fetchQuestions(sessionId: string) {
    try {
      const res = await fetch(`/api/questions?session_id=${sessionId}`);
      const data = await res.json();
      if (res.ok) setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleStartQuiz() {
    if (session) {
      router.push(`/host/session/${session.id}/questions`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-6 p-6">
      {session && (
        <div className="w-full bg-yellow-100 p-4 rounded shadow text-center">
          <p className="font-semibold">Session Created!</p>
          <p>
            Join Code: <span className="font-bold">{session.join_code}</span>
          </p>

          <p className="mt-2">
            Questions Added:{" "}
            <span className="font-bold">{questions.length}</span>
          </p>

          <div className="mt-2 flex justify-center gap-2">
            <button
              onClick={handleStartQuiz}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {questions.length > 0 ? "Start Quiz" : "Add Questions"}
            </button>
          </div>
        </div>
      )}

      {!session && (
        <>
          <h2 className="text-2xl font-bold">Create Quiz Session</h2>
          <form
            onSubmit={handleCreateSession}
            className="flex flex-col gap-3 w-72"
          >
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
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
