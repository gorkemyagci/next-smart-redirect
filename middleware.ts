import { NextRequest, NextResponse } from "next/server";

const routes = ["/", "/home", "/profile", "/feed"];

function findMatchingRoute(path: string): string | null {
  if (routes.some(route => route.split('?')[0] === path)) {
    return path;
  }
  
  const matchingRoute = routes.find(route => {
    const routePath = route.split('?')[0];
    return routePath !== "/" && routePath.startsWith(path);
  });
  
  if (matchingRoute) {
    return matchingRoute;
  }
  return "/";
}

export function middleware(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const path = url.pathname;
  
  if (routes.some(route => route.split('?')[0] === path)) {
    return NextResponse.next();
  }

  const matchingRoute = findMatchingRoute(path);
  
  if (matchingRoute && matchingRoute !== path) {
    if (matchingRoute.includes("?")) {
      const [pathname, query] = matchingRoute.split("?");
      url.pathname = pathname;
      url.search = `?${query}`;
    } else {
      url.pathname = matchingRoute;
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
