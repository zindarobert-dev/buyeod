import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * The directory itself. Status starts as 'pending' for self-submitted entries
 * and 'approved' for ones we seeded from the original Google Sheet.
 */
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  ownerName: text("owner_name").notNull(),
  industry: text("industry").notNull(),
  location: text("location").notNull(),
  state: text("state"),
  website: text("website"),
  phone: text("phone"),
  description: text("description"),
  /** 'pending' | 'approved' | 'rejected' */
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvedBy: text("approved_by"),
  /** Email of the submitter, if available. Not displayed publicly. */
  submitterEmail: text("submitter_email"),
  /** Internal note from the reviewer. Not displayed publicly. */
  reviewerNote: text("reviewer_note"),
});

/* ----------------------- Auth.js Drizzle adapter tables ----------------------- */

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (a) => [primaryKey({ columns: [a.provider, a.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

/** TS row types — handy elsewhere */
export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;

/** Whether an arbitrary value indicates "approved" (used in seed/import scripts). */
export const APPROVED_STATUS = "approved" as const;
export const PENDING_STATUS = "pending" as const;
export const REJECTED_STATUS = "rejected" as const;
