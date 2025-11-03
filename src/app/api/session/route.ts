import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../lib/supabase-server";

import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title } = await req.json();
  const join_code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      id: randomUUID(),
      title,
      join_code,
      host_id: user.id,
      is_active: true,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ session: data });
}
