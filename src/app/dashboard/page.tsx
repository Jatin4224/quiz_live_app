// app/dashboard/page.tsx
import { createServerSupabase } from "@/lib/supabase-server"; // path may differ if you’re not using @ alias
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // ✅ Create a secure Supabase server client (reads cookies)
  const supabase = createServerSupabase();

  // ✅ Get the currently logged-in user from Supabase Auth
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 🚫 If no user (unauthenticated), redirect to login
  if (!user) {
    redirect("/login");
  }

  // ✅ Otherwise, render the dashboard
  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
      <p className="text-gray-600">This is your host dashboard.</p>

      {/* Example future features */}
      <div className="mt-6 space-y-3">
        <Link href="/create-session">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Create New Quiz
          </button>
        </Link>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md">
          View Existing Sessions
        </button>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md">
          View Leaderboard
        </button>
      </div>
    </div>
  );
}
