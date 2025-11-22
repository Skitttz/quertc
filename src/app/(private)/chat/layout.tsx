import type { Metadata } from "next";
import { getCurrentUser } from "@/actions/user";
import { Header } from "@/components/layout/header/private";

export const metadata: Metadata = {
  title: "Quertc | Chat",
};

export default async function PrivateRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const safeUser = currentUser
    ? {
      _id: String(currentUser._id || ""),
      clerkUserId: currentUser.clerkUserId ?? null,
      name: currentUser.name ?? "",
      email: currentUser.email ?? "",
      profilePicture: currentUser?.profilePicture,
      createdAt: currentUser.createdAt?.toISOString?.() ?? "",
    }
    : null;

  return (
    <div>
      <Header currentUser={safeUser} />
      {children}
    </div>
  );
}
