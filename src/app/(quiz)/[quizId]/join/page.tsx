"use client";
import { supabase } from "../../../../lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinQuiz({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");

  async function handleJoin() {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error("Anonymous login failed:", error.message);
      return;
    }

    // Optionally store nickname in localStorage or participants table
    localStorage.setItem("nickname", nickname);
    router.push(`/quiz/${quizId}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-xl font-semibold">Join Quiz</h2>
      <input
        type="text"
        placeholder="Enter nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="border p-2 rounded w-64"
      />
      <button
        onClick={handleJoin}
        className="bg-green-500 text-white rounded p-2 w-64"
      >
        Join Quiz
      </button>
    </div>
  );
}
