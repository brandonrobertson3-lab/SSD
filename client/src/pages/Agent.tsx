import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/queryClient";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Bot, Sparkles, Zap, Brain, ArrowRight, FileText, Lightbulb,
  Clock, BarChart3, Wrench,
} from "lucide-react";

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

export default function Agent({ onNavigate }: Props) {
  const [form, setForm] = useState({
    jobDescription: "",
    jobType: "general_plumbing",
    urgency: "normal" as "normal" | "urgent" | "emergency",
    propertyType: "residential" as "residential" | "commercial",
  });
  const [estimate, setEstimate] = useState<any>(null);

  const { data: jobTypes = [] } = useQuery({
    queryKey: ["job-types"],
    queryFn: () => apiGet("/api/agent/job-types"),
  });

  const estimateMut = useMutation({
    mutationFn: (data: any) => apiPost("/api/agent/estimate", data),
    onSuccess: (data) => setEstimate(data),
  });

  const handleEstimate = () => {
    if (!form.jobDescription) return;
    estimateMut.mutate(form);
  };

  const createQuoteFromEstimate = () => {
    if (!estimate) return;
    onNavigate("quotes", {
      fromAgent: true,
      title: form.jobDescription,
      description: `${form.propertyType} - ${form.urgency} priority`,
      notes: estimate.notes,
      lineItems: estimate.estimatedLineItems.map((item: any, idx: number) => ({
        id: `agent-${idx}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        category: item.category,
      })),
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <Bot className="w-6 h-6 text-indigo-600" />
        AI Quote Agent
        <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">BETA</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> Describe the Job
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Description *</label>
              <textarea value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
                rows={4} placeholder="e.g. Replace hot water tank in basement, install new 50 gallon unit..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
              <select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500">
                {jobTypes.map((jt: any) => (
                  <option key={jt.value} value={jt.value}>{jt.label} - {jt.description}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Urgency</label>
              <div className="flex gap-2">
                {(["normal", "urgent", "emergency"] as const).map((u) => (
                  <button key={u} onClick={() => setForm({ ...form, urgency: u })}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors capitalize",
                      form.urgency === u
                        ? u === "emergency" ? "bg-red-50 border-red-300 text-red-700"
                        : u === "urgent" ? "bg-amber-50 border-amber-300 text-amber-700"
                        : "bg-green-50 border-green-300 text-green-700"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    )}>
                    {u}
                  </button>
                ))}
              </div>
              {form.urgency === "urgent" && <p className="text-xs text-amber-600 mt-1">+25% surcharge</p>}
              {form.urgency === "emergency" && <p className="text-xs text-red-600 mt-1">+50% surcharge + call-out fee</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Property Type</label>
              <div className="flex gap-2">
                {(["residential", "commercial"] as const).map((pt) => (
                  <button key={pt} onClick={() => setForm({ ...form, propertyType: pt })}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors capitalize",
                      form.propertyType === pt
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    )}>
                    {pt}
                  </button>
                ))}
              </div>
              {form.propertyType === "commercial" && <p className="text-xs text-indigo-600 mt-1">+15% commercial rate</p>}
            </div>

            <button onClick={handleEstimate} disabled={!form.jobDescription || estimateMut.isPending}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium">
              <Brain className="w-5 h-5" />
              {estimateMut.isPending ? "Generating..." : "Generate Estimate"}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
            <h4 className="font-medium text-indigo-800 flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4" /> Tips for Best Results
            </h4>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li className="flex gap-2"><span className="text-indigo-400">1.</span> Be specific about what needs to be done</li>
              <li className="flex gap-2"><span className="text-indigo-400">2.</span> Mention the type of fixture or pipe</li>
              <li className="flex gap-2"><span className="text-indigo-400">3.</span> Include location details (basement, kitchen, etc.)</li>
              <li className="flex gap-2"><span className="text-indigo-400">4.</span> Note any special conditions (emergency, after hours)</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {!estimate && !estimateMut.isPending && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <Bot className="w-16 h-16 mx-auto mb-4 text-indigo-200" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">AI Quote Estimator</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Describe the plumbing job and I'll generate a detailed estimate with line items,
                materials, labor costs, and a total price based on Ontario rates.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["Faucet replacement", "Water heater install", "Drain cleaning", "Pipe repair", "Sump pump"].map((ex) => (
                  <button key={ex} onClick={() => setForm({ ...form, jobDescription: ex })}
                    className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {estimateMut.isPending && (
            <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-12 text-center">
              <div className="animate-pulse">
                <Brain className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
                <p className="text-indigo-600 font-medium">Analyzing job and generating estimate...</p>
              </div>
            </div>
          )}

          {estimate && (
            <div className="space-y-4">
              {/* Confidence & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <BarChart3 className="w-4 h-4" /> Confidence
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div className="bg-indigo-600 h-3 rounded-full transition-all"
                        style={{ width: `${(estimate.confidence || 0) * 100}%` }} />
                    </div>
                    <span className="text-lg font-bold text-indigo-700">
                      {Math.round((estimate.confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Clock className="w-4 h-4" /> Estimated Duration
                  </div>
                  <p className="text-lg font-bold text-slate-900">{estimate.estimatedDuration}</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-5 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                  <h3 className="font-medium text-indigo-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Estimated Line Items
                  </h3>
                  <button onClick={createQuoteFromEstimate}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Create Quote <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Description</th>
                      <th className="text-left px-5 py-3 text-sm font-medium text-slate-600">Category</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-slate-600">Qty</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-slate-600">Unit Price</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-slate-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {estimate.estimatedLineItems?.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-sm">{item.description}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full capitalize">{item.category}</span>
                        </td>
                        <td className="px-5 py-3 text-sm text-right">{item.quantity}</td>
                        <td className="px-5 py-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-5 py-3 text-sm text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200">
                      <td colSpan={4} className="px-5 py-2 text-sm text-right font-medium text-slate-600">Subtotal:</td>
                      <td className="px-5 py-2 text-sm text-right font-medium">{formatCurrency(estimate.estimatedTotal || 0)}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-5 py-2 text-sm text-right font-medium text-slate-600">HST (13%):</td>
                      <td className="px-5 py-2 text-sm text-right font-medium">{formatCurrency((estimate.estimatedTotal || 0) * 0.13)}</td>
                    </tr>
                    <tr className="border-t border-slate-200">
                      <td colSpan={4} className="px-5 py-3 text-right font-bold text-indigo-700 text-lg">Total:</td>
                      <td className="px-5 py-3 text-right font-bold text-indigo-700 text-lg">{formatCurrency((estimate.estimatedTotal || 0) * 1.13)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Notes */}
              {estimate.notes && (
                <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
                  <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> Notes
                  </h4>
                  <div className="text-sm text-amber-700 whitespace-pre-line">{estimate.notes}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
