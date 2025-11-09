"use client";

import { supabase } from "../../../lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinQuiz() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState(""); // input for join code
  const [nickname, setNickname] = useState(""); // input for nickname
  const [error, setError] = useState("");

  async function handleJoin() {
    if (!joinCode.trim() || !nickname.trim()) {
      setError("Please enter both join code and nickname.");
      return;
    }

    // Anonymous login
    const { error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
      setError("Failed to join. Try again.");
      return;
    }

    // Lookup session by join code
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id")
      .eq("join_code", joinCode.toUpperCase()) // normalize to uppercase
      .single();

    if (sessionError || !session) {
      setError("Invalid join code.");
      return;
    }

    // Insert participant
    const { data: participantData, error: participantError } = await supabase
      .from("participants")
      .insert([
        {
          session_id: session.id,
          nickname,
          joined_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (participantError) {
      setError("Could not join the quiz. Try again.");
      return;
    }

    // Save locally for UI
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("participantId", participantData.id);

    // Navigate to quiz page
    router.push(`/quiz/${session.id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-xl font-semibold">Join Quiz</h2>
      <input
        type="text"
        placeholder="Enter join code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        className="border p-2 rounded w-64"
      />
      <input
        type="text"
        placeholder="Enter nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="border p-2 rounded w-64"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleJoin}
        disabled={!joinCode.trim() || !nickname.trim()}
        className={`w-64 p-2 rounded text-white ${
          joinCode.trim() && nickname.trim()
            ? "bg-green-500"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Join Quiz
      </button>
    </div>
  );
}
