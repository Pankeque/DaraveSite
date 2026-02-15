import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../lib/db.js";
import { users } from "../../shared/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { setUserSession } from "../../lib/session.js";
import { z } from "zod";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse and validate request body
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const data = loginSchema.parse(body);

    // Find user
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    const user = userResults[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set session
    await setUserSession(req, res, user.id);

    // Return user data (without password)
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("[LOGIN ERROR]", error);

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
