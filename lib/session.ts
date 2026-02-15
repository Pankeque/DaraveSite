import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { VercelRequest, VercelResponse } from "@vercel/node";

// Session data interface
export interface SessionData {
  userId?: number;
}

// Default session data
const defaultSession: SessionData = {
  userId: undefined,
};

// Session configuration
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long_for_security",
  cookieName: "darave_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  },
};

// Type for iron-session
declare module "iron-session" {
  interface IronSessionData extends SessionData {}
}

// Helper function to get session from request/response
export async function getSession(
  req: VercelRequest,
  res: VercelResponse
): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(req, res, sessionOptions);
}

// Helper to check if user is authenticated
export async function requireAuth(
  req: VercelRequest,
  res: VercelResponse
): Promise<number | null> {
  const session = await getSession(req, res);
  
  if (!session.userId) {
    res.status(401).json({ message: "Not authenticated" });
    return null;
  }
  
  return session.userId;
}

// Helper to set user in session
export async function setUserSession(
  req: VercelRequest,
  res: VercelResponse,
  userId: number
): Promise<void> {
  const session = await getSession(req, res);
  session.userId = userId;
  await session.save();
}

// Helper to destroy session
export async function destroySession(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const session = await getSession(req, res);
  session.destroy();
}
