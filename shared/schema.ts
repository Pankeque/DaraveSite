import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
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

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  authorId: integer("author_id").references(() => users.id),
  category: text("category").notNull(),
  readTime: text("read_time").notNull(),
  featuredImage: text("featured_image"),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  content: text("content").notNull(),
  parentId: integer("parent_id").references(() => blogComments.id),
  approved: boolean("approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogTags = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const blogPostTags = pgTable("blog_post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id).notNull(),
  tagId: integer("tag_id").references(() => blogTags.id).notNull(),
});

export const blogImages = pgTable("blog_images", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id),
  url: text("url").notNull(),
  alt: text("alt"),
  caption: text("caption"),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ticketmatics Tables
export const ticketmaticsServers = pgTable("ticketmatics_servers", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull().unique(),
  serverName: text("server_name").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ticketmaticsTickets = pgTable("ticketmatics_tickets", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull(),
  ticketId: text("ticket_id").notNull().unique(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(), // open, closed, pending
  priority: text("priority").notNull(), // low, medium, high, urgent
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

export const ticketmaticsMessages = pgTable("ticketmatics_messages", {
  id: serial("id").primaryKey(),
  ticketId: text("ticket_id").notNull(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Visucord Tables
export const visucordServers = pgTable("visucord_servers", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull().unique(),
  serverName: text("server_name").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const visucordStats = pgTable("visucord_stats", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull(),
  memberCount: integer("member_count").notNull(),
  messageCount: integer("message_count").notNull(),
  voiceMinutes: integer("voice_minutes").notNull(),
  activeUsers: integer("active_users").notNull(),
  date: timestamp("date").defaultNow(),
});

export const visucordChannelStats = pgTable("visucord_channel_stats", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull(),
  channelId: text("channel_id").notNull(),
  channelName: text("channel_name").notNull(),
  messageCount: integer("message_count").notNull(),
  date: timestamp("date").defaultNow(),
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

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  author: true,
  authorId: true,
  category: true,
  readTime: true,
  featuredImage: true,
  published: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  readTime: z.string().min(1, "Read time is required"),
  featuredImage: z.string().optional(),
  published: z.boolean().optional(),
});

export const insertBlogCommentSchema = createInsertSchema(blogComments).pick({
  postId: true,
  userId: true,
  guestName: true,
  guestEmail: true,
  content: true,
  parentId: true,
}).extend({
  content: z.string().min(1, "Comment is required").max(2000, "Comment is too long"),
  guestName: z.string().min(2, "Name is required").optional(),
  guestEmail: z.string().email("Invalid email").optional(),
});

export const insertBlogTagSchema = createInsertSchema(blogTags).pick({
  name: true,
  slug: true,
}).extend({
  name: z.string().min(1, "Tag name is required"),
  slug: z.string().min(1, "Tag slug is required"),
});

export const insertBlogImageSchema = createInsertSchema(blogImages).pick({
  postId: true,
  url: true,
  alt: true,
  caption: true,
  uploadedBy: true,
}).extend({
  url: z.string().url("Invalid URL"),
  alt: z.string().optional(),
  caption: z.string().optional(),
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
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;
export type BlogTag = typeof blogTags.$inferSelect;
export type InsertBlogTag = z.infer<typeof insertBlogTagSchema>;
export type BlogPostTag = typeof blogPostTags.$inferSelect;
export type BlogImage = typeof blogImages.$inferSelect;
export type InsertBlogImage = z.infer<typeof insertBlogImageSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;

// Ticketmatics types
export type TicketmaticsServer = typeof ticketmaticsServers.$inferSelect;
export type TicketmaticsTicket = typeof ticketmaticsTickets.$inferSelect;
export type TicketmaticsMessage = typeof ticketmaticsMessages.$inferSelect;

// Visucord types
export type VisucordServer = typeof visucordServers.$inferSelect;
export type VisucordStats = typeof visucordStats.$inferSelect;
export type VisucordChannelStats = typeof visucordChannelStats.$inferSelect;
