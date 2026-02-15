import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET method
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Debug: List all environment variables related to database
  const envKeys = Object.keys(process.env).filter(
    key => key.includes('DATABASE') || 
           key.includes('POSTGRES') || 
           key.includes('NEON') ||
           key.includes('SESSION')
  );
  
  const envValues: Record<string, boolean> = {};
  for (const key of envKeys) {
    envValues[key] = !!process.env[key];
  }

  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    debug: {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      POSTGRES_URL_exists: !!process.env.POSTGRES_URL,
      SESSION_SECRET_exists: !!process.env.SESSION_SECRET,
      allDbRelatedVars: envValues,
      totalEnvVars: Object.keys(process.env).length,
    }
  });
}
