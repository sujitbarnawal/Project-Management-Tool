ALTER TABLE "users" ADD COLUMN "subscription_plan" text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "membership";