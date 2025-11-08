import { getCurrentUser } from "@/actions/user";
import { connectToDatabase } from "@/config/db-config";

connectToDatabase();

export default async function ChatPage() {
  const userData = await getCurrentUser();

  return <div className="flex flex-col gap-sm"></div>;
}
