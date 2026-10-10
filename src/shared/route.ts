import { toRoutePattern } from "@/utils/route-pattern";

enum AppRoutesEnum {
  HOME = "/",
  SIGN_IN = "/sign-in",
  SIGN_UP = "/sign-up",
  BLOG = "/blog",
  CHAT = "/chat",
}

export const AppAuthRoutes = [
  toRoutePattern(AppRoutesEnum.SIGN_IN),
  toRoutePattern(AppRoutesEnum.SIGN_UP),
];

export const AppPublicRoutes = [
  AppRoutesEnum.HOME,
  ...AppAuthRoutes,
  toRoutePattern(AppRoutesEnum.BLOG),
];

export { AppRoutesEnum };
