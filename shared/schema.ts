import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  interest: text("interest"), // For "Game Development", "Asset Purchase", etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Game metrics submissions
export const gameSubmissions = pgTable("game_submissions", {
  id: serial("id").primaryKey(),
  gameName: text("game_name").notNull(),
  gameLink: text("game_link").notNull(),
  dailyActiveUsers: integer("daily_active_users"),
  totalVisits: integer("total_visits"),
  revenue: integer("revenue"), // in Robux
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Asset submissions
export const assetSubmissions = pgTable("asset_submissions", {
  id: serial("id").primaryKey(),
  assetName: text("asset_name").notNull(),
  assetLinks: text("asset_links").notNull(), // Multiple links, separated by newlines
  assetCount: integer("asset_count"),
  assetType: text("asset_type"), // e.g., "Animation", "Model", "Plugin", etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRegistrationSchema = createInsertSchema(registrations).pick({
  email: true,
  interest: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertNewsletterSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

// Game submission schema
export const insertGameSubmissionSchema = createInsertSchema(gameSubmissions).pick({
  gameName: true,
  gameLink: true,
  dailyActiveUsers: true,
  totalVisits: true,
  revenue: true,
  notes: true,
}).extend({
  gameName: z.string().min(1, "Game name is required"),
  gameLink: z.string().url("Please enter a valid URL"),
  dailyActiveUsers: z.number().int().positive().optional(),
  totalVisits: z.number().int().positive().optional(),
  revenue: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

// Asset submission schema
export const insertAssetSubmissionSchema = createInsertSchema(assetSubmissions).pick({
  assetName: true,
  assetLinks: true,
  assetCount: true,
  assetType: true,
  notes: true,
}).extend({
  assetName: z.string().min(1, "Asset name is required"),
  assetLinks: z.string().min(1, "At least one asset link is required"),
  assetCount: z.number().int().positive().optional(),
  assetType: z.string().optional(),
  notes: z.string().optional(),
});

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginInput = z.infer<typeof loginSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type InsertGameSubmission = z.infer<typeof insertGameSubmissionSchema>;
export type GameSubmission = typeof gameSubmissions.$inferSelect;
export type InsertAssetSubmission = z.infer<typeof insertAssetSubmissionSchema>;
export type AssetSubmission = typeof assetSubmissions.$inferSelect;
