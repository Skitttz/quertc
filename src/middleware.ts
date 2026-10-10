import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AppAuthRoutes, AppPublicRoutes, AppRoutesEnum } from "./shared/route";

const isPublicRoute = createRouteMatcher(AppPublicRoutes);
const isAuthRoute = createRouteMatcher(AppAuthRoutes);

export default clerkMiddleware(
  async (auth, req) => {
    if (isAuthRoute(req)) {
      const { userId } = await auth();
      if (userId) {
        return NextResponse.redirect(new URL(AppRoutesEnum.CHAT, req.url));
      }
      return;
    }

    if (!isPublicRoute(req)) {
      await auth.protect();
      return NextResponse.next();
    }
  },
  { signInUrl: AppRoutesEnum.SIGN_IN, signUpUrl: AppRoutesEnum.SIGN_UP },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
