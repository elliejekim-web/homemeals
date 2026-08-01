"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string;
};

export default function MemberMessageForm({ userId }: Props) {
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setErrorMessage("Please fill in both the subject and message.");
      return;
    }

    setErrorMessage(null);

    startTransition(async () => {
      const { error } = await supabase.from("member_messages").insert({
        sender_id: userId,
        subject: subject.trim(),
        body: body.trim(),
      });

      if (error) {
        console.error("Failed to send message:", error.message);
        setErrorMessage(error.message || "Failed to send message. Please try again.");
        return;
      }

      // 성공 시 입력창 초기화 및 피드백 표시
      setSubject("");
      setBody("");
      setSuccess(true);

      setTimeout(() => setSuccess(false), 4000);
    });
  }

  const isFormValid = subject.trim().length > 0 && body.trim().length > 0;

  return (
    <div className="space-y-5">
      {/* 성공 / 에러 피드백 바 */}
      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-2 animate-fade-in">
          <span>✅</span>
          <span>Your message has been sent to the administrator successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm font-semibold text-rose-600 flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Subject Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-700">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter the subject"
          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Message Textarea */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-700">
          Message
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          placeholder="Write your message or inquiry to the admin..."
          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSend}
          disabled={isPending || !isFormValid}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <span>Send Message</span>
          )}
        </button>
      </div>
    </div>
  );
}