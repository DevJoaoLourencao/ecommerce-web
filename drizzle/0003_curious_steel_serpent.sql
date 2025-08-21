ALTER TABLE "cart" ADD COLUMN "shipping_option_id" text;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "shipping_option_name" text;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "shipping_cost_in_cents" integer;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "shipping_delivery_days" integer;