import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// 사용자의 기본 이동 페이지 결정
function getHomePage(roles: string[]) {
  if (roles.includes("ADMIN")) {
    return "/admin";
  }
  if (roles.includes("COOK")) {
    return "/cook";
  }
  return "/member";
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("🔥 MIDDLEWARE:", pathname);

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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // =================================
  // 1. 로그인 확인
  // =================================
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 페이지 접속 시: 이미 로그인되어 있다면 역할에 맞는 홈으로 리다이렉트
  if (pathname === "/login") {
    if (user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const userRoles = (roles ?? []).map((item) => item.role);
      const redirectPage = getHomePage(userRoles);
      return NextResponse.redirect(new URL(redirectPage, request.url));
    }
    return response;
  }

  // 비로그인 사용자는 /login 으로 이동
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // =================================
  // 2. User Roles 조회
  // =================================
  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  if (rolesError || !roles) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRoles = roles.map((item) => item.role);

  // =================================
  // 3. 루트 경로 (/) 접속 처리
  // =================================
  if (pathname === "/") {
    const defaultPage = getHomePage(userRoles);
    return NextResponse.redirect(new URL(defaultPage, request.url));
  }

  // =================================
  // 4. 접근 권한 정의 및 검사
  // =================================
  const permissions: Record<string, string[]> = {
    "/admin": ["ADMIN", "COOK", "MEMBER"],
    "/cook": ["COOK"],
    "/member": ["MEMBER"],
  };

  for (const route in permissions) {
    if (pathname.startsWith(route)) {
      const allowedRoles = permissions[route];
      const hasPermission = allowedRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasPermission) {
        const redirectPage = getHomePage(userRoles);

        // 같은 페이지 redirect 방지
        if (pathname !== redirectPage) {
          return NextResponse.redirect(new URL(redirectPage, request.url));
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (.svg, .png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};