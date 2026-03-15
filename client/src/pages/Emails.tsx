import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost, queryClient } from "@/lib/queryClient";
import { formatDateTime, cn, getStatusColor } from "@/lib/utils";
import { Mail, Send, User, Inbox, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

export default function Emails({ onNavigate }: Props) {
  const [showCompose, setShowCompose] = useState(false);
  const [form, setForm] = useState({ to: "", subject: "", body: "", customerId: 0 });
  const [sent, setSent] = useState(false);

  const { data: emails = [] } = useQuery({
    queryKey: ["emails"],
    queryFn: () => apiGet("/api/emails"),
  });

  const { data: emailConfig } = useQuery({
    queryKey: ["email-config"],
    queryFn: () => apiGet("/api/emails/config"),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => apiGet("/api/customers"),
  });

  const sendMut = useMutation({
    mutationFn: (data: any) => apiPost("/api/emails/send", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      setSent(true);
      setTimeout(() => { setSent(false); setShowCompose(false); setForm({ to: "", subject: "", body: "", customerId: 0 }); }, 2000);
    },
  });

  const handleCustomerSelect = (customerId: number) => {
    const c = customers.find((c: any) => c.id === customerId);
    setForm({
      ...form,
      customerId,
      to: c?.email || "",
    });
  };

  const getCustomerName = (id: number | null) => {
    if (!id) return "—";
    const c = customers.find((c: any) => c.id === id);
    return c ? `${c.firstName} ${c.lastName}` : `#${id}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-600" /> Email
        </h1>
        <button onClick={() => setShowCompose(!showCompose)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Send className="w-4 h-4" /> Compose Email
        </button>
      </div>

      {/* Gmail Status */}
      {!emailConfig?.gmailConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <strong>Gmail not configured.</strong> Set <code className="bg-amber-100 px-1 rounded">GMAIL_CLIENT_ID</code>,{" "}
          <code className="bg-amber-100 px-1 rounded">GMAIL_CLIENT_SECRET</code>,{" "}
          <code className="bg-amber-100 px-1 rounded">GMAIL_REFRESH_TOKEN</code>, and{" "}
          <code className="bg-amber-100 px-1 rounded">GMAIL_USER</code> to enable email sending.
          Emails will be logged but not actually sent until configured.
        </div>
      )}

      {/* Compose Form */}
      {showCompose && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Compose Email</h3>
          {sent && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle2 className="w-4 h-4" /> Email sent successfully!
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer (optional)</label>
              <select value={form.customerId} onChange={(e) => handleCustomerSelect(parseInt(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                <option value={0}>Select customer...</option>
                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName} - {c.email || "no email"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">To *</label>
              <input type="email" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}
                placeholder="customer@email.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject line"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={6}
              placeholder="Type your message here..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={() => sendMut.mutate(form)} disabled={!form.to || !form.subject || !form.body || sendMut.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              <Send className="w-4 h-4" /> {sendMut.isPending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* Email Log */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <h3 className="font-medium text-slate-700">Email Log</h3>
        </div>
        {emails.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Inbox className="w-10 h-10 mx-auto mb-3" />
            <p>No emails sent yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {emails.map((e: any) => (
              <div key={e.id} className="px-5 py-4 hover:bg-slate-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getStatusColor(e.status))}>
                        {e.status}
                      </span>
                      <span className="font-medium text-sm text-slate-900">{e.subject}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>To: {e.to}</span>
                      {e.customerId && <span>Customer: {getCustomerName(e.customerId)}</span>}
                      {e.quoteId && <span>Quote #{e.quoteId}</span>}
                      {e.invoiceId && <span>Invoice #{e.invoiceId}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{formatDateTime(e.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
