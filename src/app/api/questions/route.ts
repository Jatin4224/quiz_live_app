import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../lib/supabase-server";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { session_id, question_text, type, options, correct_answers } = body;

  const { data, error } = await supabase
    .from("questions")
    .insert({
      session_id,
      question_text,
      type,
      options,
      correct_answers,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ question: data });
}
