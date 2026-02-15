CREATE TABLE "asset_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"assets_count" text,
	"asset_links" text,
	"additional_notes" text,
	"user_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"game_name" text NOT NULL,
	"game_link" text NOT NULL,
	"daily_active_users" text,
	"total_visits" text,
	"revenue" text,
	"user_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"interest" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"supabase_user_id" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_supabase_user_id_unique" UNIQUE("supabase_user_id")
);
--> statement-breakpoint
ALTER TABLE "asset_submissions" ADD CONSTRAINT "asset_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_submissions" ADD CONSTRAINT "game_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;