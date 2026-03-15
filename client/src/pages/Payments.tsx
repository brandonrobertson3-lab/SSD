import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/queryClient";
import { formatCurrency, formatDateTime, getStatusColor, cn } from "@/lib/utils";
import { DollarSign, CreditCard, Banknote, ArrowRightLeft, Receipt, CheckCircle } from "lucide-react";

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

export default function Payments({ onNavigate }: Props) {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => apiGet("/api/payments"),
  });

  const { data: payConfig } = useQuery({
    queryKey: ["payment-config"],
    queryFn: () => apiGet("/api/payments/config"),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => apiGet("/api/customers"),
  });

  const getCustomerName = (id: number) => {
    const c = customers.find((c: any) => c.id === id);
    return c ? `${c.firstName} ${c.lastName}` : `#${id}`;
  };

  const methodIcon = (method: string) => {
    switch (method) {
      case "stripe": return <CreditCard className="w-4 h-4 text-purple-500" />;
      case "cash": return <Banknote className="w-4 h-4 text-green-500" />;
      case "e-transfer": return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
      default: return <Receipt className="w-4 h-4 text-slate-400" />;
    }
  };

  const totalReceived = payments
    .filter((p: any) => p.status === "completed")
    .reduce((s: number, p: any) => s + parseFloat(p.amount), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-emerald-600" /> Payments
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Total Received</p>
          <p className="text-2xl font-bold text-emerald-700">{formatCurrency(totalReceived)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Total Payments</p>
          <p className="text-2xl font-bold text-slate-900">{payments.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Payment Methods</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {payConfig?.acceptedMethods?.map((m: any) => (
              <span key={m.id} className={cn("text-xs px-2 py-1 rounded-full", m.enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400")}>
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stripe Status */}
      {!payConfig?.stripeConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <strong>Stripe not configured.</strong> Set <code className="bg-amber-100 px-1 rounded">STRIPE_SECRET_KEY</code> in your environment to enable online card payments.
          Cash, cheque, and e-transfer are still available.
        </div>
      )}

      {/* Payment Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Method</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Customer</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Invoice</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Status</th>
              <th className="text-right px-5 py-3 text-sm font-medium text-slate-600">Amount</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Reference</th>
              <th className="text-right px-5 py-3 text-sm font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p: any) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm capitalize">
                    {methodIcon(p.method)}
                    {p.method}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm">{getCustomerName(p.customerId)}</td>
                <td className="px-5 py-4 text-sm font-mono text-blue-600">INV-{p.invoiceId}</td>
                <td className="px-5 py-4">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getStatusColor(p.status))}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-right font-medium">{formatCurrency(p.amount)}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{p.reference || "—"}</td>
                <td className="px-5 py-4 text-sm text-right text-slate-500">{formatDateTime(p.createdAt)}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  No payments recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
