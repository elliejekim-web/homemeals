import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";


// 사용자의 기본 이동 페이지 결정
function getHomePage(
  roles: string[]
) {

  if (roles.includes("ADMIN")) {
    return "/admin";
  }

  if (roles.includes("COOK")) {
    return "/cook";
  }

  return "/member";

}



export async function middleware(
  request: NextRequest
) {


  console.log(
    "🔥 MIDDLEWARE:",
    request.nextUrl.pathname
  );


  let response = NextResponse.next({
    request,
  });



  const supabase = createServerClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,


    {

      cookies: {


        getAll() {

          return request.cookies.getAll();

        },


        setAll(
          cookiesToSet
        ) {

          cookiesToSet.forEach(
            ({
              name,
              value,
            }) => {

              request.cookies.set(
                name,
                value
              );

            }
          );


          response =
            NextResponse.next({
              request,
            });


          cookiesToSet.forEach(
            ({
              name,
              value,
              options
            }) => {

              response.cookies.set(
                name,
                value,
                options
              );

            }
          );


        },


      },


    }

  );



  // =================================
  // 1. 로그인 확인
  // =================================


  const {
    data: {
      user
    }

  } = await supabase.auth.getUser();



  const pathname =
    request.nextUrl.pathname;



  if (!user) {


    return NextResponse.redirect(

      new URL(
        "/login",
        request.url
      )

    );


  }



  console.log(
    "AUTH USER:",
    user.id
  );



  // =================================
  // 2. User Roles 조회
  // =================================


  const {
    data: roles,
    error: rolesError

  } = await supabase


    .from("user_roles")


    .select(
      "role"
    )


    .eq(
      "user_id",
      user.id
    );




  if (
    rolesError ||
    !roles
  ) {


    return NextResponse.redirect(

      new URL(
        "/login",
        request.url
      )

    );

  }



  const userRoles =
    roles.map(
      item => item.role
    );



  console.log(
    "USER ROLES:",
    userRoles
  );



  // =================================
  // 3. 접근 권한 정의
  // =================================


  const permissions: Record<
    string,
    string[]
  > = {


    "/admin":

    [
      "ADMIN",
      "COOK",
      "MEMBER"
    ],



    "/cook":

    [
     
      "COOK"
    ],



    "/member":

    [
      
      "MEMBER"
    ],


  };




  // =================================
  // 4. 권한 검사
  // =================================


  for (
    const route in permissions
  ) {


    if (
      pathname.startsWith(route)
    ) {


      const allowedRoles =
        permissions[route];



      const hasPermission =
        allowedRoles.some(

          role =>
            userRoles.includes(role)

        );



      if (
        !hasPermission
      ) {


        const redirectPage =
          getHomePage(
            userRoles
          );



        // 같은 페이지 redirect 방지

        if (
          pathname !== redirectPage
        ) {


          return NextResponse.redirect(

            new URL(
              redirectPage,
              request.url
            )

          );


        }


      }


    }


  }



  return response;


}



export const config = {


  matcher: [


    "/admin/:path*",


    "/cook/:path*",


    "/member/:path*",


  ],


};