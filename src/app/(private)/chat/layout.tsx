import type { Metadata } from "next";
import { getCurrentUser } from "@/actions/user";
import { Header } from "@/components/layout/header/private";
import StoreProvider from "@/providers/store";
import { serializeUser } from "@/utils/serialize/user";



export const metadata: Metadata = {
  title: "Quertc | Chat",
};

export default async function PrivateRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();


  const safeUser = currentUser ? serializeUser(currentUser) : null;


  return (
    <StoreProvider user={safeUser}>
      <div>
        <Header />
        {children}
      </div>
    </StoreProvider>
  );
}
