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
  const {
    question_id,
    participant_id,
    selected_option,
    response_time_ms,
    score,
  } = body;

  const { data, error } = await supabase
    .from("answers")
    .insert({
      question_id,
      participant_id,
      selected_option,
      response_time_ms,
      score,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ answer: data });
}
