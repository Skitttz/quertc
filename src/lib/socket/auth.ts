import { verifyToken } from "@clerk/backend";
import { connectToDatabase } from "@/config/database";
import { UserModel } from "@/models/user";

async function resolveSocketUserId({
  token,
}: {
  token: string | undefined;
}): Promise<string | null> {
  if (!token) return null;

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    await connectToDatabase();
    const user = await UserModel.findOne({
      clerkUserId: payload.sub,
    }).lean();

    return user ? String(user._id) : null;
  } catch {
    return null;
  }
}

export { resolveSocketUserId };
