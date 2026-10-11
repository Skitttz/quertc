import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/config/database";
import { UserModel } from "@/models/user";

async function getAuthenticatedUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  await connectToDatabase();

  return UserModel.findOne({ clerkUserId: clerkUser.id }).lean();
}

export { getAuthenticatedUser };
