import type { VercelRequest, VercelResponse } from "@vercel/node";
import { destroySession } from "../../lib/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Destroy session
    await destroySession(req, res);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("[LOGOUT ERROR]", error);
    return res.status(500).json({
      message: "Failed to logout",
      errorType: error.name || "UnknownError",
    });
  }
}
