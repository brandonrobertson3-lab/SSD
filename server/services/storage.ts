import type {
  Customer, InsertCustomer, Quote, InsertQuote,
  Invoice, InsertInvoice, Payment, InsertPayment,
  EmailLog, InsertEmailLog, CallLog, InsertCallLog,
  AgentSuggestion, InsertAgentSuggestion,
  QuoteLineItem, InvoiceLineItem,
} from "../../shared/schema";

let customerIdCounter = 1;
let quoteIdCounter = 1;
let invoiceIdCounter = 1;
let paymentIdCounter = 1;
let emailLogIdCounter = 1;
let callLogIdCounter = 1;
let agentSuggestionIdCounter = 1;
let quoteNumberCounter = 1000;
let invoiceNumberCounter = 5000;

const customersStore: Customer[] = [];
const quotesStore: Quote[] = [];
const invoicesStore: Invoice[] = [];
const paymentsStore: Payment[] = [];
const emailLogsStore: EmailLog[] = [];
const callLogsStore: CallLog[] = [];
const agentSuggestionsStore: AgentSuggestion[] = [];

function seedData() {
  const sampleCustomers: InsertCustomer[] = [
    { firstName: "John", lastName: "Mitchell", email: "john.mitchell@email.com", phone: "519-555-0101", address: "123 Front St N", city: "Sarnia", province: "Ontario", postalCode: "N7T 1A1", notes: "Regular customer - annual furnace maintenance" },
    { firstName: "Sarah", lastName: "Chen", email: "sarah.chen@email.com", phone: "519-555-0202", address: "456 London Rd", city: "Sarnia", province: "Ontario", postalCode: "N7T 3C5", notes: "New construction project" },
    { firstName: "Mike", lastName: "Thompson", email: "mike.t@email.com", phone: "519-555-0303", address: "789 Exmouth St", city: "Sarnia", province: "Ontario", postalCode: "N7T 4B2", notes: "Commercial property owner - multiple units" },
    { firstName: "Lisa", lastName: "Rodriguez", email: "lisa.rod@email.com", phone: "519-555-0404", address: "321 Christina St S", city: "Sarnia", province: "Ontario", postalCode: "N7T 2M4", notes: "" },
  ];
  for (const c of sampleCustomers) createCustomer(c);

  const q1Items: QuoteLineItem[] = [
    { id: "li1", description: "Hot water tank replacement (50 gal)", quantity: 1, unitPrice: 1200, category: "materials" },
    { id: "li2", description: "Installation labor", quantity: 4, unitPrice: 95, category: "labor" },
    { id: "li3", description: "Copper fittings and connectors", quantity: 1, unitPrice: 85, category: "materials" },
    { id: "li4", description: "Permit and inspection", quantity: 1, unitPrice: 150, category: "other" },
  ];
  const q1Sub = q1Items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  createQuote({
    quoteNumber: "PV-Q-1001", customerId: 1, status: "sent", title: "Hot Water Tank Replacement",
    description: "Replace existing 40-gal tank with new 50-gal high-efficiency unit",
    lineItems: q1Items, subtotal: q1Sub.toFixed(2), taxRate: "0.13",
    taxAmount: (q1Sub * 0.13).toFixed(2), total: (q1Sub * 1.13).toFixed(2),
    validUntil: new Date(Date.now() + 30 * 86400000), notes: "Price includes removal and disposal of old unit",
  });

  const q2Items: QuoteLineItem[] = [
    { id: "li5", description: "Basement rough-in plumbing", quantity: 1, unitPrice: 2800, category: "labor" },
    { id: "li6", description: "PEX piping and fittings", quantity: 1, unitPrice: 650, category: "materials" },
    { id: "li7", description: "Drain/waste/vent system", quantity: 1, unitPrice: 1200, category: "materials" },
    { id: "li8", description: "Bathroom fixture hookup", quantity: 3, unitPrice: 175, category: "labor" },
  ];
  const q2Sub = q2Items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  createQuote({
    quoteNumber: "PV-Q-1002", customerId: 2, status: "draft", title: "Basement Bathroom Rough-In",
    description: "Complete rough-in plumbing for new basement bathroom",
    lineItems: q2Items, subtotal: q2Sub.toFixed(2), taxRate: "0.13",
    taxAmount: (q2Sub * 0.13).toFixed(2), total: (q2Sub * 1.13).toFixed(2),
    validUntil: new Date(Date.now() + 30 * 86400000), notes: "Assumes open ceiling access.",
  });

  const inv1Items: InvoiceLineItem[] = [
    { id: "inv-li1", description: "Emergency pipe repair", quantity: 1, unitPrice: 350, category: "labor" },
    { id: "inv-li2", description: "Copper pipe section (6ft)", quantity: 2, unitPrice: 45, category: "materials" },
    { id: "inv-li3", description: "Emergency call-out fee", quantity: 1, unitPrice: 125, category: "other" },
  ];
  const inv1Sub = inv1Items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  createInvoice({
    invoiceNumber: "PV-INV-5001", customerId: 3, status: "sent",
    title: "Emergency Pipe Repair - 789 Exmouth St",
    description: "Emergency burst pipe repair in Unit 2 kitchen",
    lineItems: inv1Items, subtotal: inv1Sub.toFixed(2), taxRate: "0.13",
    taxAmount: (inv1Sub * 0.13).toFixed(2), total: (inv1Sub * 1.13).toFixed(2),
    dueDate: new Date(Date.now() + 14 * 86400000), notes: "Net 14 days.",
  });

  const inv2Items: InvoiceLineItem[] = [
    { id: "inv-li4", description: "Kitchen faucet replacement", quantity: 1, unitPrice: 285, category: "materials" },
    { id: "inv-li5", description: "Installation labor", quantity: 1.5, unitPrice: 95, category: "labor" },
    { id: "inv-li6", description: "Disposal of old fixture", quantity: 1, unitPrice: 25, category: "other" },
  ];
  const inv2Sub = inv2Items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  createInvoice({
    invoiceNumber: "PV-INV-5002", customerId: 4, status: "paid",
    title: "Kitchen Faucet Replacement",
    description: "Replace leaking kitchen faucet with customer-selected Moen model",
    lineItems: inv2Items, subtotal: inv2Sub.toFixed(2), taxRate: "0.13",
    taxAmount: (inv2Sub * 0.13).toFixed(2), total: (inv2Sub * 1.13).toFixed(2),
    dueDate: new Date(Date.now() - 7 * 86400000), paidAt: new Date(Date.now() - 5 * 86400000),
    notes: "Paid via e-transfer",
  });

  createPayment({
    invoiceId: 2, customerId: 4, amount: (inv2Sub * 1.13).toFixed(2),
    method: "e-transfer", status: "completed", reference: "ET-20240115-001",
    notes: "Received via Interac e-Transfer",
  });
}

