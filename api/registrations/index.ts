import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../lib/db.js";
import { registrations } from "../../shared/schema.js";
import { z } from "zod";

// Validation schema
const registrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  interest: z.string().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse and validate request body
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const data = registrationSchema.parse(body);

    // Create registration
    const [registration] = await db
      .insert(registrations)
      .values({
        email: data.email,
        interest: data.interest || null,
      })
      .returning();

    return res.status(201).json(registration);
  } catch (error: any) {
    console.error("[REGISTRATION ERROR]", error);

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
