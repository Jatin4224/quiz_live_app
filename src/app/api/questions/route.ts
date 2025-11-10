// app/api/questions/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = createServerSupabase();

  // ✅ Get currently logged-in host
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    session_id,
    text,
    kind, // mcq | multi | wordcloud | open | rating
    choices = [],
    correct_answer = [],
    base_points = 10,
    bonus = 5,
    decay_rate = 1,
  } = body;

  if (!session_id || !text || !kind) {
    return NextResponse.json(
      { error: "Missing required fields: session_id, text, kind" },
      { status: 400 }
    );
  }

  // ✅ Verify that this session belongs to the current host
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id")
    .eq("id", session_id)
    .eq("host_id", user.id)
    .single();

  if (sessionError || !session) {
    return NextResponse.json(
      { error: "Session not found or you do not have permission" },
      { status: 403 }
    );
  }

  // ✅ Insert question
  const { data, error } = await supabase
    .from("questions")
    .insert({
      session_id,
      text,
      kind,
      choices,
      correct_answer,
      base_points,
      bonus,
      decay_rate,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ question: data });
}
