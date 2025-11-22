import { toRoutePattern } from "@/utils/route-pattern";

enum AppRoutesEnum {
  HOME = "/",
  SIGN_IN = "/sign-in",
  SIGN_UP = "/sign-up",
  BLOG = "/blog",
  CHAT = "/chat",
}

export const AppPublicRoutes = [
  AppRoutesEnum.HOME,
  toRoutePattern(AppRoutesEnum.SIGN_IN),
  toRoutePattern(AppRoutesEnum.SIGN_UP),
  toRoutePattern(AppRoutesEnum.BLOG),
];

export { AppRoutesEnum };
