"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type QuestionType = "mcq" | "multi" | "wordcloud" | "open" | "rating";

interface Question {
  id: string;
  text: string;
  kind: QuestionType;
}

interface Props {
  sessionId: string;
  joinCode: string;
}

export default function HostQuestions({ sessionId, joinCode }: Props) {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [text, setText] = useState("");
  const [kind, setKind] = useState<QuestionType>("mcq");
  const [choices, setChoices] = useState<string[]>(["", ""]); // for MCQ/Multi
  const [correctAnswer, setCorrectAnswer] = useState<number[]>([]); // indexes of correct choices
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/questions?session_id=${sessionId}`);
        const data = await res.json();
        if (res.ok) setQuestions(data.questions || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchQuestions();
  }, [sessionId]);

  // Handle adding new question
  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Please enter the question text.");
      return;
    }

    if (
      (kind === "mcq" || kind === "multi") &&
      choices.some((c) => !c.trim())
    ) {
      setError("Please fill all choice fields.");
      return;
    }

    if ((kind === "mcq" || kind === "multi") && correctAnswer.length === 0) {
      setError("Please select at least one correct answer.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          text,
          kind,
          choices: kind === "mcq" || kind === "multi" ? choices : [],
          correct_answer:
            kind === "mcq" || kind === "multi" ? correctAnswer : [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add question.");
      } else {
        setQuestions((prev) => [...prev, data.question]);
        // Reset form
        setText("");
        setChoices(["", ""]);
        setCorrectAnswer([]);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleStartQuiz() {
    if (questions.length > 0) {
      router.push(`/host/session/${sessionId}/live`);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col gap-6">
      <div className="bg-yellow-100 p-4 rounded shadow text-center">
        <p className="font-semibold">
          Session Join Code: <span className="font-bold">{joinCode}</span>
        </p>
        <p>
          Questions Added: <span className="font-bold">{questions.length}</span>
        </p>
        <button
          onClick={handleStartQuiz}
          disabled={questions.length === 0}
          className={`mt-2 px-4 py-2 rounded text-white ${
            questions.length > 0
              ? "bg-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Start Quiz
        </button>
      </div>

      <form
        onSubmit={handleAddQuestion}
        className="flex flex-col gap-3 border p-4 rounded"
      >
        <h3 className="text-lg font-semibold">Add Question</h3>
        <input
          type="text"
          placeholder="Question text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as QuestionType)}
          className="border p-2 rounded"
        >
          <option value="mcq">MCQ (Single Choice)</option>
          <option value="multi">Multi-Select</option>
          <option value="wordcloud">Word Cloud</option>
          <option value="open">Open Text</option>
          <option value="rating">Rating (1-10)</option>
        </select>

        {(kind === "mcq" || kind === "multi") && (
          <div className="flex flex-col gap-2">
            <p className="font-medium">Choices:</p>
            {choices.map((c, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={c}
                  onChange={(e) => {
                    const newChoices = [...choices];
                    newChoices[idx] = e.target.value;
                    setChoices(newChoices);
                  }}
                  className="border p-2 rounded flex-1"
                />
                <label>
                  <input
                    type="checkbox"
                    checked={correctAnswer.includes(idx)}
                    onChange={() => {
                      if (correctAnswer.includes(idx)) {
                        setCorrectAnswer(
                          correctAnswer.filter((i) => i !== idx)
                        );
                      } else {
                        setCorrectAnswer([...correctAnswer, idx]);
                      }
                    }}
                  />{" "}
                  Correct
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setChoices([...choices, ""])}
              className="mt-2 px-2 py-1 bg-gray-200 rounded"
            >
              Add Choice
            </button>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-500"
          }`}
        >
          {loading ? "Adding..." : "Add Question"}
        </button>
      </form>

      {questions.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold">Added Questions:</h4>
          <ul className="list-disc pl-6">
            {questions.map((q) => (
              <li key={q.id}>
                {q.text} ({q.kind})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
