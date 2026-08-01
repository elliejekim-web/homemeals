import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MemberMessageForm from "@/components/member/MemberMessageForm";

export default async function MemberMessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 미인증 유저는 로그인 페이지로 리다이렉트
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Upper Navigation & Title */}
      <div className="space-y-2">
        <Link
          href="/member"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>←</span> Back to Dashboard
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Contact Admin
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Send a direct message or inquiry to the administration team.
          </p>
        </div>
      </div>

      {/* Message Form Component Wrapper */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-2xs">
        <MemberMessageForm userId={user.id} />
      </div>
    </div>
  );
}