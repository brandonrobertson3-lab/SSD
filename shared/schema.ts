import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Customers ───────────────────────────────────────────────────────
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postal_code"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// ─── Quote Line Items ────────────────────────────────────────────────
export const quoteLineItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  category: z.enum(["labor", "materials", "equipment", "other"]),
});
export type QuoteLineItem = z.infer<typeof quoteLineItemSchema>;

// ─── Quotes ──────────────────────────────────────────────────────────
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  quoteNumber: text("quote_number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  status: text("status").notNull().default("draft"),
  title: text("title").notNull(),
  description: text("description"),
  lineItems: jsonb("line_items").$type<QuoteLineItem[]>().notNull().default([]),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull().default("0"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 4 }).notNull().default("0.13"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull().default("0"),
  validUntil: timestamp("valid_until"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

// ─── Invoice Line Items ──────────────────────────────────────────────
export const invoiceLineItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  category: z.enum(["labor", "materials", "equipment", "other"]),
});
export type InvoiceLineItem = z.infer<typeof invoiceLineItemSchema>;

// ─── Invoices ────────────────────────────────────────────────────────
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  quoteId: integer("quote_id"),
  customerId: integer("customer_id").notNull(),
  status: text("status").notNull().default("draft"),
  title: text("title").notNull(),
  description: text("description"),
  lineItems: jsonb("line_items").$type<InvoiceLineItem[]>().notNull().default([]),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull().default("0"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 4 }).notNull().default("0.13"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull().default("0"),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripePaymentUrl: text("stripe_payment_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// ─── Payments ────────────────────────────────────────────────────────
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull(),
  customerId: integer("customer_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull(),
  status: text("status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  reference: text("reference"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// ─── Email Log ───────────────────────────────────────────────────────
export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id"),
  invoiceId: integer("invoice_id"),
  quoteId: integer("quote_id"),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull().default("sent"),
  gmailMessageId: text("gmail_message_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailLogSchema = createInsertSchema(emailLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type EmailLog = typeof emailLogs.$inferSelect;

// ─── Call Log ────────────────────────────────────────────────────────
export const callLogs = pgTable("call_logs", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id"),
  phoneNumber: text("phone_number").notNull(),
  direction: text("direction").notNull(),
  duration: integer("duration"),
  status: text("status").notNull(),
  notes: text("notes"),
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCallLogSchema = createInsertSchema(callLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type CallLog = typeof callLogs.$inferSelect;

// ─── AI Agent Suggestions ────────────────────────────────────────────
export const agentSuggestions = pgTable("agent_suggestions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  input: text("input").notNull(),
  suggestion: jsonb("suggestion").notNull(),
  accepted: boolean("accepted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAgentSuggestionSchema = createInsertSchema(agentSuggestions).omit({
  id: true,
  createdAt: true,
});
export type InsertAgentSuggestion = z.infer<typeof insertAgentSuggestionSchema>;
export type AgentSuggestion = typeof agentSuggestions.$inferSelect;

// ─── Business Config ─────────────────────────────────────────────────
export const BUSINESS_CONFIG = {
  name: "PlumbVoice",
  owner: "Brandon Robertson",
  address: "345 Brock St S",
  city: "Sarnia",
  province: "Ontario",
  postalCode: "N7T 2W7",
  country: "Canada",
  phone: "519-402-0576",
  taxRate: 0.13,
  currency: "CAD",
} as const;
