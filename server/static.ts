import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // When bundled with esbuild, __dirname points to dist/ directory
  // and static files are in the same dist/ directory
  const distPath = __dirname;
  if (!fs.existsSync(path.join(distPath, "index.html"))) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  // BUT skip API routes - they should return 404 JSON, not HTML
  app.use("/{*path}", (req, res, next) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API endpoint not found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}
