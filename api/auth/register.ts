import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../lib/db.js";
import { users } from "../../shared/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { setUserSession } from "../../lib/session.js";
import { z } from "zod";

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("[REGISTER] Starting registration process");
    console.log("[REGISTER] DB_URL exists:", !!process.env.DATABASE_URL);
    console.log("[REGISTER] POSTGRES_URL exists:", !!process.env.POSTGRES_URL);
    
    // Parse and validate request body
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const data = registerSchema.parse(body);
    console.log("[REGISTER] Validated data for email:", data.email);

    // Check if user already exists
    console.log("[REGISTER] Checking for existing user...");
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    if (existingUsers.length > 0) {
      console.log("[REGISTER] User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    console.log("[REGISTER] Hashing password...");
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    console.log("[REGISTER] Creating user...");
    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
        password: hashedPassword,
        name: data.name,
      })
      .returning();

    console.log("[REGISTER] User created with ID:", user.id);

    // Set session
    console.log("[REGISTER] Setting session...");
    await setUserSession(req, res, user.id);

    // Return user data (without password)
    console.log("[REGISTER] Success!");
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("[REGISTER ERROR] Full error:", error);
    console.error("[REGISTER ERROR] Message:", error.message);
    console.error("[REGISTER ERROR] Stack:", error.stack);

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
      errorMessage: error.message,
    });
  }
}
