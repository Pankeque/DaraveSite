import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
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

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginInput = z.infer<typeof loginSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