// ─── Customer CRUD ───────────────────────────────────────────────────
export function createCustomer(data: InsertCustomer): Customer {
  const customer: Customer = {
    ...data, id: customerIdCounter++,
    email: data.email ?? null, phone: data.phone ?? null,
    address: data.address ?? null, city: data.city ?? null,
    province: data.province ?? null, postalCode: data.postalCode ?? null,
    notes: data.notes ?? null, createdAt: new Date(), updatedAt: new Date(),
  };
  customersStore.push(customer);
  return customer;
}
export function getCustomers(): Customer[] { return [...customersStore]; }
export function getCustomerById(id: number): Customer | undefined { return customersStore.find((c) => c.id === id); }
export function updateCustomer(id: number, data: Partial<InsertCustomer>): Customer | undefined {
  const idx = customersStore.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  customersStore[idx] = { ...customersStore[idx], ...data, updatedAt: new Date() };
  return customersStore[idx];
}
export function deleteCustomer(id: number): boolean {
  const idx = customersStore.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  customersStore.splice(idx, 1);
  return true;
}

// ─── Quote CRUD ──────────────────────────────────────────────────────
export function createQuote(data: InsertQuote): Quote {
  const quote: Quote = {
    ...data, id: quoteIdCounter++,
    quoteNumber: data.quoteNumber || `PV-Q-${++quoteNumberCounter}`,
    status: data.status || "draft", description: data.description ?? null,
    lineItems: data.lineItems ?? [], subtotal: data.subtotal ?? "0",
    taxRate: data.taxRate ?? "0.13", taxAmount: data.taxAmount ?? "0",
    total: data.total ?? "0", validUntil: data.validUntil ?? null,
    notes: data.notes ?? null, createdAt: new Date(), updatedAt: new Date(),
  };
  quotesStore.push(quote);
  return quote;
}
export function getQuotes(): Quote[] { return [...quotesStore]; }
export function getQuoteById(id: number): Quote | undefined { return quotesStore.find((q) => q.id === id); }
export function updateQuote(id: number, data: Partial<InsertQuote>): Quote | undefined {
  const idx = quotesStore.findIndex((q) => q.id === id);
  if (idx === -1) return undefined;
  quotesStore[idx] = { ...quotesStore[idx], ...data, updatedAt: new Date() };
  return quotesStore[idx];
}
export function deleteQuote(id: number): boolean {
  const idx = quotesStore.findIndex((q) => q.id === id);
  if (idx === -1) return false;
  quotesStore.splice(idx, 1);
  return true;
}
export function getNextQuoteNumber(): string { return `PV-Q-${quoteNumberCounter + 1}`; }

