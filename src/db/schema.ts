import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "starter",
  "growth",
  "scale",
]);

export const userRoleEnum = pgEnum("user_role", [
  "founder",
  "manager",
  "closer",
  "setter",
  "revops",
]);

export const opportunityStatusEnum = pgEnum("opportunity_status", [
  "new",
  "working",
  "proposal",
  "won",
  "lost",
  "stale",
]);

export const activityTypeEnum = pgEnum("activity_type", [
  "call",
  "email",
  "sms",
  "meeting",
]);

export const followUpCadenceEnum = pgEnum("follow_up_cadence", [
  "day_1",
  "day_3",
  "day_7",
  "day_14",
  "day_30",
]);

export const followUpStatusEnum = pgEnum("follow_up_status", [
  "pending",
  "completed",
  "overdue",
  "cancelled",
]);

export const complianceSeverityEnum = pgEnum("compliance_severity", [
  "warning",
  "alert",
  "red_flag",
]);

// ---------------------------------------------------------------------------
// Tenancy: organizations + users (synced from Clerk)
// ---------------------------------------------------------------------------

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkOrgId: text("clerk_org_id").unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  subscriptionPlan: subscriptionPlanEnum("subscription_plan")
    .notNull()
    .default("free"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").notNull().default("closer"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Module 1: Opportunity Engine
// ---------------------------------------------------------------------------

export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  crmId: text("crm_id"),
  ownerId: uuid("owner_id").references(() => users.id, {
    onDelete: "set null",
  }),
  company: text("company"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  dealValue: numeric("deal_value", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  status: opportunityStatusEnum("status").notNull().default("new"),
  source: text("source"),
  // Hot List Engine signals
  priorityScore: integer("priority_score").notNull().default(0),
  starred: boolean("starred").notNull().default(false),
  lastContactAt: timestamp("last_contact_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const opportunityNotes = pgTable("opportunity_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const opportunityActivities = pgTable("opportunity_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  type: activityTypeEnum("type").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Module 3: Follow-Up Engine
// ---------------------------------------------------------------------------

export const followUpTasks = pgTable("follow_up_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  ownerId: uuid("owner_id").references(() => users.id, {
    onDelete: "set null",
  }),
  cadence: followUpCadenceEnum("cadence"),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  status: followUpStatusEnum("status").notNull().default("pending"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Module 4: Coaching Engine
// ---------------------------------------------------------------------------

export const callReviews = pgTable("call_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  callId: text("call_id"),
  repId: uuid("rep_id").references(() => users.id, { onDelete: "set null" }),
  overallScore: integer("overall_score"),
  discoveryScore: integer("discovery_score"),
  tonalityScore: integer("tonality_score"),
  qualificationScore: integer("qualification_score"),
  objectionScore: integer("objection_score"),
  closingScore: integer("closing_score"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Module 5: CRM Compliance Engine
// ---------------------------------------------------------------------------

export const complianceViolations = pgTable("compliance_violations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  rule: text("rule").notNull(),
  severity: complianceSeverityEnum("severity").notNull().default("warning"),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Module 6: Blueprint Studio (AI-generated SOWs / PRDs / specs / architecture)
// ---------------------------------------------------------------------------

export const blueprintStatusEnum = pgEnum("blueprint_status", [
  "draft",
  "in_review",
  "approved",
  "archived",
]);

export const blueprintDeliverableKindEnum = pgEnum(
  "blueprint_deliverable_kind",
  ["sow", "prd", "spec"]
);

type BlueprintContent = { blocks: unknown[] };

export const blueprints = pgTable("blueprints", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id, {
    onDelete: "set null",
  }),
  authorId: uuid("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  templateId: text("template_id"),
  title: text("title").notNull(),
  deliverableKind: blueprintDeliverableKindEnum("deliverable_kind"),
  status: blueprintStatusEnum("status").notNull().default("draft"),
  content: jsonb("content").$type<BlueprintContent>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Module 7: Delivery (work orders link a blueprint to trackable build tasks)
// ---------------------------------------------------------------------------

export const workOrderStatusEnum = pgEnum("work_order_status", [
  "todo",
  "in_progress",
  "blocked",
  "in_review",
  "done",
]);

export const workOrderPriorityEnum = pgEnum("work_order_priority", [
  "low",
  "medium",
  "high",
]);

export const workOrders = pgTable("work_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id, {
    onDelete: "set null",
  }),
  blueprintId: uuid("blueprint_id").references(() => blueprints.id, {
    onDelete: "set null",
  }),
  assigneeId: uuid("assignee_id").references(() => users.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  description: text("description"),
  status: workOrderStatusEnum("status").notNull().default("todo"),
  priority: workOrderPriorityEnum("priority").notNull().default("medium"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Module 8: E-signature (signable contracts — the CPQ "Contract" step)
// ---------------------------------------------------------------------------

export const contractStatusEnum = pgEnum("contract_status", [
  "draft",
  "pending",
  "completed",
  "rejected",
  "cancelled",
]);

export const contractSigningStatusEnum = pgEnum("contract_signing_status", [
  "not_signed",
  "signed",
  "rejected",
]);

export const contractFieldTypeEnum = pgEnum("contract_field_type", [
  "signature",
  "initials",
  "name",
  "date",
  "text",
  "email",
]);

export const contracts = pgTable("contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id, {
    onDelete: "set null",
  }),
  blueprintId: uuid("blueprint_id").references(() => blueprints.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  status: contractStatusEnum("status").notNull().default("draft"),
  pdfData: text("pdf_data"),
  sealedPdfData: text("sealed_pdf_data"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contractRecipients = pgTable("contract_recipients", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id")
    .notNull()
    .references(() => contracts.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  name: text("name"),
  token: text("token").notNull().unique(),
  signingStatus: contractSigningStatusEnum("signing_status")
    .notNull()
    .default("not_signed"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contractFields = pgTable("contract_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id")
    .notNull()
    .references(() => contracts.id, { onDelete: "cascade" }),
  recipientId: uuid("recipient_id").references(() => contractRecipients.id, {
    onDelete: "set null",
  }),
  type: contractFieldTypeEnum("type").notNull(),
  page: integer("page").notNull().default(1),
  positionX: numeric("position_x").notNull().default("0"),
  positionY: numeric("position_y").notNull().default("0"),
  width: numeric("width").notNull().default("20"),
  height: numeric("height").notNull().default("6"),
  customText: text("custom_text"),
  inserted: boolean("inserted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contractSignatures = pgTable("contract_signatures", {
  id: uuid("id").primaryKey().defaultRandom(),
  fieldId: uuid("field_id")
    .notNull()
    .unique()
    .references(() => contractFields.id, { onDelete: "cascade" }),
  recipientId: uuid("recipient_id").references(() => contractRecipients.id, {
    onDelete: "cascade",
  }),
  signatureImageBase64: text("signature_image_base64"),
  typedSignature: text("typed_signature"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contractAuditLogs = pgTable("contract_audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id")
    .notNull()
    .references(() => contracts.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  data: jsonb("data"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
