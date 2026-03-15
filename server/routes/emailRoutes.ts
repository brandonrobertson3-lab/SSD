import { Router } from "express";
import { getEmailLogs, getEmailLogsByCustomer, createEmailLog } from "../services/storage";
import { sendEmail, isGmailConfigured } from "../services/gmailService";

const router = Router();

router.get("/", (_req, res) => { res.json({ success: true, data: getEmailLogs() }); });

router.get("/customer/:customerId", (req, res) => {
  res.json({ success: true, data: getEmailLogsByCustomer(parseInt(req.params.customerId)) });
});

router.get("/config", (_req, res) => {
  res.json({ success: true, data: { gmailConfigured: isGmailConfigured(), senderEmail: process.env.GMAIL_USER || "Not configured" } });
});

router.post("/send", async (req, res) => {
  const { to, subject, body, customerId, invoiceId, quoteId } = req.body;
  if (!to || !subject || !body) return res.status(400).json({ success: false, error: "to, subject, and body are required" });

  if (!isGmailConfigured()) {
    const log = createEmailLog({ customerId: customerId || null, invoiceId: invoiceId || null, quoteId: quoteId || null, to, subject, body, status: "sent" });
    return res.json({ success: true, data: { message: "Email logged (Gmail not configured)", log, simulated: true } });
  }
  try {
    const result = await sendEmail({ to, subject, body });
    const log = createEmailLog({ customerId: customerId || null, invoiceId: invoiceId || null, quoteId: quoteId || null, to, subject, body, status: "sent", gmailMessageId: result.messageId });
    res.json({ success: true, data: { message: "Email sent", log, messageId: result.messageId } });
  } catch (e: any) {
    createEmailLog({ customerId: customerId || null, invoiceId: invoiceId || null, quoteId: quoteId || null, to, subject, body, status: "failed" });
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
