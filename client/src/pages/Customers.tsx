import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete, queryClient } from "@/lib/queryClient";
import { formatDate, formatPhoneNumber, cn } from "@/lib/utils";
import {
  Users, Plus, Pencil, Trash2, Search, Phone, Mail, MapPin, X, Save, User,
} from "lucide-react";

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

const emptyForm = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", city: "Sarnia", province: "Ontario", postalCode: "", notes: "",
};

export default function Customers({ onNavigate }: Props) {
  const [view, setView] = useState<"list" | "form">("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => apiGet("/api/customers"),
  });

  const createMut = useMutation({
    mutationFn: (data: any) => apiPost("/api/customers", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["customers"] }); setView("list"); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: any) => apiPut(`/api/customers/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["customers"] }); setView("list"); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiDelete(`/api/customers/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  const filtered = customers.filter((c: any) => {
    const q = search.toLowerCase();
    return !q || `${c.firstName} ${c.lastName} ${c.email} ${c.phone} ${c.city}`.toLowerCase().includes(q);
  });

  const openCreate = () => { setForm(emptyForm); setEditId(null); setView("form"); };
  const openEdit = (c: any) => {
    setForm({
      firstName: c.firstName, lastName: c.lastName, email: c.email || "",
      phone: c.phone || "", address: c.address || "", city: c.city || "Sarnia",
      province: c.province || "Ontario", postalCode: c.postalCode || "", notes: c.notes || "",
    });
    setEditId(c.id);
    setView("form");
  };

  const handleSave = () => {
    if (editId) updateMut.mutate({ id: editId, data: form });
    else createMut.mutate(form);
  };

  if (view === "form") {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {editId ? "Edit Customer" : "New Customer"}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setView("list")} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={!form.firstName || !form.lastName}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
              <input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
              <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" /> Customers
        </h1>
        <button onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-48 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-32" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <User className="w-12 h-12 mx-auto mb-3" />
          <p className="text-lg">No customers found</p>
          <button onClick={openCreate} className="mt-3 text-blue-600 hover:text-blue-700">Add your first customer</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c: any) => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{c.firstName} {c.lastName}</h3>
                  {c.notes && <p className="text-xs text-slate-400 mt-0.5">{c.notes}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (confirm("Delete this customer?")) deleteMut.mutate(c.id); }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-slate-600">
                {c.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">{c.email}</a>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${c.phone}`} className="text-blue-600 hover:underline">{formatPhoneNumber(c.phone)}</a>
                  </div>
                )}
                {c.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.address}, {c.city}, {c.province}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                <button onClick={() => onNavigate("quotes", { customerId: c.id })}
                  className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded hover:bg-amber-100">New Quote</button>
                <button onClick={() => onNavigate("invoices", { customerId: c.id })}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">New Invoice</button>
                {c.phone && (
                  <button onClick={() => onNavigate("calls", { phoneNumber: c.phone, customerId: c.id })}
                    className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100">Call</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