// ─── Invoice CRUD ────────────────────────────────────────────────────
export function createInvoice(data: InsertInvoice): Invoice {
  const invoice: Invoice = {
    ...data, id: invoiceIdCounter++,
    invoiceNumber: data.invoiceNumber || `PV-INV-${++invoiceNumberCounter}`,
    quoteId: data.quoteId ?? null, status: data.status || "draft",
    description: data.description ?? null, lineItems: data.lineItems ?? [],
    subtotal: data.subtotal ?? "0", taxRate: data.taxRate ?? "0.13",
    taxAmount: data.taxAmount ?? "0", total: data.total ?? "0",
    dueDate: data.dueDate ?? null, paidAt: data.paidAt ?? null,
    stripePaymentIntentId: data.stripePaymentIntentId ?? null,
    stripePaymentUrl: data.stripePaymentUrl ?? null,
    notes: data.notes ?? null, createdAt: new Date(), updatedAt: new Date(),
  };
  invoicesStore.push(invoice);
  return invoice;
}
export function getInvoices(): Invoice[] { return [...invoicesStore]; }
export function getInvoiceById(id: number): Invoice | undefined { return invoicesStore.find((i) => i.id === id); }
export function updateInvoice(id: number, data: Partial<InsertInvoice>): Invoice | undefined {
  const idx = invoicesStore.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  invoicesStore[idx] = { ...invoicesStore[idx], ...data, updatedAt: new Date() };
  return invoicesStore[idx];
}
export function deleteInvoice(id: number): boolean {
  const idx = invoicesStore.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  invoicesStore.splice(idx, 1);
  return true;
}
export function getNextInvoiceNumber(): string { return `PV-INV-${invoiceNumberCounter + 1}`; }

// ─── Payment CRUD ────────────────────────────────────────────────────
export function createPayment(data: InsertPayment): Payment {
  const payment: Payment = {
    ...data, id: paymentIdCounter++,
    stripePaymentIntentId: data.stripePaymentIntentId ?? null,
    reference: data.reference ?? null, notes: data.notes ?? null,
    createdAt: new Date(),
  };
  paymentsStore.push(payment);
  return payment;
}
export function getPayments(): Payment[] { return [...paymentsStore]; }
export function getPaymentsByInvoice(invoiceId: number): Payment[] { return paymentsStore.filter((p) => p.invoiceId === invoiceId); }
export function getPaymentsByCustomer(customerId: number): Payment[] { return paymentsStore.filter((p) => p.customerId === customerId); }

// ─── Email Log CRUD ──────────────────────────────────────────────────
export function createEmailLog(data: InsertEmailLog): EmailLog {
  const log: EmailLog = {
    ...data, id: emailLogIdCounter++,
    customerId: data.customerId ?? null, invoiceId: data.invoiceId ?? null,
    quoteId: data.quoteId ?? null, gmailMessageId: data.gmailMessageId ?? null,
    createdAt: new Date(),
  };
  emailLogsStore.push(log);
  return log;
}
export function getEmailLogs(): EmailLog[] { return [...emailLogsStore]; }
export function getEmailLogsByCustomer(customerId: number): EmailLog[] { return emailLogsStore.filter((e) => e.customerId === customerId); }

// ─── Call Log CRUD ───────────────────────────────────────────────────
export function createCallLog(data: InsertCallLog): CallLog {
  const log: CallLog = {
    ...data, id: callLogIdCounter++,
    customerId: data.customerId ?? null, duration: data.duration ?? null,
    notes: data.notes ?? null, recordingUrl: data.recordingUrl ?? null,
    createdAt: new Date(),
  };
  callLogsStore.push(log);
  return log;
}
export function getCallLogs(): CallLog[] { return [...callLogsStore]; }
export function getCallLogsByCustomer(customerId: number): CallLog[] { return callLogsStore.filter((c) => c.customerId === customerId); }

// ─── Agent Suggestions ───────────────────────────────────────────────
export function createAgentSuggestion(data: InsertAgentSuggestion): AgentSuggestion {
  const suggestion: AgentSuggestion = {
    ...data, id: agentSuggestionIdCounter++,
    accepted: data.accepted ?? null, createdAt: new Date(),
  };
  agentSuggestionsStore.push(suggestion);
  return suggestion;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────
export function getDashboardStats() {
  const totalRevenue = paymentsStore.filter((p) => p.status === "completed").reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const recentActivity = [
    ...quotesStore.map((q) => ({ id: q.id, type: "quote" as const, description: `Quote ${q.quoteNumber} - ${q.title}`, timestamp: q.createdAt.toISOString(), amount: parseFloat(q.total) })),
    ...invoicesStore.map((i) => ({ id: i.id, type: "invoice" as const, description: `Invoice ${i.invoiceNumber} - ${i.title}`, timestamp: i.createdAt.toISOString(), amount: parseFloat(i.total) })),
    ...paymentsStore.map((p) => ({ id: p.id, type: "payment" as const, description: `Payment received - $${p.amount}`, timestamp: p.createdAt.toISOString(), amount: parseFloat(p.amount) })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  return {
    totalCustomers: customersStore.length,
    activeQuotes: quotesStore.filter((q) => q.status === "sent" || q.status === "draft").length,
    pendingInvoices: invoicesStore.filter((i) => i.status === "sent" || i.status === "draft").length,
    totalRevenue,
    recentActivity,
  };
}

seedData();
