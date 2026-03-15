import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost, queryClient } from "@/lib/queryClient";
import { formatPhoneNumber, formatDateTime, cn } from "@/lib/utils";
import {
  Phone, PhoneCall, PhoneOutgoing, PhoneIncoming, User, Clock,
  ExternalLink, MessageSquare,
} from "lucide-react";

interface Props {
  onNavigate: (page: string, data?: any) => void;
  initialData?: any;
}

export default function Calls({ onNavigate, initialData }: Props) {
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(initialData?.customerId || 0);
  const [lastDial, setLastDial] = useState<any>(null);

  const { data: callLogs = [] } = useQuery({
    queryKey: ["calls"],
    queryFn: () => apiGet("/api/calls"),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => apiGet("/api/customers"),
  });

  const dialMut = useMutation({
    mutationFn: (data: any) => apiPost("/api/calls/dial", data),
    onSuccess: (data) => {
      setLastDial(data);
      queryClient.invalidateQueries({ queryKey: ["calls"] });
    },
  });

  const handleCustomerSelect = (id: number) => {
    setSelectedCustomerId(id);
    const c = customers.find((c: any) => c.id === id);
    if (c?.phone) setPhoneNumber(c.phone);
  };

  const handleDial = () => {
    if (!phoneNumber) return;
    dialMut.mutate({ phoneNumber, customerId: selectedCustomerId || undefined });
  };

  const getCustomerName = (id: number | null) => {
    if (!id) return "Unknown";
    const c = customers.find((c: any) => c.id === id);
    return c ? `${c.firstName} ${c.lastName}` : `#${id}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <Phone className="w-6 h-6 text-green-600" /> Calls
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dialer */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-green-600" /> Dialer
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
              <select value={selectedCustomerId} onChange={(e) => handleCustomerSelect(parseInt(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500">
                <option value={0}>Select customer...</option>
                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="519-555-0000"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-lg focus:ring-2 focus:ring-green-500" />
            </div>

            <button onClick={handleDial} disabled={!phoneNumber}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium">
              <PhoneCall className="w-5 h-5" /> Dial
            </button>

            {/* Dial Result */}
            {lastDial && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-sm text-slate-600">Choose how to call:</p>
                <a href={lastDial.telUri}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Phone className="w-4 h-4" /> Call via Phone App
                </a>
                <a href={lastDial.googleVoiceUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800">
                  <ExternalLink className="w-4 h-4" /> Call via Google Voice
                </a>
                {lastDial.customerName && (
                  <p className="text-xs text-slate-500 text-center">Calling: {lastDial.customerName}</p>
                )}
              </div>
            )}
          </div>

          {/* Your Info */}
          <div className="bg-slate-800 text-white rounded-xl p-5">
            <p className="text-sm text-slate-400 mb-1">Your Business Number</p>
            <p className="text-xl font-bold">519-402-0576</p>
            <p className="text-sm text-slate-400 mt-2">Brandon Robertson</p>
            <p className="text-sm text-slate-400">PlumbVoice</p>
          </div>

          {/* Quick Dial Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h4 className="text-sm font-medium text-slate-600 mb-3">Quick Dial</h4>
            <div className="space-y-2">
              {customers.filter((c: any) => c.phone).slice(0, 6).map((c: any) => (
                <button key={c.id} onClick={() => { setPhoneNumber(c.phone); setSelectedCustomerId(c.id); }}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-left">
                  <div className="p-1.5 rounded-full bg-blue-50 text-blue-600">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{c.firstName} {c.lastName}</p>
                    <p className="text-xs text-slate-400">{formatPhoneNumber(c.phone)}</p>
                  </div>
                  <Phone className="w-3.5 h-3.5 text-green-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Call Log */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <h3 className="font-medium text-slate-700">Call Log</h3>
            </div>
            {callLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Phone className="w-10 h-10 mx-auto mb-3" />
                <p>No calls recorded yet</p>
                <p className="text-sm mt-1">Use the dialer to make your first call</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Direction</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Customer</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Phone</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Duration</th>
                    <th className="text-right px-5 py-3 text-sm font-medium text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {callLogs.map((cl: any) => (
                    <tr key={cl.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        {cl.direction === "outbound" ? (
                          <PhoneOutgoing className="w-4 h-4 text-blue-500" />
                        ) : (
                          <PhoneIncoming className="w-4 h-4 text-green-500" />
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm">{getCustomerName(cl.customerId)}</td>
                      <td className="px-5 py-4 text-sm font-mono">{cl.phoneNumber}</td>
                      <td className="px-5 py-4">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getStatusColor(cl.status))}>
                          {cl.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {cl.duration ? `${Math.floor(cl.duration / 60)}m ${cl.duration % 60}s` : "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-right text-slate-500">{formatDateTime(cl.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
