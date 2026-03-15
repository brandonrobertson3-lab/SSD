import { Router } from "express";
import { getQuotes, getQuoteById, createQuote, updateQuote, deleteQuote, getNextQuoteNumber, getCustomerById, createEmailLog } from "../services/storage";
import { sendQuoteEmail, isGmailConfigured } from "../services/gmailService";

const router = Router();

router.get("/", (_req, res) => { res.json({ success: true, data: getQuotes() }); });
router.get("/next-number", (_req, res) => { res.json({ success: true, data: { quoteNumber: getNextQuoteNumber() } }); });

router.get("/:id", (req, res) => {
  const q = getQuoteById(parseInt(req.params.id));
  if (!q) return res.status(404).json({ success: false, error: "Quote not found" });
  res.json({ success: true, data: q });
});

router.post("/", (req, res) => {
  try { res.status(201).json({ success: true, data: createQuote(req.body) }); }
  catch (e: any) { res.status(400).json({ success: false, error: e.message }); }
});

router.put("/:id", (req, res) => {
  const q = updateQuote(parseInt(req.params.id), req.body);
  if (!q) return res.status(404).json({ success: false, error: "Quote not found" });
  res.json({ success: true, data: q });
});

router.delete("/:id", (req, res) => {
  if (!deleteQuote(parseInt(req.params.id))) return res.status(404).json({ success: false, error: "Quote not found" });
  res.json({ success: true });
});

router.post("/:id/send", async (req, res) => {
  const id = parseInt(req.params.id);
  const q = getQuoteById(id);
  if (!q) return res.status(404).json({ success: false, error: "Quote not found" });
  const c = getCustomerById(q.customerId);
  if (!c) return res.status(404).json({ success: false, error: "Customer not found" });
  if (!c.email) return res.status(400).json({ success: false, error: "Customer has no email" });

  const lineItems = (q.lineItems as any[]) || [];
  const lineItemsHtml = `<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f1f5f9;">
    <th style="text-align:left;padding:8px;">Description</th><th style="text-align:right;padding:8px;">Qty</th>
    <th style="text-align:right;padding:8px;">Price</th><th style="text-align:right;padding:8px;">Total</th>
    </tr></thead><tbody>${lineItems.map((i: any) => `<tr><td style="padding:8px;">${i.description}</td>
    <td style="text-align:right;padding:8px;">${i.quantity}</td><td style="text-align:right;padding:8px;">$${i.unitPrice.toFixed(2)}</td>
    <td style="text-align:right;padding:8px;">$${(i.quantity * i.unitPrice).toFixed(2)}</td></tr>`).join("")}
    <tr><td colspan="3" style="text-align:right;padding:8px;font-weight:bold;">Subtotal:</td><td style="text-align:right;padding:8px;">$${q.subtotal}</td></tr>
    <tr><td colspan="3" style="text-align:right;padding:8px;font-weight:bold;">HST (13%):</td><td style="text-align:right;padding:8px;">$${q.taxAmount}</td></tr>
    </tbody></table>`;

  createEmailLog({ customerId: c.id, quoteId: q.id, to: c.email, subject: `Quote ${q.quoteNumber}`, body: `Total: $${q.total}`, status: "sent" });
  updateQuote(id, { status: "sent" });

  if (!isGmailConfigured()) {
    return res.json({ success: true, data: { message: "Quote marked as sent (Gmail not configured)", simulated: true } });
  }
  try {
    const result = await sendQuoteEmail({
      to: c.email, customerName: `${c.firstName} ${c.lastName}`, quoteNumber: q.quoteNumber,
      title: q.title, total: q.total, validUntil: q.validUntil ? new Date(q.validUntil).toLocaleDateString() : undefined,
      lineItemsHtml,
    });
    res.json({ success: true, data: { message: "Quote sent", messageId: result.messageId } });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

export default router;
