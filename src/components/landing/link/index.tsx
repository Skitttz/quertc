"use client";
import { scrollTo } from "@/utils/scroll-to";
import Link from "next/link";
import type { LinkLandingProps } from "./types";

export function LinkScrollTo({ label, isRedirect, href }: LinkLandingProps) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        isRedirect ? null : scrollTo(event, href);
      }}
      className="text-gray-700 hover:text-blue-400 focus-visible:outline focus-visible:outline-blue-400 transition"
    >
      {label}
    </Link>
  );
}
