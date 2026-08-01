"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function LogoutPage() {

  const router = useRouter();

  useEffect(() => {

    async function logout() {

      const supabase = createClient();

      await supabase.auth.signOut();

      router.push("/login");

    }


    logout();

  }, [router]);


  return (
    <main className="p-8">
      로그아웃 중...
    </main>
  );

}