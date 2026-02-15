import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../lib/db.js";
import { users } from "../../shared/schema.js";
import { eq } from "drizzle-orm";
import { getSession } from "../../lib/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET method
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get session
    const session = await getSession(req, res);

    if (!session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Find user
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId));

    const user = userResults[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Return user data (without password)
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("[AUTH ME ERROR]", error);
    return res.status(500).json({
      message: "Internal server error",
      errorType: error.name || "UnknownError",
    });
  }
}
