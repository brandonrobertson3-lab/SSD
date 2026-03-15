import nodemailer from "nodemailer";

export function isGmailConfigured(): boolean {
  return !!(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN && process.env.GMAIL_USER);
}

export async function sendEmail(params: { to: string; subject: string; body: string; html?: string }): Promise<{ messageId: string }> {
  const gmailUser = process.env.GMAIL_USER;
  if (!gmailUser) throw new Error("GMAIL_USER not set.");

  const { google } = await import("googleapis");
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  const { token } = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2", user: gmailUser,
      clientId: process.env.GMAIL_CLIENT_ID, clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN, accessToken: token,
    },
  } as any);

  const result = await transporter.sendMail({
    from: `"PlumbVoice - Brandon Robertson" <${gmailUser}>`,
    to: params.to, subject: params.subject,
    text: params.body, html: params.html || params.body.replace(/\n/g, "<br>"),
  });
  return { messageId: result.messageId };
}

export async function sendQuoteEmail(params: {
  to: string; customerName: string; quoteNumber: string;
  title: string; total: string; validUntil?: string; lineItemsHtml: string;
}): Promise<{ messageId: string }> {
  const subject = `Quote ${params.quoteNumber} from PlumbVoice`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#1e40af;color:white;padding:20px;border-radius:8px 8px 0 0;">
      <h1 style="margin:0;">PlumbVoice</h1><p style="margin:5px 0 0 0;opacity:0.9;">Brandon Robertson | 519-402-0576</p>
    </div>
    <div style="background:#f8fafc;padding:20px;border:1px solid #e2e8f0;">
      <p>Hi ${params.customerName},</p><p>Please find your quote below:</p>
      <h2 style="color:#1e40af;">Quote ${params.quoteNumber}</h2><p style="color:#64748b;">${params.title}</p>
      ${params.lineItemsHtml}
      <hr style="border:none;border-top:2px solid #1e40af;margin:16px 0;">
      <p style="font-size:20px;font-weight:bold;text-align:right;color:#1e40af;">Total: $${params.total} CAD</p>
      ${params.validUntil ? `<p style="color:#64748b;text-align:right;">Valid until: ${params.validUntil}</p>` : ""}
      <p>Call me at <strong>519-402-0576</strong> or reply to this email.</p>
      <p>Thanks,<br><strong>Brandon Robertson</strong><br>PlumbVoice</p>
    </div>
    <div style="background:#1e293b;color:#94a3b8;padding:16px;border-radius:0 0 8px 8px;font-size:12px;text-align:center;">
      345 Brock St S, Sarnia, Ontario N7T 2W7 | 519-402-0576
    </div>
  </div>`;
  return sendEmail({ to: params.to, subject, body: `Quote ${params.quoteNumber} - $${params.total} CAD`, html });
}

export async function sendInvoiceEmail(params: {
  to: string; customerName: string; invoiceNumber: string;
  title: string; total: string; dueDate?: string; paymentUrl?: string; lineItemsHtml: string;
}): Promise<{ messageId: string }> {
  const subject = `Invoice ${params.invoiceNumber} from PlumbVoice`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#1e40af;color:white;padding:20px;border-radius:8px 8px 0 0;">
      <h1 style="margin:0;">PlumbVoice</h1><p style="margin:5px 0 0 0;opacity:0.9;">Brandon Robertson | 519-402-0576</p>
    </div>
    <div style="background:#f8fafc;padding:20px;border:1px solid #e2e8f0;">
      <p>Hi ${params.customerName},</p><p>Please find your invoice below:</p>
      <h2 style="color:#1e40af;">Invoice ${params.invoiceNumber}</h2><p style="color:#64748b;">${params.title}</p>
      ${params.lineItemsHtml}
      <hr style="border:none;border-top:2px solid #1e40af;margin:16px 0;">
      <p style="font-size:20px;font-weight:bold;text-align:right;color:#1e40af;">Total Due: $${params.total} CAD</p>
      ${params.dueDate ? `<p style="color:#dc2626;text-align:right;font-weight:bold;">Due by: ${params.dueDate}</p>` : ""}
      ${params.paymentUrl ? `<div style="text-align:center;margin:20px 0;"><a href="${params.paymentUrl}" style="background:#1e40af;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Pay Now Online</a></div>` : ""}
      <p><strong>Payment methods:</strong> Credit/Debit Card, Interac e-Transfer, Cash, Cheque</p>
      <p>Thanks,<br><strong>Brandon Robertson</strong><br>PlumbVoice</p>
    </div>
    <div style="background:#1e293b;color:#94a3b8;padding:16px;border-radius:0 0 8px 8px;font-size:12px;text-align:center;">
      345 Brock St S, Sarnia, Ontario N7T 2W7 | 519-402-0576
    </div>
  </div>`;
  return sendEmail({ to: params.to, subject, body: `Invoice ${params.invoiceNumber} - $${params.total} CAD`, html });
}
