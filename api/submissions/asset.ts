import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../lib/db.js";
import { assetSubmissions } from "../../shared/schema.js";
import { getSession } from "../../lib/session.js";
import { z } from "zod";

// Validation schema
const assetSubmissionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  assetsCount: z.string().optional(),
  assetLinks: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse and validate request body
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const data = assetSubmissionSchema.parse(body);

    // Get optional user session
    const session = await getSession(req, res);
    const userId = session.userId || null;

    // Create submission
    const [submission] = await db
      .insert(assetSubmissions)
      .values({
        email: data.email,
        assetsCount: data.assetsCount || null,
        assetLinks: data.assetLinks || null,
        additionalNotes: data.additionalNotes || null,
        userId,
      })
      .returning();

    return res.status(201).json({
      message: "Asset submission saved successfully",
      submission,
    });
  } catch (error: any) {
    console.error("[ASSET SUBMISSION ERROR]", error);

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
