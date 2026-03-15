export type {
  Customer,
  InsertCustomer,
  Quote,
  InsertQuote,
  QuoteLineItem,
  Invoice,
  InsertInvoice,
  InvoiceLineItem,
  Payment,
  InsertPayment,
  EmailLog,
  InsertEmailLog,
  CallLog,
  InsertCallLog,
  AgentSuggestion,
  InsertAgentSuggestion,
} from "./schema";

export { BUSINESS_CONFIG } from "./schema";

// ─── API Response types ──────────────────────────────────────────────
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  activeQuotes: number;
  pendingInvoices: number;
  totalRevenue: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: "quote" | "invoice" | "payment" | "email" | "call";
  description: string;
  timestamp: string;
  amount?: number;
}

export interface QuoteEstimateRequest {
  jobDescription: string;
  jobType: string;
  urgency: "normal" | "urgent" | "emergency";
  propertyType: "residential" | "commercial";
}

export interface QuoteEstimateResponse {
  estimatedLineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    category: "labor" | "materials" | "equipment" | "other";
  }[];
  estimatedTotal: number;
  estimatedDuration: string;
  notes: string;
  confidence: number;
}

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  customerId?: number;
  invoiceId?: number;
  quoteId?: number;
}

export interface InitiateCallRequest {
  phoneNumber: string;
  customerId?: number;
}

export interface CreatePaymentLinkRequest {
  invoiceId: number;
}

export interface CreatePaymentLinkResponse {
  paymentUrl: string;
  paymentIntentId: string;
}
