import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete, queryClient } from "@/lib/queryClient";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import {
  FileText, Plus, Pencil, Trash2, Send, Search, Save, ArrowLeft, Copy,
  ChevronDown, Bot,
} from "lucide-react";

interface Props {
  onNavigate: (page: string, data?: any) => void;
  initialData?: any;
}

const categories = ["labor", "materials", "equipment", "other"];

function emptyItem() {
  return { id: uuid(), description: "", quantity: 1, unitPrice: 0, category: "labor" as const };
}

export default function Quotes({ onNavigate, initialData }: Props) {
  const [view, setView] = useState<"list" | "form">("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    customerId: 0, title: "", description: "", notes: "",
    lineItems: [emptyItem()],
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: () => apiGet("/api/quotes"),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => apiGet("/api/customers"),
  });

  const { data: nextNumber } = useQuery({
    queryKey: ["next-quote-number"],
    queryFn: () => apiGet("/api/quotes/next-number"),
    enabled: view === "form" && !editId,
  });

  const createMut = useMutation({
    mutationFn: (data: any) => apiPost("/api/quotes", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["quotes"] }); setView("list"); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: any) => apiPut(`/api/quotes/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["quotes"] }); setView("list"); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiDelete(`/api/quotes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quotes"] }),
  });

  const sendMut = useMutation({
    mutationFn: (id: number) => apiPost(`/api/quotes/${id}/send`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quotes"] }),
  });

  const convertMut = useMutation({
    mutationFn: (quoteId: number) => apiPost(`/api/invoices/from-quote/${quoteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onNavigate("invoices");
    },
  });

  // Handle initialData from AI agent or other pages
  useEffect(() => {
    if (initialData?.fromAgent) {
      setForm({
        customerId: 0,
        title: initialData.title || "",
        description: initialData.description || "",
        notes: initialData.notes || "",
        lineItems: initialData.lineItems || [emptyItem()],
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      });
      setEditId(null);
      setView("form");
    }
  }, [initialData]);

  const subtotal = form.lineItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxAmount = subtotal * 0.13;
  const total = subtotal + taxAmount;

  const handleSave = () => {
    const payload = {
      quoteNumber: editId ? undefined : nextNumber?.quoteNumber,
      customerId: form.customerId,
      title: form.title,
      description: form.description,
      notes: form.notes,
      lineItems: form.lineItems,
      subtotal: subtotal.toFixed(2),
      taxRate: "0.13",
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
      validUntil: form.validUntil ? new Date(form.validUntil) : null,
    };
    if (editId) updateMut.mutate({ id: editId, data: payload });
    else createMut.mutate(payload);
  };

  const addItem = () => setForm({ ...form, lineItems: [...form.lineItems, emptyItem()] });
  const removeItem = (id: string) => {
    if (form.lineItems.length <= 1) return;
    setForm({ ...form, lineItems: form.lineItems.filter((i) => i.id !== id) });
  };
  const updateItem = (id: string, field: string, value: any) => {
    setForm({
      ...form,
      lineItems: form.lineItems.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    });
  };

  const openEdit = (q: any) => {
    setForm({
      customerId: q.customerId,
      title: q.title,
      description: q.description || "",
      notes: q.notes || "",
      lineItems: (q.lineItems as any[])?.length ? q.lineItems : [emptyItem()],
      validUntil: q.validUntil ? new Date(q.validUntil).toISOString().split("T")[0] : "",
    });
    setEditId(q.id);
    setView("form");
  };

  const getCustomerName = (id: number) => {
    const c = customers.find((c: any) => c.id === id);
    return c ? `${c.firstName} ${c.lastName}` : `Customer #${id}`;
  };

  const filtered = quotes.filter((q: any) => {
    const matchesSearch = !search || `${q.quoteNumber} ${q.title} ${getCustomerName(q.customerId)}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ─── Form View ─────────────────────────────────────────────────────
  if (view === "form") {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView("list")} className="p-2 hover:bg-slate-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900">
              {editId ? "Edit Quote" : `New Quote ${nextNumber?.quoteNumber || ""}`}
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView("list")} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={!form.customerId || !form.title}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Quote
            </button>
          </div>
        </div>

        {/* AI Agent shortcut */}
        <button onClick={() => onNavigate("agent")}
          className="w-full flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 hover:bg-indigo-100 transition-colors">
          <Bot className="w-5 h-5" />
          <span className="font-medium">Need help estimating? Use the AI Agent to generate line items</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Quote Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer *</label>
              <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: parseInt(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                <option value={0}>Select customer...</option>
                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valid Until</label>
              <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Hot Water Tank Replacement"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Line Items</h3>
            <button onClick={addItem} className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-500 px-1">
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-1" />
            </div>
            {form.lineItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <input value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Description" className="col-span-4 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                <select value={item.category} onChange={(e) => updateItem(item.id, "category", e.target.value)}
                  className="col-span-2 border border-slate-300 rounded-lg px-2 py-2 text-sm capitalize focus:ring-2 focus:ring-blue-500">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                  min={0} step={0.5} className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                <div className="col-span-2 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input type="number" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                    min={0} step={5} className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-1 text-sm font-medium text-slate-700">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </div>
                <button onClick={() => removeItem(item.id)} disabled={form.lineItems.length <= 1}
                  className="col-span-1 p-2 text-slate-400 hover:text-red-500 disabled:opacity-30">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4 space-y-2 text-right">
            <div className="text-sm text-slate-600">Subtotal: <span className="font-medium ml-2">{formatCurrency(subtotal)}</span></div>
            <div className="text-sm text-slate-600">HST (13%): <span className="font-medium ml-2">{formatCurrency(taxAmount)}</span></div>
            <div className="text-lg font-bold text-blue-700">Total: {formatCurrency(total)}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
            placeholder="Additional notes for the customer..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    );
  }

  // ─── List View ─────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-600" /> Quotes
        </h1>
        <button onClick={() => { setForm({ ...form, customerId: 0, title: "", description: "", notes: "", lineItems: [emptyItem()] }); setEditId(null); setView("form"); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Quote
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search quotes..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Quote #</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Customer</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Title</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Status</th>
              <th className="text-right px-5 py-3 text-sm font-medium text-slate-600">Total</th>
              <th className="text-right px-5 py-3 text-sm font-medium text-slate-600">Valid Until</th>
              <th className="text-right px-5 py-3 text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((q: any) => (
              <tr key={q.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 text-sm font-mono font-medium text-blue-600">{q.quoteNumber}</td>
                <td className="px-5 py-4 text-sm">{getCustomerName(q.customerId)}</td>
                <td className="px-5 py-4 text-sm">{q.title}</td>
                <td className="px-5 py-4">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getStatusColor(q.status))}>
                    {q.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-right font-medium">{formatCurrency(q.total)}</td>
                <td className="px-5 py-4 text-sm text-right text-slate-500">{formatDate(q.validUntil)}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(q)} title="Edit" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {(q.status === "draft" || q.status === "sent") && (
                      <button onClick={() => sendMut.mutate(q.id)} title="Send via Email" className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {q.status === "accepted" && (
                      <button onClick={() => convertMut.mutate(q.id)} title="Convert to Invoice" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => { if (confirm("Delete this quote?")) deleteMut.mutate(q.id); }} title="Delete"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  No quotes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
