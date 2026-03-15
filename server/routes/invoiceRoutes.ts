import { Router } from "express";
import {
  getInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice,
  getNextInvoiceNumber, getCustomerById, getQuoteById, createEmailLog, createPayment,
} from "../services/storage";
import { sendInvoiceEmail, isGmailConfigured } from "../services/gmailService";
import { createCheckoutSession, isStripeConfigured } from "../services/stripeService";

const router = Router();

router.get("/", (_req, res) => { res.json({ success: true, data: getInvoices() }); });
router.get("/next-number", (_req, res) => { res.json({ success: true, data: { invoiceNumber: getNextInvoiceNumber() } }); });

router.get("/:id", (req, res) => {
  const inv = getInvoiceById(parseInt(req.params.id));
  if (!inv) return res.status(404).json({ success: false, error: "Invoice not found" });
  res.json({ success: true, data: inv });
});

router.post("/", (req, res) => {
  try { res.status(201).json({ success: true, data: createInvoice(req.body) }); }
  catch (e: any) { res.status(400).json({ success: false, error: e.message }); }
});

router.post("/from-quote/:quoteId", (req, res) => {
  const q = getQuoteById(parseInt(req.params.quoteId));
  if (!q) return res.status(404).json({ success: false, error: "Quote not found" });
  const inv = createInvoice({
    invoiceNumber: getNextInvoiceNumber(), quoteId: q.id, customerId: q.customerId,
    status: "draft", title: q.title, description: q.description,
    lineItems: q.lineItems, subtotal: q.subtotal, taxRate: q.taxRate,
    taxAmount: q.taxAmount, total: q.total,
    dueDate: new Date(Date.now() + 14 * 86400000), notes: q.notes,
  });
  res.status(201).json({ success: true, data: inv });
});

router.put("/:id", (req, res) => {
  const inv = updateInvoice(parseInt(req.params.id), req.body);
  if (!inv) return res.status(404).json({ success: false, error: "Invoice not found" });
  res.json({ success: true, data: inv });
});

router.delete("/:id", (req, res) => {
  if (!deleteInvoice(parseInt(req.params.id))) return res.status(404).json({ success: false, error: "Invoice not found" });
  res.json({ success: true });
});

router.post("/:id/payment-link", async (req, res) => {
  const inv = getInvoiceById(parseInt(req.params.id));
  if (!inv) return res.status(404).json({ success: false, error: "Invoice not found" });
  if (!isStripeConfigured()) {
    return res.json({ success: true, data: { paymentUrl: "#stripe-not-configured", message: "Stripe not configured", simulated: true } });
  }
  try {
    const c = getCustomerById(inv.customerId);
    const result = await createCheckoutSession(parseFloat(inv.total), inv.invoiceNumber, c?.email || undefined);
    updateInvoice(inv.id, { stripePaymentUrl: result.url });
    res.json({ success: true, data: { paymentUrl: result.url, sessionId: result.sessionId } });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.post("/:id/send", async (req, res) => {
  const id = parseInt(req.params.id);
  const inv = getInvoiceById(id);
  if (!inv) return res.status(404).json({ success: false, error: "Invoice not found" });
  const c = getCustomerById(inv.customerId);
  if (!c?.email) return res.status(400).json({ success: false, error: "Customer has no email" });

  const lineItems = (inv.lineItems as any[]) || [];
  const lineItemsHtml = `<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f1f5f9;">
    <th style="text-align:left;padding:8px;">Description</th><th style="text-align:right;padding:8px;">Qty</th>
    <th style="text-align:right;padding:8px;">Price</th><th style="text-align:right;padding:8px;">Total</th>
    </tr></thead><tbody>${lineItems.map((i: any) => `<tr><td style="padding:8px;">${i.description}</td>
    <td style="text-align:right;padding:8px;">${i.quantity}</td><td style="text-align:right;padding:8px;">$${i.unitPrice.toFixed(2)}</td>
    <td style="text-align:right;padding:8px;">$${(i.quantity * i.unitPrice).toFixed(2)}</td></tr>`).join("")}
    <tr><td colspan="3" style="text-align:right;padding:8px;font-weight:bold;">Subtotal:</td><td style="text-align:right;padding:8px;">$${inv.subtotal}</td></tr>
    <tr><td colspan="3" style="text-align:right;padding:8px;font-weight:bold;">HST (13%):</td><td style="text-align:right;padding:8px;">$${inv.taxAmount}</td></tr>
    </tbody></table>`;

  createEmailLog({ customerId: c.id, invoiceId: inv.id, to: c.email, subject: `Invoice ${inv.invoiceNumber}`, body: `Total: $${inv.total}`, status: "sent" });
  updateInvoice(id, { status: "sent" });

  if (!isGmailConfigured()) {
    return res.json({ success: true, data: { message: "Invoice marked as sent (Gmail not configured)", simulated: true } });
  }
  try {
    const result = await sendInvoiceEmail({
      to: c.email, customerName: `${c.firstName} ${c.lastName}`, invoiceNumber: inv.invoiceNumber,
      title: inv.title, total: inv.total,
      dueDate: inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : undefined,
      paymentUrl: inv.stripePaymentUrl || undefined, lineItemsHtml,
    });
    res.json({ success: true, data: { message: "Invoice sent", messageId: result.messageId } });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.post("/:id/mark-paid", (req, res) => {
  const id = parseInt(req.params.id);
  const inv = getInvoiceById(id);
  if (!inv) return res.status(404).json({ success: false, error: "Invoice not found" });
  updateInvoice(id, { status: "paid", paidAt: new Date() });
  createPayment({
    invoiceId: inv.id, customerId: inv.customerId, amount: inv.total,
    method: req.body.method || "cash", status: "completed",
    reference: req.body.reference || null, notes: req.body.notes || null,
  });
  res.json({ success: true, data: { message: "Invoice marked as paid" } });
});

export default router;
