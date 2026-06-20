CREATE TYPE "public"."contract_field_type" AS ENUM('signature', 'initials', 'name', 'date', 'text', 'email');--> statement-breakpoint
CREATE TYPE "public"."contract_signing_status" AS ENUM('not_signed', 'signed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('draft', 'pending', 'completed', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TABLE "contract_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"type" text NOT NULL,
	"data" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"recipient_id" uuid,
	"type" "contract_field_type" NOT NULL,
	"page" integer DEFAULT 1 NOT NULL,
	"position_x" numeric DEFAULT '0' NOT NULL,
	"position_y" numeric DEFAULT '0' NOT NULL,
	"width" numeric DEFAULT '20' NOT NULL,
	"height" numeric DEFAULT '6' NOT NULL,
	"custom_text" text,
	"inserted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"token" text NOT NULL,
	"signing_status" "contract_signing_status" DEFAULT 'not_signed' NOT NULL,
	"sent_at" timestamp with time zone,
	"signed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "contract_recipients_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "contract_signatures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"field_id" uuid NOT NULL,
	"recipient_id" uuid,
	"signature_image_base64" text,
	"typed_signature" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "contract_signatures_field_id_unique" UNIQUE("field_id")
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"opportunity_id" uuid,
	"blueprint_id" uuid,
	"title" text NOT NULL,
	"status" "contract_status" DEFAULT 'draft' NOT NULL,
	"pdf_data" text,
	"sealed_pdf_data" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contract_audit_logs" ADD CONSTRAINT "contract_audit_logs_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_fields" ADD CONSTRAINT "contract_fields_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_fields" ADD CONSTRAINT "contract_fields_recipient_id_contract_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."contract_recipients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_recipients" ADD CONSTRAINT "contract_recipients_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_signatures" ADD CONSTRAINT "contract_signatures_field_id_contract_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."contract_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_signatures" ADD CONSTRAINT "contract_signatures_recipient_id_contract_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."contract_recipients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_blueprint_id_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "public"."blueprints"("id") ON DELETE set null ON UPDATE no action;