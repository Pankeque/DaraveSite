import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../lib/db";
import { gameSubmissions } from "@shared/schema";
import { getSession } from "../../lib/session";
import { z } from "zod";

// Validation schema
const gameSubmissionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  gameName: z.string().min(1, "Game name is required"),
  gameLink: z.string().url("Please enter a valid URL"),
  dailyActiveUsers: z.string().optional(),
  totalVisits: z.string().optional(),
  revenue: z.string().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse and validate request body
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const data = gameSubmissionSchema.parse(body);

    // Get optional user session
    const session = await getSession(req, res);
    const userId = session.userId || null;

    // Create submission
    const [submission] = await db
      .insert(gameSubmissions)
      .values({
        email: data.email,
        gameName: data.gameName,
        gameLink: data.gameLink,
        dailyActiveUsers: data.dailyActiveUsers || null,
        totalVisits: data.totalVisits || null,
        revenue: data.revenue || null,
        userId,
      })
      .returning();

    return res.status(201).json({
      message: "Game submission saved successfully",
      submission,
    });
  } catch (error: any) {
    console.error("[GAME SUBMISSION ERROR]", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        message: error.errors[0].message,
        errorType: "ZodError",
        validationErrors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      errorType: error.name || "UnknownError",
    });
  }
}
