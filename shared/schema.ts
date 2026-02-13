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
  supabaseUserId: text("supabase_user_id").unique(),
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

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginInput = z.infer<typeof loginSchema>;

// Game Form Schema
export const gameSubmissions = pgTable("game_submissions", {
  id: serial("id").primaryKey(),
  gameName: text("game_name").notNull(),
  gameLink: text("game_link").notNull(),
  dailyActiveUsers: text("daily_active_users"),
  totalVisits: text("total_visits"),
  revenue: text("revenue"),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assets Form Schema
export const assetSubmissions = pgTable("asset_submissions", {
  id: serial("id").primaryKey(),
  assetsCount: text("assets_count"),
  assetLinks: text("asset_links"),
  additionalNotes: text("additional_notes"),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameSubmissionSchema = createInsertSchema(gameSubmissions).pick({
  gameName: true,
  gameLink: true,
  dailyActiveUsers: true,
  totalVisits: true,
  revenue: true,
}).extend({
  gameName: z.string().min(1, "Game name is required"),
  gameLink: z.string().url("Please enter a valid URL"),
  dailyActiveUsers: z.string().optional(),
  totalVisits: z.string().optional(),
  revenue: z.string().optional(),
});

export const insertAssetSubmissionSchema = createInsertSchema(assetSubmissions).pick({
  assetsCount: true,
  assetLinks: true,
  additionalNotes: true,
}).extend({
  assetsCount: z.string().optional(),
  assetLinks: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type GameSubmission = typeof gameSubmissions.$inferSelect;
export type InsertGameSubmission = z.infer<typeof insertGameSubmissionSchema>;
export type AssetSubmission = typeof assetSubmissions.$inferSelect;
export type InsertAssetSubmission = z.infer<typeof insertAssetSubmissionSchema>;
