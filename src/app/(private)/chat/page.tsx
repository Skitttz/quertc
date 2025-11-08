import { getCurrentUser } from "@/actions/user";

export default async function ChatPage() {
  const userData = await getCurrentUser();

  return <div className="flex flex-col gap-sm"></div>;
}
