"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";


export default function LoginPage() {

  const router = useRouter();

  const supabase = createClient();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);



  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");

    setLoading(true);



    // 1. Supabase Auth Login

    const {
      data: authData,
      error: authError

    } = await supabase.auth.signInWithPassword({

      email,

      password

    });



    if (authError) {

      setError(authError.message);

      setLoading(false);

      return;

    }



    const userId =
      authData.user.id;



    // 2. public.users 조회

    const {

      data: profile,

      error: profileError

    } = await supabase

      .from("users")

      .select(
        "default_role"
      )

      .eq(
        "id",
        userId
      )

      .single();



    if (profileError || !profile) {

      setError(
        "사용자 정보를 찾을 수 없습니다."
      );

      setLoading(false);

      return;

    }



    // 3. Role별 이동


    switch(profile.default_role) {


      case "ADMIN":

        router.push("/admin");

        break;



      case "COOK":

        router.push("/cook");

        break;



      case "MEMBER":

        router.push("/member");

        break;



      default:

        setError(
          "등록되지 않은 역할입니다."
        );

    }


    setLoading(false);

  }



  return (

    <main
      className="
      min-h-screen
      flex
      items-center
      justify-center
      "
    >

      <form

        onSubmit={handleLogin}

        className="
        w-full
        max-w-sm
        space-y-4
        p-6
        border
        rounded-lg
        "
      >


        <h1
          className="
          text-2xl
          font-bold
          "
        >
          Sainthill Home
        </h1>



        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={
            e => setEmail(e.target.value)
          }

          className="
          w-full
          border
          p-2
          rounded
          "

          required

        />



        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={
            e => setPassword(e.target.value)
          }

          className="
          w-full
          border
          p-2
          rounded
          "

          required

        />



        {
          error && (

            <p
              className="
              text-red-500
              text-sm
              "
            >
              {error}
            </p>

          )
        }



        <button

          type="submit"

          disabled={loading}

          className="
          w-full
          bg-black
          text-white
          p-2
          rounded
          "

        >

          {
            loading
            ? "로그인 중..."
            : "로그인"
          }


        </button>



      </form>


    </main>

  );

}