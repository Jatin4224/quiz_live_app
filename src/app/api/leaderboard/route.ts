import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../lib/supabase-server";

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  const { data, error } = await supabase
    .from("answers")
    .select("participant_id, score")
    .eq("session_id", session_id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  const leaderboard = Object.values(
    data.reduce((acc: any, ans: any) => {
      if (!acc[ans.participant_id])
        acc[ans.participant_id] = {
          participant_id: ans.participant_id,
          total: 0,
        };
      acc[ans.participant_id].total += ans.score;
      return acc;
    }, {})
  ).sort((a: any, b: any) => b.total - a.total);

  return NextResponse.json({ leaderboard });
}
